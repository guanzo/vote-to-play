<template>
    <transition name="fade-vertical">
        <div v-if="showUI" class="voter-section overlay-background" :class="{'splash-img': !showControls}" >
        <!--<button @click="exitTransition">yo</button>-->
            
            <div class="your-vote">
                <div v-if="!hasSelectedVote" class="default-vote flex-center">
                    <div class="image-wrapper flex-center">
                        &#63;
                    </div>
                    &nbsp;
                    Your Vote
                </div>
                <div v-else class="flex-center">
                    <div class="image-wrapper flex-center">
                        <img :src="selectedVote.img" :alt="selectedVote.img">
                    </div>
                    <span>{{ selectedVote.name }}</span>
                </div>
            </div>
            <div class="image-grid" ref="grid">
                <div v-for="(hero,i) in heroes"
                    @click="selectVote(hero,i)"
                    :class="filterClass(hero)" 
                    class="image-wrapper" 
                    :key="hero.name"
                >
                    <img :src="hero.img" :alt="hero.name">
                </div>
            </div>

            <submit-vote-footer :class="{ 'invisible': !showControls }" slot="submit-vote-footer" 
                :hasSelectedVote="hasSelectedVote" 
                :vote="selectedVote.name"
            >
                
            <div :class="{ 'invisible': !showControls }"  class="filter-section field is-horizontal">
                <div class="field-body">
                    <slot name="filters">
                    </slot>
                </div>
            </div>
            </submit-vote-footer> 
        </div>
    </transition>
</template>

<script>


import axios from 'axios'
import _ from 'lodash'
import PF from 'pathfinding'
import {easeCubicOut,interpolate} from 'd3'
//import * as d3 from 'd3'
import { mapState } from 'vuex'
import submitVoteFooter from './SubmitVoteFooter'
import isEmpty from 'lodash/isEmpty'
import { GET_HEROES } from '@/store/actions'
import { NAMESPACE_DOTA } from '@/store/modules/dota'

