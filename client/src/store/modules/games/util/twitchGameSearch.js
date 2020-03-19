
const TWITCH_SEARCH_URL = 'https://api.twitch.tv/kraken/search/games'

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
                                'Client-ID': process.env.VUE_APP_EXTENSION_CLIENT_ID
                            }
                        })
                        .then(res=>{
                            const games = res.data.games
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
            let results = []

            if(query.length === 0)
                return resolve(results)

            this.engine.search(query,
                syncMatches=>{
                    syncMatches = _.take(syncMatches,this.maxQueryMatches)
                    results.push(...syncMatches)
                    if(!this.willRequestRemote(syncMatches))
                        resolve(results)
                },
                asyncMatches=>{
                    this.engine.add(asyncMatches)
                    asyncMatches = _.take(asyncMatches,this.maxQueryMatches)
                    results.push(...asyncMatches)
                    results = _.uniqBy(results,'name')
                    resolve(results)
                })
        })
    }
    willRequestRemote(syncMatches){
        return syncMatches.length < this.engine.sufficient
    }
}
