<template>
    <div class="image-grid" :style="overflow">
        <div v-for="(hero,i) in heroes"
            @click="selectVote(hero)"
            :class="[filterClass(hero),classes[i]]" 
            class="image-wrapper" 
            :key="hero.name"
        >
            <img :src="hero.img" :alt="hero.name">
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { SELECT_VOTE } from '@/store/mutations'
import Promise from 'bluebird'
import PF from 'pathfinding'
import {easeCubicOut,interpolate} from 'd3'

Promise.config({
    cancellation: true,
});

export default {
    name:'image-grid',
    props:['heroes','filteredHeroes','splashTransition'],
    data(){
        return {
            classes: Array(this.heroes.length).fill().map(d=>({ traversed: false }))
        }
    },
    computed:{
        selectedVote(){
            return this.$store.state.selectedVote
        },
        ...mapGetters(['hasSelectedVote','hasSubmittedVote']),
        hasActiveFilter(){
            return this.filteredHeroes.length < this.heroes.length
        },
        overflow(){
            return {
                overflow: !this.splashTransition.showControls ? 'hidden' : 'auto'
            }
        }
    },
    watch:{
        hasSubmittedVote(newVal){
            if(newVal)
                this.exitTransition()
            else{
                this.$nextTick(()=>{
                    this.classes.forEach(c=>c.traversed = false)
                })
            }
        }
    },
    methods:{
        selectVote(vote){
            this.$store.commit(SELECT_VOTE, { vote })
            this.$emit('select-vote',vote)
        },
        filterClass(hero){
            if(!this.hasActiveFilter)
                return ''
            return this.passesFilter(hero) ? 'filtered-in': 'filtered-out'
        },
        passesFilter(hero){
            return this.filteredHeroes.find(d=>d.name == hero.name)
        },
        exitTransition(){
            let { width, height} = this.calcGridDimensions();

            let heroIndex = _.findIndex(this.heroes,hero=>this.selectedVote.name == hero.name)
            let heroCoords = this.getCoordsFromIndex(heroIndex, width)

            var grid = new PF.Grid(width, height); 
            let heroNode = grid.getNodeAt(heroCoords.x,heroCoords.y)

            let p = this.traverseAnimation(heroNode, grid)
                .then(()=>new Promise(resolve=>setTimeout(resolve, this.splashTransition.splashArtDuration)))
                .then(()=>{
                    this.$emit('transition-done')
                })
            
            //streamer can start new vote at any time, need to gracefully stop the animation
            let unwatch = this.$watch('hasSubmittedVote',()=>{
                p.cancel()
                unwatch();
            })

        },
        calcGridDimensions(){
            let $grid = this.$el
            let $cell = $grid.firstChild
            //cells have margins on all sides, add to width/height 
            let m = parseInt(window.getComputedStyle($cell).margin.replace('px'))

            let { clientWidth: gridWidth, clientHeight: gridHeight } = $grid
            let { offsetWidth: cellWidth, offsetHeight: cellHeight } = $cell;
            
            cellWidth += m*2;
            cellHeight += m*2;

            let width = Math.floor(gridWidth/cellWidth)
            let height = Math.floor(gridHeight/cellHeight)

            return { width, height }
        },
        //incrementally traverses grid in an expanding square, starting from selected vote        
        traverseAnimation(startNode, grid){
            let self = this;
            
            return new Promise((resolve,reject,onCancel)=>{

                var timeoutID;
                onCancel(()=>{
                    clearTimeout(timeoutID)
                })

                //handles the timing of the steps
                var duration = 1000,
                    startTime = new Date(),
                    elapsed,
                    maxInterval = 200,
                    minInterval = 50,
                    interpolator = interpolate(maxInterval,minInterval)

                //pathfinding
                var openList = [],
                    diagonalMovement = PF.DiagonalMovement.Always,
                    neighbors, neighbor, nodes, i, l,
                    gridSize = grid.width * grid.height

                openList.push(startNode);
                startNode.opened = true;
                
                //each step will process a square of neighbors
                function step(){
                    if(openList.length == 0){
                        resolve()
                        return;
                    }

                    nodes = openList.splice(0, openList.length);
                    nodes.forEach(node=>{
                        node.closed = true
                        let { x,y } = node
                        let index = self.getIndexFromCoords(x,y,grid.width)
                        if(index < self.classes.length)
                            self.classes[index].traversed = true;
                    })
                    
                    neighbors = _(nodes).map(node=>grid.getNeighbors(node, diagonalMovement)).flatMap().value();
                    
                    for (i = 0, l = neighbors.length; i < l; ++i) {
                        neighbor = neighbors[i];

                        if (neighbor.closed || neighbor.opened) {
                            continue;
                        }
                        
                        openList.push(neighbor);
                        neighbor.opened = true;
                    }

                    var elapsed = new Date() - startTime;
                    var normalizedTime = Math.min(elapsed,duration)/duration
                    var easedTime = easeCubicOut(normalizedTime);

                    timeoutID = setTimeout(step, interpolator(easedTime))
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
    }
}

</script>

<style lang="scss" scoped>

.image-grid{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    .image-wrapper{
        margin: 2px;
        position: relative;
        transition: .5s;
        img {
            display: block;
        }
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
</style>