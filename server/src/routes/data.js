const axios = require('axios')
const _ = require('lodash')
const cache = require('memory-cache');
/**
 * Makes api calls on behalf of browser, to circumvent cors
 */
function getDotaHeroes(){
	return axios.get('https://www.dota2.com/jsfeed/heropickerdata').then(res=>res.data)
}

const WARGAMING_API_KEY = process.env.WORLD_OF_TANKS_API_KEY
const limit = 100;
const cache_expire = 86400000;//1 day

/**
 * Get all tanks, and cache for a day. 
 */
async function getWorldOfTanksData(){
	const API_URL = `https://api.worldoftanks.com/wot/encyclopedia/vehicles/`
	const FIELDS = 'name,nation,short_name,tag,tank_id,tier,type,images.big_icon'
	const WOT_CACHE_KEY = 'worldoftanks'
	let data = cache.get(WOT_CACHE_KEY)
	if(data === null){
		data = await requestWargamingData(API_URL, FIELDS, parseTank);
		cache.put(WOT_CACHE_KEY, data, cache_expire)
	}
	return data;
}

function parseTank(val, key) {
	val.id = parseInt(key);
	val.name = val.short_name;
	val.img = val.images.big_icon.replace(/^http/,'https');
	val.imgSplash = null;
	delete val.tank_id 
	return val
}

/**
 * Get all ships, and cache for a day. 
 */
async function getWorldOfWarshipsData() {

	const API_URL = 'https://api.worldofwarships.com/wows/encyclopedia/ships/'
	const FIELDS = 'name,nation,ship_id,tier,type,images'
	const WOW_CACHE_KEY = 'worldofwarships'
	let data = cache.get(WOW_CACHE_KEY)
	if(data === null){
		data = await requestWargamingData(API_URL, FIELDS, parseShip);
		cache.put(WOW_CACHE_KEY, data, cache_expire)
	}
	return data;
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

async function requestWargamingData(url, fields, parseItem){
	let totalPages = 0;
	let currentPage = 1;
	let data = []

	async function requestPage(page){
		let response = await axios.get(url,{
			params:{
				application_id: WARGAMING_API_KEY,
				fields,
				limit,
				page_no: page
			}
		})
		totalPages = response.data.meta.page_total
			let items = _(response.data.data).map(parseItem).value()
			data.push(...items)
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

module.exports = (app) => {
	//v1.7 compatibility
    app.get('/api/heroes/dota', async (req, res) => {
		let data = await getDotaHeroes();
		res.send(data)
	})
	
    app.get('/api/dota', async (req, res) => {
		let data = await getDotaHeroes();
		res.send(data)
	})

    app.get('/api/worldoftanks', async (req, res) => {
        let data = await getWorldOfTanksData();
		res.send(data)
	})
    app.get('/api/worldofwarships', async (req, res) => {
        let data = await getWorldOfWarshipsData();
		res.send(data)
	})
	
}