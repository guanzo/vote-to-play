
const TWITCH_SEARCH_URL = 'https://api.twitch.tv/kraken/search/games'

import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'
import { SET_SEARCHED_GAMES } from '@/store/mutations'

export default class GameSearch{
    constructor(){
        this.maxQueryMatches = 20

        this.engine = new Bloodhound({
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            datumTokenizer(datum){
                return Bloodhound.tokenizers.whitespace(datum.name)
            },
            identify: obj => obj._id,
            sufficient: 5,
            remote:{
                url: TWITCH_SEARCH_URL,
                prepare: (query, settings)=>{
                    settings.url = settings.url + `?query=${query}`
                    return settings
                },
                rateLimitBy: 'throttle',
                rateLimitWait: 500,
                transport: (settings)=>{
                    return axios.get(settings.url,
                        {
                            headers: {
                                Accept: 'application/vnd.twitchtv.v5+json',
                                'Client-ID': EXTENSION_CLIENT_ID
                            }
                        })
                        .then(res=>{
                            let games = res.data.games
                            return games !== null ? games : []
                        })
                }
            },
        });

    }
    addTopGames(topGames){
        this.engine.add(topGames)
    }
    searchGames(query){
        return new Promise(resolve=>{
            let results = [],
                maxResults = 10,
                requestID = Math.round(Math.random()*(100 - 1) + 1)

            if(query.length == 0)
                return resolve(results)

            this.engine.search(query,
                syncMatches=>{
                    syncMatches = _.take(syncMatches,this.maxQueryMatches)
                    results.push(syncMatches)
                    if(syncMatches.length >= this.engine.sufficient){//else asyncMatch will be called
                        console.log('SYNC DONE: ' + requestID)
                        resolve(results)
                    }
                },
                asyncMatches=>{
                    this.engine.add(asyncMatches)
                    asyncMatches = _.take(asyncMatches,this.maxQueryMatches)
                    results.push(asyncMatches)
                    console.log('BEFORE UNIQ: ' + results.length)
                    _.uniqBy(results,'name')
                    console.log('AFTER UNIQ: ' + results.length)
                    console.log('ASYNC DONE: ' + requestID)
                    resolve(results)
                })
        })
    }
    onMatch(matches, result, resolve){
        matches = _.take(matches,this.maxQueryMatches)
    }
    willRequestRemote(syncMatches){
        return syncMatches.length < this.sufficient
    }
}