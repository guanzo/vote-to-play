<template>
    <div class="submit-vote-footer flex-center">
        <div class="your-vote">
            <div v-if="!hasSelectedVote" class="default-vote">
                <div class="image-placeholder flex-center">
                    <i class="fa fa-question-circle" aria-hidden="true"></i>
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
                this.buttonText = 'Success'
            }, 750)
        },
    }
}

</script>


<style lang="scss" scoped>

.submit-vote-footer{
    margin-top: 20px;
    padding: 5px;
    
    .default-vote {
        display: flex;
        .image-placeholder{
            background: grey;
            width: 60px;
            height: 30px;
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