<template>
    
    <div class="whitelist-controls field is-grouped is-grouped-multiline">
        <slot>
            <div></div><!-- spacing helper -->
        </slot>
        <div class="buttons">
            <div class="help">{{ validationMsg }}</div>
            <button @click="onCancel" class="button is-danger is-outlined">Cancel</button>
            <button @click="onSaveGameWhitelist" 
                :class="[validationColor, isLoading ? 'is-loading':'']" 
                class="button"
            >Save</button>

        </div>
    </div>

</template>

<script>

import { SAVE_GAME_WHITELIST } from '@/store/actions'
import { delayPromise } from '@/util'
import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'

export default {
    name:'whitelist-controls',
    props:['tempWhitelist','voteCategory','hasUnsavedChanges'],
    data(){
        return {
            isLoading: false
        }
    },
    computed:{
        validationColor(){
            return this.hasUnsavedChanges ? 'is-warning' : 'is-success'
        },
        validationMsg(){
            return this.hasUnsavedChanges ? 'You have unsaved changes' : ''
        },
        tempWhitelistedNames(){
            return this.tempWhitelist.map(d=>d.name)
        }
    },
    methods:{
        onCancel(){
            this.$emit('cancel')
        },
        async onSaveGameWhitelist(){

            let gameWhitelist = {
                voteCategory: this.voteCategory,
                names: this.tempWhitelist
            }
            this.$store.dispatch(SAVE_GAME_WHITELIST, gameWhitelist )
            this.isLoading = true
            await delayPromise(750)
            this.isLoading = false
        }
    }
}

</script>

<style lang="scss" scoped>

.whitelist-controls{
    .buttons{
        transition: 0.15s;
        margin-left: auto;
        position: relative;
        .help{
            position: absolute;
            right: 0;
            bottom: 100%;
            text-align: right;
            white-space: nowrap;
        }
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