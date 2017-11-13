<template>
    <div class="vote-controls pure-form" :class="{ 'invisible': splashTransition.hideVoteUI }">
        <slot>
            <div></div><!-- spacing helper -->
        </slot>
        <div>
            <button 
                @click="submitVote" 
                :disabled="!hasSelectedVote" 
                class="pure-button button-small"
                :class="{ 'is-loading': loading }"
            >
            Vote</button>
        </div>
    </div>
</template>

<script>

import VoteSimulation from '@/components/viewer/test/VoteSimulation'
import { VOTE } from '@/store/actions'

export default {
    name: 'voter-controls',
    mixins:[VoteSimulation],
    props:['hasSelectedVote','vote','splashTransition'],
    data(){
        return {
            loading: false,
        }
    },
    computed:{
        ...Vuex.mapState(['userId']),
        ...Vuex.mapGetters(['hasSubmittedVote']),
        allowedToVote(){
            return !this.hasSubmittedVote && !this.loading
        },
    },
    watch:{
        hasSubmittedVote(val){
            if(val)
                this.loading = false;
        }
    },
    methods:{
        submitVote(){
            if(!this.allowedToVote)
                return;
                
            this.loading = true;
            this.$store.dispatch(VOTE, { vote: this.vote, userId: this.userId })
            this.$emit('submit-vote')
        },
    }
}

</script>

<style lang="scss">

.vote-controls{
    min-height: 40px;
    padding-top: 10px;
    position: relative;
    display: flex;
    justify-content: space-between;
    transition: .3s;
    &.invisible{
        opacity: 0;
        pointer-events: none;
    }
    select {
        width: 120px;
    }
    .button-small {
        font-size: 85%;
    }
}
</style>