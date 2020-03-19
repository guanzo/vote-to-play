const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const axios = require('axios')
const cheerio = require('cheerio')
const _ = require('lodash')
const cache = require('memory-cache');

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const candidatesDir = path.resolve(__dirname, '../../public/static/json')

const WARGAMING_API_KEY = process.env.WORLD_OF_TANKS_API_KEY
const PAGE_LIMIT = 100;
const CACHE_EXPIRE = 86400000;//1 day

const WOT_OPTIONS = {
	url: `https://api.worldoftanks.com/wot/encyclopedia/vehicles/`,
	fields: 'name,nation,short_name,tag,tank_id,tier,type,images.big_icon',
	cacheKey: 'worldoftanks',
	parseDataCb: parseTank
}

const WOW_OPTIONS = {
	url: 'https://api.worldofwarships.com/wows/encyclopedia/ships/',
	fields: 'name,nation,ship_id,tier,type,images',
	cacheKey: 'worldofwarships',
	parseDataCb: parseShip
}

const DOTA_CACHE_KEY = 'dota'
const LOL_CACHE_KEY = 'lol'
const APEX_LEGENDS_CACHE_KEY = 'apexlegends'

function parseTank(val, key) {
	val.id = parseInt(key);
	val.name = val.short_name;
	val.img = val.images.big_icon.replace(/^http/,'https');
	delete val.tank_id
	return val
}

function parseShip(val, key) {
	val.id = parseInt(key);
	if (val.name.startsWith('[') && val.name.endsWith(']')) {
		val.name = val.name.slice(1, -1) // Name comes surrounded by brackets
	}
	val.img = val.images.small
	delete val.ship_id
	return val
}

async function getWargamingData({ url, fields, cacheKey, parseDataCb }) {
	let data = cache.get(cacheKey)
	if(data === null){
		data = await requestWargamingData(url, fields, parseDataCb);
		cache.put(cacheKey, data, CACHE_EXPIRE)
	}
	return data;
}

async function requestWargamingData(url, fields, parseItem){
	let totalPages = 0;
	let currentPage = 1;
	let data = []

	async function requestPage(page){
		let response = await axios.get(url,{
			params:{
				application_id: WARGAMING_API_KEY,
				fields,
				PAGE_LIMIT,
				page_no: page
			}
		})
		cl(response)
		totalPages = response.data.meta.page_total
		let items = _(response.data.data).map(parseItem).value()
		data.push(...items)
		return
	}
	//get page total from first request, then request the rest
	await requestPage(currentPage)
	currentPage++;

	let promises = []
	while(currentPage <= totalPages){
		promises.push(requestPage(currentPage))
		currentPage++;
	}
	await Promise.all(promises)

	//https://mail.google.com/mail/u/0/#inbox/1609c0cbff89f272
	//Matthew Brozusky:
	//"A majority of streamers for this game focus on higher tier tanks (tier 8-10)
	//so filtering by tier would be the best option for you last question."
	return _(data).orderBy('tier',['desc']).uniqBy('name').value()
}

/**
 * Makes api calls on behalf of browser, to circumvent cors
 */
async function getDotaData(){
	let data = cache.get(DOTA_CACHE_KEY)
	if(data === null){
		data = await axios.get('https://www.dota2.com/jsfeed/heropickerdata').then(res=>res.data)
		cache.put(DOTA_CACHE_KEY, data, CACHE_EXPIRE)
	}
	return data
}

async function getLolData () {
	let data = cache.get(LOL_CACHE_KEY)
	if(data === null){
		data = await fetchLolData()
		cache.put(LOL_CACHE_KEY, data, CACHE_EXPIRE)
	}
	return data
}

async function fetchLolData () {
	const API_BASE_URL = 'https://ddragon.leagueoflegends.com/'
	const VERSION_URL = API_BASE_URL + 'realms/na.json'
	const CDN_BASE_URL = API_BASE_URL + 'cdn/'

	const championDataUrl = (apiVersion) => {
		return `${CDN_BASE_URL}${apiVersion}/data/en_US/champion.json`
	}
	const imgUrl = (apiVersion, name) => {
		return `${CDN_BASE_URL}${apiVersion}/img/champion/${name}`
	}

	let resp = await axios.get(VERSION_URL)
	const { champion: championVersion, profileicon: iconVersion } = resp.data.n

	resp = await axios.get(championDataUrl(championVersion))
	const candidates = _(resp.data.data).map((val)=>{
		val.name = val.id;
		val.img = imgUrl(iconVersion, val.image.full)
		return val
	}).sortBy('name').value()
	return candidates
}

async function getHotsData () {
	const API_ORIGIN = 'https://www.hotslogs.com'
	const HEROES__URL = `${API_ORIGIN}/api/Data/Heroes`
	const IMG_BASE_URL = `${API_ORIGIN}/Images/Heroes/Portraits/`
	
	const res = await axios.get(HEROES__URL)
	const candidates = _(res.data).map((val)=>{
		val.id = val.PrimaryName
			val.name = val.PrimaryName;
			val.img = IMG_BASE_URL + val.ImageURL + '.png';
			return val
		}).sortBy('name').value()

	return candidates
}

async function getApexLegendsData () {
	let data = cache.get(APEX_LEGENDS_CACHE_KEY)
	if (data) {
		return data
	}

	try {
		data = await fetchApexLegendsData()
	} catch (e) {
		cl(e)
	}
	const filePath = path.resolve(candidatesDir, 'apex_legends.json')

	if (Array.isArray(data) && data.length > 0) {
		await writeFile(filePath, JSON.stringify(data))
	} else if (fs.existsSync(filePath)) {
		const buffer = await readFile(filePath)
		data = JSON.parse(buffer.toString())
		// I'm retrieving candidates by scraping the DOM. The DOM could
		// change over time, so save successful retrievals to disk, and
		// retrieve the data from disk in case the DOM retrieval method fails.
	}
	cache.put(APEX_LEGENDS_CACHE_KEY, data, CACHE_EXPIRE)

	return data
}

async function fetchApexLegendsData () {
	const resp = await axios.get('https://www.ea.com/games/apex-legends/about/characters')
	const $ = cheerio.load(resp.data)

	const candidates = []

	$('ea-tile[byline-text="apex-legends-character"]').each(function () {
		const $this = $(this)
		const img = $this.attr('media')
		// The title-text attr is a name surrounded by html bold
		// For ex: <b>Bangalore</b>
		const nameHTML = $this.attr('title-text')
		const name = cheerio.load(nameHTML).text()
		candidates.push({ img, name, id: name })
	})

	return candidates
}

module.exports = (app) => {
    app.get('/api/dota', async (req, res) => {
		let data = await getDotaData();
		res.send(data)
	})
    app.get('/api/lol', async (req, res) => {
		let data = await getLolData();
		res.send(data)
	})
    app.get('/api/hots', async (req, res) => {
		let data = await getHotsData();
		res.send(data)
	})
    app.get('/api/worldoftanks', async (req, res) => {
        let data = await getWargamingData(WOT_OPTIONS);
		res.send(data)
	})
    app.get('/api/worldofwarships', async (req, res) => {
        let data = await getWargamingData(WOW_OPTIONS);
		res.send(data)
	})
    app.get('/api/apexlegends', async (req, res) => {
        let data = await getApexLegendsData();
		res.send(data)
	})
}
