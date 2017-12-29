<template>
    <div class="vote-controls field is-grouped is-grouped-multiline">
        <div v-if="isWhitelist" class="whitelist-tip help has-text-centered m-b-5">
            {{ channelName }} has limited the voting pool
        </div>
        <slot v-if="!hideControls">
            <div></div><!-- spacing helper -->
        </slot>
        <div v-if="!isAnonymousUser" class="control m-l-a">
            <button 
                @click="submitVote" 
                :disabled="!hasSelectedCandidate" 
                class="button"
                :class="{ 'is-loading': isLoading }"
            >
            Vote</button>
        </div>
        <div class="tag is-warning m-l-a" v-else>
            You must login to vote
        </div>
    </div>
</template>

<script>

import VoteSimulation from '@/components/page-viewer/testgui/VoteSimulation'
import { VOTE } from '@/store/actions'
import { NAMESPACE as ALL_GAMES }   from '@/store/modules/games/allGames'
const { VOTE_MODE_STREAMER } = require('@shared/constants')

export default {
    name: 'voter-controls',
    mixins:[VoteSimulation],
    props:['hasSelectedCandidate','hasSubmittedVote','vote'],
    data(){
        return {
            isLoading: false,
        }
    },
    computed:{
        ...Vuex.mapState(['userId','voteCategory','voteMode','channelName']),
        ...Vuex.mapGetters(['isAnonymousUser']),
        preventVote(){
            return this.hasSubmittedVote || this.isLoading
        },
        isWhitelist(){
            return this.voteMode === VOTE_MODE_STREAMER
		},//for all games whitelist, no point in allowing game searches.
		hideControls(){
			return this.isWhitelist && this.voteCategory === ALL_GAMES
		}
    },
    watch:{
        hasSubmittedVote(val){
            if(val)
                this.isLoading = false;
        }
    },
    methods:{
        submitVote(){
            if(this.preventVote)
                return;
                
            this.isLoading = true;
            this.$store.dispatch(VOTE, { vote: this.vote, userId: this.userId })
            this.$emit('submitVote')
        },
    }
}

</script>

<style lang="scss">

.vote-controls{
    grid-area: footer;
    position: relative;
    //display: flex;
    //justify-content: space-between;
    transition: .5s;
    select {
        width: 120px;
    }
	.whitelist-tip{
		width: 100%;
	}
}
</style>