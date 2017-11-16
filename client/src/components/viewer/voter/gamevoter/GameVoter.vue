<template>
    <transition name="fade-vertical" @after-leave="afterUiLeave">
        <div v-show="showUI" class="voter overlay-background">
            <voter-header
                :hasSelectedCandidate="hasSelectedCandidate" 
                :selectedCandidate="selectedCandidate"
                 :class="invisible"
            ></voter-header>
            <image-grid 
                :candidates="candidates"
                :filteredCandidates="candidates"
                 :class="invisible"
            >
                <div class="game" slot-scope="{ candidate }" slot="candidate">
                    <div class="image-wrapper candidate">
                        <img :src="candidate.img">
                    </div>
                    <div class="game-name">
                        <div>{{ candidate.name }}</div>
                    </div>
                </div>
            </image-grid>
            <voter-controls
                :hasSelectedCandidate="hasSelectedCandidate" 
                :hasSubmittedVote="hasSubmittedVote"
                :vote="selectedCandidate.name"
                @submit-vote="startSplashTransition"
                 :class="invisible"
            >
                <slot name="filters"></slot>
            </voter-controls> 
        </div>
    </transition>
</template>

<script>

import voterHeader from '../VoterHeader'
import voterControls from '../VoterControls'
import imageGrid from '../ImageGrid'

export default {
    name: 'game-voter',
    props:['topGames','searchedGames'],
    computed:{
        ...Vuex.mapState(['selectedCandidate']),
        ...Vuex.mapGetters(['hasSelectedCandidate','hasSubmittedVote']),
        showUI(){
            return !this.hasSubmittedVote
        },
        candidates(){
            return this.searchedGames.length ? this.searchedGames : this.topGames
        }
    },
    watch:{
        hasSubmittedVote(val){
            if(!val)
                this.splashTransition = splashTransitionDefaults()
        },
    },
    components:{
        imageGrid,
        voterHeader,
        voterControls,
    }
}

</script>

<style lang="scss" scoped>


.voter{
    position: relative;
    padding: 15px;
    max-height: 100%;
    min-height: 300px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    .game{
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 72px;
        font-size: 12px;
        margin: 3px;
        .game-name {
            max-width: 100%;
            > div {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
    }
}

</style>