<template>
    <div class="submit-vote-footer flex-center">
        <div class="your-vote">
            <div v-if="!hasSelectedVote" class="default-vote flex-center">
                <div class="image-placeholder flex-center">
                    &#63;
                </div>
                &nbsp;
                Your Vote
            </div>
            <slot v-else></slot>
        </div>
        <button 
            @click="submitVote" 
            :disabled="!hasSelectedVote" 
            class="vote-button button"
            :class="{ 'is-loading': loading }"
        >
        {{ buttonText }}</button>
    </div>
</template>

<script>

import { VOTE } from '@/store/actions'

export default {
    name: 'submit-vote-footer',
    props:['hasSelectedVote','vote'],
    data(){
        return {
            buttonText: 'Vote',
            loading: false
        }
    },
    methods:{
        submitVote(){
            this.loading = true;
            setTimeout(()=>{
                this.$store.dispatch(VOTE, { vote: this.vote })
                this.loading = false
            }, 750)
        },
    }
}

</script>

<style lang="scss">

.dota .image-placeholder{
    width: 60px;
    height: 30px;
}


.overwatch .image-placeholder{
    width: 60px;
    height: 100px;
}

.league-of-legends .image-placeholder{
    width: 40px;
    height: 40px;
}
</style>

<style lang="scss" scoped>

.submit-vote-footer{
    margin-top: 20px;
    padding: 5px;
    
    .default-vote {
        .image-placeholder{
            background: grey;
        }
    }
    .your-vote {
        display: flex;
        margin-left: auto;
        font-size: 1.5em;
        color: white;
        text-shadow: #000 0px 0px 2px;
        span {
            margin-right: 10px;
        }
    }
    .vote-button {
        margin-left: auto;
    }
}
</style>