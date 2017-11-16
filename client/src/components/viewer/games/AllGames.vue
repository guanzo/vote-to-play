<template>

<div class="all-games">
    <voter class="voter-all-games" :candidates="candidates" :filteredCandidates="candidates">
        <div class="game" slot-scope="{ candidate }" slot="candidate">
            <div class="image-wrapper candidate">
                <img :src="candidate.img">
            </div>
            <div class="game-name">
                <div class="ellipsis">{{ candidate.name }}</div>
            </div>
        </div>
        <div slot="filters">
            <input v-model="query" placeholder="Search games">
        </div>
    </voter>
    <vote-results :maxResults="maxResults"></vote-results>
</div>

</template>

<script> 

import voter from '@/components/viewer/voter/Voter'
import voteResults from '../voteresults/VoteResults'
import { GET_TOP_TWITCH_GAMES } from '@/store/actions'
import { NS_ALLGAMES } from '@/store/modules/games/allGames'

const TWITCH_SEARCH_URL = 'https://api.twitch.tv/kraken/search/games'

import { SET_SEARCHED_GAMES } from '@/store/mutations'

/*
If no query, show popular games, else show games that match query
*/

export default {
    name: 'all-games',
    data(){
        return {
            query:'',
            maxResults: 5,
            engine: null,
        }
    },
    computed:{
        ...Vuex.mapState(NS_ALLGAMES,['topGames','searchedGames']),
        candidates(){
            return this.query.length ? this.searchedGames : this.topGames
        }
    },
    watch:{
        topGames(topGames){
            this.engine.add(topGames)
        },
        query(query){
            this.search(query)
        }
    },
    created(){
        this.$store.dispatch(NS_ALLGAMES+'/'+GET_TOP_TWITCH_GAMES)

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
        search: function(query){
            if(!this.engine)//wait for ajax
                return;
            if(query.length == 0)
                return this.$store.commit(NS_ALLGAMES+'/'+SET_SEARCHED_GAMES, { searchedGames: [] })
            var maxResults = 10;
            this.engine.search(query,this.syncCallback,this.asyncCallback)
        },
        syncCallback(queryMatches){
            queryMatches = _.take(queryMatches,20)
            this.$store.commit(NS_ALLGAMES+'/'+SET_SEARCHED_GAMES, { searchedGames: queryMatches })
        },
        asyncCallback(queryMatches){
            this.engine.add(queryMatches)
            queryMatches = _.take(queryMatches,20)
            this.$store.commit(NS_ALLGAMES+'/'+SET_SEARCHED_GAMES, { searchedGames: queryMatches })
        },
    },
    components:{
        voter,
        voteResults,
    }
}
</script>

<style lang="scss">

.all-games{
    
    img {
        width: 100%;
        height: auto;
    }
    .voter-header .image-wrapper{
        width: 52px;
        height: 72px;
    }
    .image-wrapper{
        width: 72px;
        height: 100px;
    }
    .voter-all-games{
        overflow: hidden;
        flex: 1; //ensure always full width, so the div doesn't jump around when querying
        .game{
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 72px;
            font-size: 12px;
            margin: 3px;
            .game-name {
                max-width: 100%;
            }
        }
    }
}


</style>
