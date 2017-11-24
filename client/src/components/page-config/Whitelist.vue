<template>

<div class="whitelist">
    <h5 class="subtitle">Whitelist <span class="icon-ok has-text-success"></span></h5>
    <candidate-grid 
        :candidates="tempWhitelist"
        :filteredCandidates="tempWhitelist"
        :showName="showName"
        :noResults="noResults"
        @selectCandidate="c=>swap(c,tempBlacklist,tempWhitelist)"
        class="whitelist-grid dark"
    ></candidate-grid>

    <div class="whitelist-tools has-text-centered m-t-15 m-b-15">
        <hr>
        <div><div>UP</div><div>DOWN</div></div>
        <hr>
    </div>

    <h5 class="subtitle">Blacklist <span class="icon-cancel has-text-danger"></span></h5>
    <candidate-grid 
        :candidates="tempBlacklist"
        :filteredCandidates="filteredBlacklist"
        :showName="showName"
        @selectCandidate="c=>swap(c,tempWhitelist,tempBlacklist)"
        class="candidate-grid dark m-b-25"
    ></candidate-grid>
    <whitelist-controls 
        :voteCategory="voteCategory" 
        :tempWhitelist="tempWhitelist" 
        :hasUnsavedChanges="hasUnsavedChanges"
        @cancel="commit('removeUnsavedWhitelist')"
    >
        <slot name="filters"></slot>
    </whitelist-controls>
</div>

</template>

<script>
import candidateGrid from '@/components/grid/CandidateGrid'
import whitelistControls from './WhitelistControls'
import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'

export default {
    name:'whitelist',
    inheritAttrs: false,
    props:['voteCategory'],
    data(){
        return {
            noResults: "You haven't whitelisted any candidates. Click on the candidates to whitelist them."
        }
    },
    computed:{
        game(){
            return this.$store.getters.gameModuleByName(this.voteCategory)
        },
        namespace(){     return this.game.gameName },
        showName(){      return this.game.showNameInGrid },
        tempWhitelist(){ return this.game.tempWhitelist },
        tempBlacklist(){ return this.game.tempBlacklist },
        whitelistedCandidates(){
            return this.$store.getters[this.namespace+'/whitelistedCandidates']
        },
        filteredCandidates(){
            return this.$store.getters[this.namespace+'/filteredCandidates']
        },
        filteredBlacklist(){
            return this.$store.getters[this.namespace+'/filteredBlacklist']
        },
        hasUnsavedChanges(){
            return this.whitelistedCandidates.length !== this.tempWhitelist.length
        }
    },
    watch:{
        //set initial whitelist, && each time user saves whitelist
        whitelistedCandidates:{
            handler(whitelistedCandidates){
                this.commit('updateTempWhitelist',whitelistedCandidates)
            },
            immediate: true
        },
        voteCategory:{
            handler(){
                this.commit('partition');
            },
            immediate: true
        },
        //all games compatibility
        'game.searchedGames'(){
            let candidates = this.$store.getters[this.namespace+'/candidates']
            this.commit('updateTempBlacklist',candidates)
        }
    },
    created(){
        window.addEventListener('beforeunload',this.warnUnsavedChanges.bind(this))
    },
    destroyed(){
        window.removeEventListener('beforeunload',this.warnUnsavedChanges.bind(this))
    },
    methods:{
        commit(mutation, payload){
            this.$store.commit(this.namespace+'/'+mutation, payload)
        },
        swap(candidate,toArray,fromArray){
            this.commit('swap',{ candidate, toArray, fromArray })
        },
        swapAll(toArray, fromArray){
            this.commit('swapAll',{ toArray, fromArray })
        },
        warnUnsavedChanges(e){
            if(!this.hasUnsavedChanges)
                return;
            let msg = 'You have unsaved changes'
            e.returnValue = msg
            return msg
        }
    },
    components:{
        candidateGrid,
        whitelistControls
    }
}

</script>

<style lang="scss" scoped>

.whitelist{
    padding: 15px;
    .whitelist-grid{
        min-height: 100px !important;
    }
    .candidate-grid{
        min-height: 300px;
        align-items: flex-start;
        align-content: flex-start;
    }
    .whitelist-tools{
        display: flex;
        > * {
            flex: 1 1 30%;
        }
        hr {
            margin: 1rem 0;
        }
        div {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }
}

</style>