<template>
    <div class="whitelist-controls field is-grouped is-grouped-multiline">
		<hearthstone-deck v-if="isHearthstone" />
        <slot />
        <div class="buttons control">
            <div class="help m-b-5">{{ validationMsg }}</div>
            <button @click="onCancel" class="button is-small is-danger is-outlined">Cancel</button>
            <button @click="onSaveGameWhitelist"
                :class="[validationColor, {'is-loading':isLoading}]"
                class="button is-small"
            >Save</button>
        </div>
    </div>
</template>

<script>

import voteApi from '@/api/vote-api'
import { NAMESPACE as HEARTHSTONE } from '@/store/modules/games/hearthstone'
import hearthstoneDeck from './HearthstoneDeck'

export default {
    name:'whitelist-controls',
    props:{
        tempWhitelist: Array,
        voteCategory: String,
        hasUnsavedChanges: Boolean
    },
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
        isHearthstone(){
            return this.voteCategory === HEARTHSTONE
        }
    },
    methods:{
        onCancel(){
            this.$emit('cancel')
        },
        async onSaveGameWhitelist(){
            this.isLoading = true

            const gameWhitelist = {
                voteCategory: this.voteCategory,
                names: this.tempWhitelist
            }
            try {
                await voteApi.saveGameWhitelist(gameWhitelist)
            } catch (e) {
                cl(e)
            } finally {
                this.isLoading = false
            }
        }
    },
    components:{
        hearthstoneDeck
    }
}

</script>

<style lang="scss" scoped>

.whitelist-controls{
	//hearthstone has a label that interferes with vertical alignment
    align-items: flex-end;
    .buttons{
        margin-left: auto;
        position: relative;
		.button{
			transition: 0.15s;
		}
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
