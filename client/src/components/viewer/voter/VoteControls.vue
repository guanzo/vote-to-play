<template>
    <div class="vote-controls">
        <slot></slot><!-- spacing helper -->
        <button 
            @click="submitVote" 
            :disabled="!hasSelectedVote" 
            class="vote-button button"
            :class="{ 'is-loading': loading }"
        >
        Vote</button>
    </div>
</template>

<script>


import VoteSimulation from '@/components/viewer/test/VoteSimulation'

import { VOTE } from '@/store/actions'

export default {
    name: 'vote-controls',
    mixins:[VoteSimulation],
    props:['hasSelectedVote','vote'],
    data(){
        return {
            loading: false,
        }
    },
    computed:{
        ...Vuex.mapState(['userId']),
        ...Vuex.mapGetters(['hasSubmittedVote']),
    },
    watch:{
        hasSubmittedVote(val){
            if(val)
                this.loading = false;
        }
    },
    methods:{
        submitVote(){
            this.loading = true;
            this.$store.dispatch(VOTE, { vote: this.vote, userId: this.userId })
            setTimeout(()=>this.$emit('submit-vote'),250)    
        },
    }
}

</script>

<style lang="scss" scoped>

.vote-controls{
    min-height: 40px;
    margin-top: 20px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>