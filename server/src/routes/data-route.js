const axios = require('axios')
const _ = require('lodash')
const cache = require('memory-cache');

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

function parseTank(val, key) {
	val.id = parseInt(key);
	val.name = val.short_name;
	val.img = val.images.big_icon.replace(/^http/,'https');
	val.imgSplash = null;
	delete val.tank_id
	return val
}

function parseShip(val, key) {
	val.id = parseInt(key);
	if (val.name.startsWith('[') && val.name.endsWith(']')) {
		val.name = val.name.slice(1, -1) // Name comes surrounded by brackets
	}
	val.img = val.images.small.replace(/^http/,'https')
	val.imgSplash = val.images.large.replace(/^http/,'https')
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

module.exports = (app) => {
    app.get('/api/dota', async (req, res) => {
		let data = await getDotaData();
		res.send(data)
	})
    app.get('/api/lol', async (req, res) => {
		let data = await getLolData();
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
}
