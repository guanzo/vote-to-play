<template>
    <div class="game" :class="game.className">
        <transition :duration="delayDuration" name="fade">
            <component 
                v-if="!isLoading" 
                :is="injectedComponent" 
                v-bind="propsObj"
            >

                <template slot="controls">
                    <div v-for="filter in game.filters" class="control" :key="filter.id">
                        <input v-if="filter.type == 'text'" 
                                v-model.trim="filter.vmodel" 
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
					<div class="control show-names flex-center">
						<label class="checkbox">
						<input v-model="showNameInGrid" type="checkbox">
						Show names
						</label>
					</div>
                </template>
            </component>
            <div v-else class="absolute-center">
                <loading dark class="absolute-center" />
            </div>
            
        </transition> 
    </div>
</template>

<script>

import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'
import { GET_CANDIDATES, TOGGLE_SHOW_NAME_IN_GRID } from '@/store/actions'
import loading from '@/components/util/loading/Loading'
import { delayPromise } from '@/util'
/**
 * Generic component that serves all supported games.
 * 
 * voteCategory is either fed by
 * -Viewer: set by the streamer's selected game in dashboard
 * -Config: streamer is configuring whitelist
 * 
 * injected Component is either
 * -Voter.vue
 * -Whitelist.vue
 */

export default {
    name: 'game',
    props:{
        injectedComponent: Object,
        voteCategory: String
    },
    data(){
        return {
            isLoading: false,
			delayDuration: 750
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
			let filteredCandidates    =	getters[this.namespace+'/filteredCandidates']
			let { gameOptions, filters } = this.game
            return {
                voteCategory: this.voteCategory,
                candidates: this.candidates,
                filteredCandidates,
				whitelistedCandidates,
				gameOptions,
				filters,
            }
		},
        showNameInGrid: {
            get () {
                return this.game.gameOptions.showNameInGrid
            },
            set (value) {
                this.$store.commit(this.namespace+'/'+TOGGLE_SHOW_NAME_IN_GRID, value)
            }
        },
        isAllGames(){
            return this.namespace === ALL_GAMES
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
        'game.filters.0.vmodel'(query = ''){
            if(this.isAllGames && query.length > 0)
                this.$store.dispatch(this.namespace+'/searchGames',query)
        }, 
    },
    created(){
        this.fetchCandidates()
    },
    methods:{
        async fetchCandidates(){
            if(this.candidates.length || this.isLoading){
                console.log('returning')
                return;
            }

            this.isLoading = true
            await Promise.all([
                this.$store.dispatch(this.namespace+'/'+GET_CANDIDATES),
                delayPromise(this.delayDuration)
            ])
            this.isLoading = false
        },
    },
    components:{
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
	.voter .show-names label:hover{
		color: #eee;
	}
}
/**
Base img dimensions are targeted towards the viewer route.
Depending on the route, these dimensions are scaled from the base.

General rules:
-Vertical images must be scaled down considerably in .voter-header and .vote-results
-Images are larger than base in .white-list
-Images are smaller than base in .voter-header && .vote-results
*/
@mixin scale-img-size($width, $height, $scale: 1){
    .image-wrapper{
		width: $width * $scale;
    	height: $height * $scale;
	}
}
//used to limit candidate names length to force ellipsis on text overflow
@mixin scale-candidate-size($width, $scale: 1){
	.candidate{
		max-width: $width * $scale;
	}
}


.all-games {
    
    $w: 72px;
    $h: 100px;
    @include scale-img-size($w,$h);
    @include scale-candidate-size($w);

    .voter-header{
        @include scale-img-size($w,$h,.75);
    }
    .vote-form{
        overflow: hidden;
        flex: 1; //ensure always full width, so the div doesn't jump around when querying
    }
}

.battlerite{
    //original 292x160
    $w: 125px;
    $h: 68px;
    
    @include scale-img-size($w,$h);
    @include scale-candidate-size($w);
    
    .voter-header{
        @include scale-img-size($w,$h,0.75);
    }
    .vote-results {
        @include scale-img-size($w,$h,0.5);
    }
    .whitelist{
		$scale: 1.25;
        @include scale-img-size($w,$h,$scale);
		@include scale-candidate-size($w,$scale);
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
    
    @include scale-img-size($w,$h);
    @include scale-candidate-size($w);
    .whitelist{
		$scale: 1.15;
        @include scale-img-size($w,$h,$scale);
		@include scale-candidate-size($w,$scale);
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
    @include scale-img-size($w,$h);
    @include scale-candidate-size($w);
    
    .voter-header{
        @include scale-img-size($w,$h,.6);
    }
    .vote-results {
        @include scale-img-size($w,$h,.4);
    }    
}
.heroes-of-the-storm{
    //original 75x75
    $w: 55px;
    $h: 55px;
    
    @include scale-img-size($w,$h);
    @include scale-candidate-size($w);
    .whitelist{
		$scale: 1.2;
        @include scale-img-size($w,$h,$scale);
		@include scale-candidate-size($w,$scale);
    }
    
}
.league-of-legends{
    //120x120 original
    $w: 45px;
    $h: 45px;
   
    @include scale-img-size($w,$h);
    @include scale-candidate-size($w);
    
    .whitelist{
		$scale: 1.15;
        @include scale-img-size($w,$h,$scale);
		@include scale-candidate-size($w,$scale);
    }
}
.overwatch{
    $w: 58px;
    $h: 100px;
    
    @include scale-img-size($w,$h);
    @include scale-candidate-size($w);
    
    .voter-header{
        @include scale-img-size($w,$h,.75);
    }
    .vote-results {
        @include scale-img-size($w,$h,.5);
    }
    .whitelist{
		$scale: 1.25;
        @include scale-img-size($w,$h,$scale);
		@include scale-candidate-size($w,$scale);
    }
    select{
        text-transform: capitalize;
    }
}
.world-of-tanks{
    //160x100 original
    $w: 80px;
    $h: 50px;
    
    @include scale-img-size($w,$h);
    @include scale-candidate-size($w);
    
    .voter-header{
        @include scale-img-size($w,$h,.85);
    }
    .vote-results {
        @include scale-img-size($w,$h,.85);
    }
    .splash-img-container img.splash-img{
        object-fit: contain;
    }
}

</style>
