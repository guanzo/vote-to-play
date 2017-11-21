<template>
    
    <div class="whitelist-controls pure-form">
        <slot>
            <div></div><!-- spacing helper -->
        </slot>
        <div class="buttons is-centered">
            <a @click="onCancel" class="button is-danger is-outlined">Cancel</a>
            <a @click="onSaveGameWhitelist" 
            :class="[buttonColor, isLoading ? 'is-loading':'']" 
            class="button"
            >Save</a>
        </div>
    </div>

</template>

<script>

import { SAVE_GAME_WHITELIST } from '@/store/actions'
import { delayPromise } from '@/util'
export default {
    name:'whitelist-controls',
    props:['names','voteCategory','hasUnsavedChanges'],
    data(){
        return {
            isLoading: false
        }
    },
    computed:{
        buttonColor(){
            return this.hasUnsavedChanges ? 'is-warning' : 'is-success'
        }
    },
    methods:{
        onCancel(){
            this.$emit('cancel')
        },
        async onSaveGameWhitelist(){
            let gameWhitelist = {
                voteCategory: this.voteCategory,
                names: this.names
            }
            this.$store.dispatch(SAVE_GAME_WHITELIST, gameWhitelist )
            this.isLoading = true
            await delayPromise(1000)
            this.isLoading = false
        }
    }
}

</script>

<style lang="scss" scoped>

.whitelist-controls{
    display: flex;
    justify-content: space-between;
    .buttons{
        transition: 0.15s;
    }
    $save-color:  #43A047;
    .save{
        color: #eee;
        background: #43A047;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    }
    $cancel-color: #D50000;
    .cancel{
        color: $cancel-color;
        border: 2px solid $cancel-color;
        &:hover{
            background: $cancel-color;
            color: #eee;
        }
    }
}

</style>