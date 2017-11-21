<template>
    <div v-if="candidates.length" class="game" :class="game.className">
        <transition :duration="duration" name="fade">
            <component 
                v-if="!isLoading" 
                :is="injectedComponent" 
                v-bind="propsObj"
            >
                <div v-if="game.filters" slot="filters">
                    <template v-for="filter in game.filters">
                        <input v-if="filter.type == 'text'" 
                                v-model="filter.vmodel" 
                                :placeholder="filter.placeholder"
                                :key="filter.id"
                        >
                        <select v-else-if="filter.type == 'select'" 
                                v-model="filter.vmodel"
                                :key="filter.id">
                            <option v-for="role in filter.options" :key="role">{{ role }}</option>
                        </select>
                        &nbsp;
                    </template>
                </div>
            </component>
            <loading v-else dark class="absolute-center"></loading>
        </transition> 
    </div>
</template>

<script>

import voter from '@/components/viewer/voter/Voter'
import voteResults from '@/components/voteresults/VoteResults'
import { GET_CANDIDATES } from '@/store/actions'
import loading from '@/components/loading/Loading'
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
        candidates(){
            return this.game.candidates
        },
        namespace() { return this.game.gameName   },
        propsObj(){
            let game = this.game;
            return {
                candidates: game.candidates,
                filteredCandidates: this.filteredCandidates,
                whitelistedCandidates: this.whitelistedCandidates,
                showName: game.showNameInGrid,
                voteCategory: this.voteCategory
            }
        },
        filteredCandidates(){
            return this.$store.getters[this.namespace+'/filteredCandidates']
        },
        whitelistedCandidates(){
            return this.$store.getters[this.namespace+'/whitelistedCandidates']
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
        }
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
    .fade-leave-active{
        position: absolute !important;
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
        @include scale-img-size($w,$h,1.25);
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
    .voter {
        .candidate-wrapper{
            //width: 95px;
            //flex: 0 1 20%;
        }
    }
    .voter-header .image-wrapper{
        width: 56px;
        height: 90px;
    }
    .vote-results .image-wrapper {
        width: 38px;
        height: 60px;
    }
    .whitelist .image-wrapper{
        @include scale-img-size($w,$h,1.5);
    }
}
.heroes-of-the-storm{
    //original 75x75
    $w: 55px;
    $h: 55px;
    .image-wrapper{
        @include scale-img-size($w,$h);
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
        @include scale-img-size($w,$h,1.25);
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
    select{
        text-transform: capitalize;
    }
}

</style>
