<template>
    <div class="vote-controls field is-grouped">
        <slot>
            <div></div><!-- spacing helper -->
        </slot>
        <div class="control vote-button-wrapper">
            <button 
                @click="submitVote" 
                :disabled="!hasSelectedCandidate" 
                class="button is-small"
                :class="{ 'is-loading': isLoading }"
            >
            Vote</button>
        </div>
    </div>
</template>

<script>

import VoteSimulation from '@/components/viewer/testgui/VoteSimulation'
import { VOTE } from '@/store/actions'

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
        ...Vuex.mapState(['userId']),
        allowedToVote(){
            return !this.hasSubmittedVote && !this.isLoading
        },
    },
    watch:{
        hasSubmittedVote(val){
            if(val)
                this.isLoading = false;
        }
    },
    methods:{
        submitVote(){
            if(!this.allowedToVote)
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
    .vote-button-wrapper{
        margin-left: auto;
    }
    select {
        width: 120px;
    }
}
</style>