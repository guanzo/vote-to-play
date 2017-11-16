<template>
    <div class="vote-controls pure-form">
        <slot>
            <div></div><!-- spacing helper -->
        </slot>
        <div>
            <button 
                @click="submitVote" 
                :disabled="!hasSelectedCandidate" 
                class="pure-button button-small"
                :class="{ 'is-loading': loading }"
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
            loading: false,
        }
    },
    computed:{
        ...Vuex.mapState(['userId']),
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
            this.$emit('submitVote')
        },
    }
}

</script>

<style lang="scss">

.vote-controls{
    grid-area: footer;
    position: relative;
    display: flex;
    justify-content: space-between;
    transition: .5s;
    select {
        width: 120px;
    }
    .button-small {
        font-size: 85%;
    }
}
</style>