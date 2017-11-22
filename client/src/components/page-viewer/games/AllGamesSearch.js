
const TWITCH_SEARCH_URL = 'https://api.twitch.tv/kraken/search/games'

import { NAMESPACE } from '@/store/modules/games/allGames'
import { SET_SEARCHED_GAMES } from '@/store/mutations'

export default {
    data(){
        return {
            engine: null,
            maxQueryMatches: 20
        }
    },
    topGames(topGames){
        this.engine.add(topGames)
    },
    created(){
        this.engine = new Bloodhound({
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            datumTokenizer(datum){
                return Bloodhound.tokenizers.whitespace(datum.name)
            },
            identify: obj => obj._id,
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
    },
    destroyed(){
        this.engine.clear()
    },
    methods:{
        searchGames: function(query){
            if(query.length == 0)
                return this.$store.commit(NAMESPACE+'/'+SET_SEARCHED_GAMES, [])
            var maxResults = 10;
            this.engine.search(query,this.syncCallback,this.asyncCallback)
        },
        syncCallback(queryMatches){
            queryMatches = _.take(queryMatches,this.maxQueryMatches)
            this.$store.commit(NAMESPACE+'/'+SET_SEARCHED_GAMES, queryMatches )
        },
        asyncCallback(queryMatches){
            this.engine.add(queryMatches)
            queryMatches = _.take(queryMatches,this.maxQueryMatches)
            console.log(queryMatches)
            this.$store.commit(NAMESPACE+'/'+SET_SEARCHED_GAMES, queryMatches )
        },
    },
}