<template>

<div class="whitelist">
    <h5>Whitelist <span class="icon-ok"></span></h5>
    <candidate-grid 
        :candidates="tempWhitelist"
        :filteredCandidates="tempWhitelist"
        :showName="showName"
        :noResults="noResults"
        @selectCandidate="c=>swap(c,tempBlacklist,tempWhitelist)"
        class="whitelist-grid dark"
    ></candidate-grid>

    <hr class="m-t-15 m-b-15">

    <h5>Blacklist <span class="icon-cancel"></span></h5>
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
//'candidates','filteredCandidates','whitelist','showName'
import candidateGrid from '@/components/grid/CandidateGrid'
import whitelistControls from './WhitelistControls'
export default {
    name:'whitelist',
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
        'game.filters.0.vmodel'(){
            let candidates = this.$store.getters[this.namespace+'/candidates']
            this.commit('updateTempBlacklist',candidates)
        },
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
        min-height: 400px;
        align-items: flex-start;
        align-content: flex-start;
    }
    .icon-ok{
        color: $green;
    }
    .icon-cancel{
        color: $red;
    }
}

</style>