<template>
    <form @submit.prevent="onAddDeck" class="customize-hearthstone control">
        <div class="field-labels">
            <label class="label">Customize Decks</label>
            <div v-show="isDuplicate" class="help is-danger">Duplicate deck</div>
        </div>
        <div class="field has-addons has-addons-centered">
            <div class="control">
                <span class="select">
                    <select v-model="selectedDeckName" required>
                        <option v-for="option in deckOptions"
                            :value="option"
                            :key="option"
                        >{{ option }}</option>
                    </select>
                </span>
            </div>
            <template v-if="!isExistingDeckName">
                <div class="control">
                    <span class="select">
                        <select v-model="selectedClass" required>
                            <option v-for="option in originalClasses"
                                :value="option"
                                :key="option"
                            >{{ option }}</option>
                        </select>
                    </span>
                </div>
                <div class="control">
                    <input class="input"
                        required
                        v-model.trim="deckName"
                        placeholder="Deck name"
                        maxlength="50"
                    >
                </div>
                <div class="control">
                    <button class="button is-success"
                        type="submit"
                        :class="{'is-warning': isDuplicate,'is-loading': isLoading}"
                        :disabled="isDuplicate">
                        Add
                    </button>
                </div>
            </template>
            <div v-else class="control">
                <button class="button is-danger"
                    @click="onDeleteDeck"
                    type="button"
                    :class="{'is-loading':isLoading}"
                    >
                    Delete
                </button>
            </div>
        </div>
    </form>
</template>

<script>
import { mapState } from 'vuex'

import gameApi from '@/api/game-api'
import { NAMESPACE as NS_HS } from '@/store/modules/games/hearthstone'

const ADD_NEW_DECK = 'New Deck'

export default {
    name:'add-hearthstone-deck',
    data(){
        return {
            selectedDeckName: ADD_NEW_DECK,
            selectedClass: '',
            deckName: '',
            isLoading: false
        }
    },
    computed:{
        ...mapState(NS_HS,{
            decks:          s=>s.decks,
            candidates:     s=>s.candidates,
            originalClasses:s=>s.candidates.map(d=>d.name),
            deckClasses:    s=>s.decks.map(d=>d.name),
        }),
        allClasses(){
            return this.$store.getters[NS_HS+'/candidates'].map(d=>d.name)
        },
        deckOptions(){
            return [ADD_NEW_DECK, ...this.deckClasses]
        },
        isExistingDeckName(){
            return this.deckClasses.includes(this.selectedDeckName)
        },//cannot create a duplicate deck, or have a deck with same class && name as an original class
        isDuplicate(){
            const existingClasses = [...this.originalClasses, ...this.deckClasses]

            const isExistingClass = existingClasses.find(className=>{
                return stringsAllEqual(className, this.newDeck.name)
            }) !== undefined

            return this.selectedDeckName === ADD_NEW_DECK && isExistingClass
        },
        newDeck(){
            return {
                class: this.selectedClass,
                name: this.deckName,
				id: this.deckName
            }
        }
    },
    created(){
        this.selectedClass = this.originalClasses[0]
    },
    methods:{
        onAddDeck(){
            const decks = this.decks.slice();
            decks.push(this.newDeck)
            this.setDecks(decks)
        },
        onDeleteDeck(){
            const decks = this.decks.slice();
            const index = decks.findIndex(d=>d.name === this.selectedDeckName)
            decks.splice(index,1)
            this.setDecks(decks)
        },
        async setDecks(decks){
            this.isLoading = true
            decks = decks.map(d => _.pick(d,'id','class','name'))

            try {
                await gameApi.setHearthstoneDecks(decks)
            } catch (e) {
                cl(e)
                return
            } finally {
                this.isLoading = false
                this.resetSelectedDeck()
            }
            this.$store.dispatch(`${NS_HS}/ensureWhitelistInSync`, decks )
        },
        resetSelectedDeck(){
            this.selectedDeckName = ADD_NEW_DECK
            this.deckName = ''
            this.selectedClass = this.originalClasses[0]
        },
    }
}
//ignore case
function stringsAllEqual(...strings){
    return _(strings).map(s=>s.toLowerCase()).uniq().value().length <= 1;
}

</script>

<style lang="scss" scoped>

.customize-hearthstone{
    .field-labels{
        display: flex;
        justify-content: space-between;
    }
    .button{
        transition: .35s;
    }
}


</style>
