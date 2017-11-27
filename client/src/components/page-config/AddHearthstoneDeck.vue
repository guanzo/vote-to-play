<template>
    <div>
        <label class="label">Add Hearthstone Deck</label>
        <div class="field has-addons has-addons-centered">
            <div class="control">
                <span class="select">
                    <select v-model="selectedClass" required>
                        <option v-for="(option,i) in options" 
                            :disabled="i==0"
                            :value="option"
                            :key="option"
                        >{{ option }}</option>
                    </select>
                </span>
            </div>
            <div class="control">
                <input class="input" v-model="deckName" placeholder="Deck name">
            </div>
            <div class="control">
                <a class="button is-success" 
                    @click="onAddDeck" 
                    :class="{'is-loading':isLoading}" 
                    :disabled="isDisabled">
                    Add
                </a>
            </div>
        </div>
    </div>
</template>

<script>

import { NAMESPACE as HEARTHSTONE } from '@/store/modules/games/hearthstone'
import { ADD_HEARTHSTONE_DECK } from '@/store/actions'
import { delayPromise } from '@/util'
const SELECT_CLASS = 'Select Class';

export default {
    name:'add-hearthstone-deck',
    data(){
        return {
            decks:[],
            selectedClass: SELECT_CLASS,
            deckName: '',
            isLoading: false
        }
    },
    computed:{
        hearthstone(){
            return this.$store.state.games[HEARTHSTONE]
        },
        classes(){
            return this.hearthstone.candidates.map(d=>d.name)
        },
        options(){
            return [SELECT_CLASS, ...this.classes]
        },
        isDisabled(){
            return this.selectedClass == SELECT_CLASS
        }
    },
    methods:{
        async onAddDeck(){
            let deck = {
                class: this.selectedClass,
                name: this.deckName
            }
            this.$store.dispatch(HEARTHSTONE+'/'+ADD_HEARTHSTONE_DECK, deck )
            this.isLoading = true
            await delayPromise(750)
            this.isLoading = false
        }
    }
}


</script>

<style lang="scss" scoped>

select:required:invalid {
  color: gray;
}
option[value="Select Class"][disabled] {
  display: none;
}

</style>