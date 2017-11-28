<template>
    <div class="game" :class="game.className">
        <transition :duration="duration" name="fade">
            <component 
                v-if="!isLoading" 
                :is="injectedComponent" 
                v-bind="propsObj"
            >

                <template slot="controls">
                    <div v-for="filter in game.filters" class="control" :key="filter.id">
                        <input v-if="filter.type == 'text'" 
                                v-model="filter.vmodel" 
                                :placeholder="filter.placeholder"
                                class="input" 
                                maxlength="50"
                        >
                        <div v-else-if="filter.type == 'select'" class="select">
                            <select v-model="filter.vmodel">
                                <option v-for="role in filter.options" :key="role">{{ role }}</option>
                            </select>
                        </div>
                    </div>
                </template>
            </component>
            <div v-else class="absolute-center">
                <loading dark class="absolute-center"></loading>
            </div>
            
        </transition> 
    </div>
</template>

<script>

import voter from '@/components/page-viewer/voter/Voter'
import voteResults from '@/components/voteresults/VoteResults'
import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'
import { GET_CANDIDATES } from '@/store/actions'
import loading from '@/components/util/loading/Loading'
import { delayPromise } from '@/util'
/**
 * Generic component that serves all supported games.
 * 
 * voteCategory is either fed by
 * -Viewer: streamer is changing game
 * -Config: streamer is configuring whitelist
 * 
 * injected Component is either
 * -Voter.vue
 * -Whitelist.vue
 */

export default {
    name: 'game',
    props:['injectedComponent','voteCategory'],
    data(){
        return {
            isLoading: false,
            duration: 750,
        }
    },
    computed:{
        ...Vuex.mapState(['isAuthed']),
        game(){
            return this.$store.getters.gameModuleByName(this.voteCategory)
        },
        namespace() { return this.game.gameName   },
        candidates(){ 
            return this.$store.getters[this.namespace+'/candidates']
        },
        propsObj(){
            let getters = this.$store.getters
            let whitelistedCandidates = getters[this.namespace+'/whitelistedCandidates']
            let filteredCandidates = getters[this.namespace+'/filteredCandidates']
            return {
                candidates: this.candidates,
                filteredCandidates,
                whitelistedCandidates,
                showName: this.game.showNameInGrid,
                voteCategory: this.voteCategory
            }
        },
        isAllGames(){
            return this.namespace == ALL_GAMES
        },
    },
    watch:{
        isAuthed: {
            handler(){//dota needs to access server
                if(this.isAuthed)
                    this.fetchCandidates()
            },
            immediate: false
        },
        namespace(){
            this.fetchCandidates()
        },
        'game.filters.0.vmodel'(query){
            query = query.trim()
            if(this.isAllGames && query.length > 0)
                this.$store.dispatch(this.namespace+'/searchGames',query)
        }, 
    },
    created(){
        this.fetchCandidates()
    },
    methods:{
        async fetchCandidates(){
            if(!this.candidates.length && !this.isLoading){
                this.isLoading = true;

                await Promise.all([
                    this.$store.dispatch(this.namespace+'/'+GET_CANDIDATES),
                    delayPromise(this.duration)
                ])
                this.isLoading = false
                
            }
        },
    },
    components:{
        voteResults,
        voter,
        loading
    }
}
</script>


<style lang="scss">

.game{
    position: relative;
    > .fade-leave-active{
        position: absolute !important;
    }
    .image-wrapper{
        position: relative;
    }
    img {
        width: 100%;
        height: auto;
        display: block;
    }
}
/**
Base dimensions are set for the viewer/voter components.
Depending on the view, these dimensions are scaled from the base.

General rules:
-Vertical images must be scaled down considerably in .voter-header and .vote-results
-Images are larger than base in .white-list
-Images are smaller than base in .voter-header 
*/
@mixin scale-img-size($width, $height, $scale: 1){
    width: $width * $scale;
    height: $height * $scale;
}


.all-games {
    
    $w: 72px;
    $h: 100px;
    img {
        width: 100%;
        height: auto;
    }
    .voter-header .image-wrapper{
        @include scale-img-size($w,$h,.75);
    }
    .image-wrapper{
        @include scale-img-size($w,$h);
    }
    .vote-form{
        overflow: hidden;
        flex: 1; //ensure always full width, so the div doesn't jump around when querying
    }
    .candidate{
        max-width: 72px;
        font-size: 12px;
        margin: 3px;
    }
}

.battlerite{
    //original 292x160
    $w: 125px;
    $h: 68px;
    .image-wrapper{
        @include scale-img-size($w,$h);
    } 
    .voter-header .image-wrapper{
        @include scale-img-size($w,$h,0.75);
    }
    .vote-results .image-wrapper {
        @include scale-img-size($w,$h,0.5);
    }
    .whitelist .image-wrapper{
        @include scale-img-size($w,$h,1.25);
    }
    .splash-img-container img.splash-img{
        object-fit: contain;
    }
    select{
        text-transform: capitalize;
    }
}


.dota{
    //256x144 original size.
    //64x36
    $w: 64px;
    $h: 36px;
    .image-wrapper{
        @include scale-img-size($w,$h);
    }
    .whitelist .image-wrapper{
        @include scale-img-size($w,$h,1.15);
    }
}
.hearthstone{
    $w: 90px;
    $h: 144px;
    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
    .candidate-grid{
        justify-content: center;
    }
    .image-wrapper {
        @include scale-img-size($w,$h);
    }
    .voter-header .image-wrapper{
        @include scale-img-size($w,$h,.6);
    }
    .vote-results .image-wrapper {
        @include scale-img-size($w,$h,.4);
    }
    .whitelist .image-wrapper{
        @include scale-img-size($w,$h,1.25);
    }
    
}
.heroes-of-the-storm{
    //original 75x75
    $w: 55px;
    $h: 55px;
    .image-wrapper{
        @include scale-img-size($w,$h);
    }
    .whitelist .image-wrapper{
        @include scale-img-size($w,$h,1.2);
    }
    
}
.league-of-legends{
    //120x120 original
    $w: 45px;
    $h: 45px;
    .image-wrapper{
        @include scale-img-size($w,$h);
    }
    .whitelist .image-wrapper{
        @include scale-img-size($w,$h,1.15);
    }
}
.overwatch{
    $w: 58px;
    $h: 100px;
    .image-wrapper{
        @include scale-img-size($w,$h);
    }
    .voter-header .image-wrapper{
        @include scale-img-size($w,$h,.75);
    }
    .vote-results .image-wrapper {
        @include scale-img-size($w,$h,.5);
    }
    .whitelist .image-wrapper{
        @include scale-img-size($w,$h,1.25);
    }
    select{
        text-transform: capitalize;
    }
}

</style>
