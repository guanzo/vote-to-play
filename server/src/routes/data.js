const axios = require('axios')
const _ = require('lodash')
const cache = require('memory-cache');
/**
 * Makes api calls on behalf of browser, to circumvent cors
 */
function getDotaHeroes(){
	return axios.get('https://www.dota2.com/jsfeed/heropickerdata').then(res=>res.data)
}

const WOT_API_URL = `https://api.worldoftanks.com/wot/encyclopedia/vehicles/`
const WOT_API_KEY = process.env.WORLD_OF_TANKS_API_KEY
const fields = 'name,nation,short_name,tag,tank_id,tier,type,images.big_icon'
const limit = 100;
const cache_expire = 86400000;//1 day
const cache_key = 'worldoftanks'
/**
 * Get all tanks, and cache for a day. 
 */
async function getWorldOfTanksData(){
	let data = cache.get(cache_key)
	if(data === null){
		data = await requestWorldOfTanksData();
		cache.put(cache_key,data,cache_expire)
	}
	return data;
}

async function requestWorldOfTanksData(){
	let totalPages = 0;
	let currentPage = 1;
	let data = []

	function requestPage(page){
		return axios.get(WOT_API_URL,{
			params:{
				application_id: WOT_API_KEY,
				fields,
				limit,
				page_no: page
			}
		})
		.then((response)=>{
			totalPages = response.data.meta.page_total
			let tanks = _(response.data.data).map((val,key)=>{
				val.name = val.short_name;
				let icon = val.images.big_icon.replace(/^http/,'https')
				val.img = icon;
				val.imgSplash = null;
				return val
			})
			.value()

			data.push(...tanks)
		})
		.catch(console.error)
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
	return _.orderBy(data,'tier',['desc'])
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
	
}