export default {
    name: 'voter-section',
    props:['heroes','filteredHeroes'],
    data(){
        return {
            selectedVote: {},
            showControls: true,
            transitionDone: false
        }
    },
    computed:{
        game(){
            return this.$store.getters.getSelectedGameModule
        },
        hasSubmittedVote(){
            return this.$store.getters.hasSubmittedVote
        },
        hasSelectedVote(){
            return !isEmpty(this.selectedVote);
        },
        hasActiveFilter(){
            return this.filteredHeroes.length < this.heroes.length
        },
        showUI(){
            return !this.hasSubmittedVote || !this.transitionDone
        },
    },
    watch:{
        hasSubmittedVote(newVal){
            if(newVal)
                this.exitTransition()
            else{
                this.transitionDone = false;
                this.showControls = true;
                Array.from(this.$refs.grid.querySelectorAll('.image-wrapper'))
                    .forEach(el=>el.classList.remove('traversed'))
            }
        }
    },
    methods:{
        filterClass(hero){
            if(!this.hasActiveFilter)
                return ''
            return this.passesFilter(hero) ? 'filtered-in': 'filtered-out'
        },
        passesFilter(hero){
            return this.filteredHeroes.find(d=>d.name == hero.name)
        },
        selectVote(vote,i){
            this.selectedVote = vote
        },
        exitTransition(){
            this.showControls = false;

            let $grid = this.$refs.grid
            let $cell = $grid.firstChild
            //cells have margins on all sides, add to width/height 
            let m = parseInt(window.getComputedStyle($cell).margin.replace('px'))

            let { offsetWidth: gridWidth, offsetHeight: gridHeight } = $grid
            let { offsetWidth: cellWidth, offsetHeight: cellHeight } = $cell;
            
            cellWidth += m*2;
            cellHeight += m*2;
            let rows = Math.floor(gridHeight/cellHeight)
            let columns = Math.floor(gridWidth/cellWidth)
            
            let heroIndex = _.findIndex(this.heroes,hero=>this.selectedVote.name == hero.name)
            let heroCoords = this.getCoordsFromIndex(heroIndex, columns)
            var grid = new PF.Grid(columns,rows); 
            let heroNode = grid.getNodeAt(heroCoords.x,heroCoords.y)

            this.traverse(heroNode, grid)
                .then(()=>new Promise((resolve, reject)=>setTimeout(resolve, 5000)))
                .then(()=>{
                    this.transitionDone = true
                })

        },        
        traverse(startNode, grid){
            let self = this;
            
            return new Promise((resolve)=>{
                var duration = 1000,
                    startTime = new Date(),
                    elapsed,
                    maxInterval = 200,
                    minInterval = 50,
                    interpolator = interpolate(maxInterval,minInterval),
                    progress = 0,
                    nodesChecked = 0,
                    gridSize = grid.width * grid.height

                var openList = [],
                    diagonalMovement = PF.DiagonalMovement.Always,
                    neighbors, neighbor, nodes, i, l;
                // push the start pos into the queue
                openList.push(startNode);
                startNode.opened = true;
                
                function step(){
                    if(openList.length == 0){
                        resolve()
                        return;
                    }

                    nodes = openList.splice(0, openList.length);
                    nodes.forEach(node=>node.closed = true)
                    
                    neighbors = _(nodes).map(node=>grid.getNeighbors(node, diagonalMovement)).flatMap().value();
                    
                    for (i = 0, l = neighbors.length; i < l; ++i) {
                        neighbor = neighbors[i];

                        let { x,y } = neighbor
                        let index = self.getIndexFromCoords(x,y,grid.width)
                        let cell = self.$refs.grid.children[index]
                        if (!cell || neighbor.closed || neighbor.opened) {
                            continue;
                        }
                        cell.classList.add('traversed')
                        
                        openList.push(neighbor);
                        neighbor.opened = true;
                    }
                    nodesChecked += openList.length;
                    progress = nodesChecked/self.heroes.length

                    var elapsed = new Date() - startTime;
                    var normalizedTime = Math.min(elapsed,duration)/duration
                    var easedTime = easeCubicOut(normalizedTime);

                    setTimeout(step, interpolator(easedTime))
                }
                step();
            })
        },
        getCoordsFromIndex(i,width){
            let x = i%width
            let y = Math.floor(i/width)
            return { x, y }
        },
        getIndexFromCoords(x,y, width){
            return x + y*width
        },
    },
    components:{
        submitVoteFooter,
    }
}

</script>

<style lang="scss">

.voter-section{
    padding: 15px;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    &.splash-img{
        background:url('https://i.imgur.com/s7Vfijd.jpg');
        background-size: cover;
        background-position: center;
    }
    .invisible{
        transition: .3s;
        opacity: 0;
    }
     .image-grid{
        position: relative;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        
        .image-wrapper{
            margin: 2px;
            position: relative;
            transition: .5s;
            cursor: pointer;
            &.filtered-out {
                filter: brightness(20%);
            }
            &.filtered-in {
                box-shadow: 0px 0px 2px 1px white;
            }
            &.traversed {
                transition: 1s ease-out;
                opacity: 0;
                transform: scale(0);
            }
            &:hover:before {
                box-shadow: 0px 0px 0px 3px #eee inset;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                content: "";
            }
        }
    }
    button{
        float: right;
    }
    .filter-section {
        min-height: 40px;
        margin-bottom: 5px;
    }
    
}


.default-vote {
    .image-wrapper{
        background: #333;
    }
}
.your-vote {
    display: flex;
    margin-bottom: 20px;
    justify-content: center;
    font-size: 1.5em;
    color: white;
    text-shadow: #000 0px 0px 2px;
    .image-wrapper{
        margin-right: 10px;
    }
}

</style>