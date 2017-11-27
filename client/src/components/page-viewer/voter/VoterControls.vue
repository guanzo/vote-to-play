<template>
    <div class="vote-controls field is-grouped">
        <slot v-if="!isWhitelist">
            <div></div><!-- spacing helper -->
        </slot>
        <div class="help" v-else>
            {{ channelName }} has limited the voting pool
        </div>

        <div v-if="!isAnonymousUser"
        class="control m-l-a">
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
var { VOTE_MODE_STREAMER } = require('@shared/constants')

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
        ...Vuex.mapState(['userId','voteMode','channelName']),
        ...Vuex.mapGetters(['isAnonymousUser']),
        preventVote(){
            return this.hasSubmittedVote || this.isLoading
        },
        isWhitelist(){
            return this.voteMode == VOTE_MODE_STREAMER
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
}
</style>