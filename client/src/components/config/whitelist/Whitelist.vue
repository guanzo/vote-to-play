<template>

<div class="whitelist">
    <h5>Whitelist <span class="icon-ok"></span></h5>
    <candidate-grid 
        :candidates="tempWhitelistedCandidates"
        :filteredCandidates="filterCandidates(tempWhitelistedCandidates)"
        :showName="showName"
        :noResults="noResults"
        @selectCandidate="c=>swap(c,tempBlacklistedCandidates,tempWhitelistedCandidates)"
        class="whitelist-grid dark"
    ></candidate-grid>

    <hr class="m-t-15 m-b-15">

    <h5>Blacklist <span class="icon-cancel"></span></h5>
    <candidate-grid 
        :candidates="tempBlacklistedCandidates"
        :filteredCandidates="filterCandidates(tempBlacklistedCandidates)"
        :showName="showName"
        @selectCandidate="c=>swap(c,tempWhitelistedCandidates,tempBlacklistedCandidates)"
        class="candidate-grid dark m-b-25"
    ></candidate-grid>
    <whitelist-controls 
        :voteCategory="voteCategory" 
        :names="tempWhitelistedNames" 
        :hasUnsavedChanges="hasUnsavedChanges"
        @cancel="removeUnsavedWhitelist"
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
    props:['voteCategory','candidates','filteredCandidates','whitelistedCandidates','showName'],
    data(){
        return {
            tempBlacklistedCandidates: [...this.candidates],
            tempWhitelistedCandidates:[],
            noResults: 'No whitelisted candidates'
        }
    },
    computed:{
        //unsaved changes on client
        tempWhitelistedNames(){
            return this.tempWhitelistedCandidates.map(d=>d.name)
        },
        //from server
        whitelistedNames(){
            return this.whitelistedCandidates.map(d=>d.name)
        },
        hasUnsavedChanges(){
            return this.whitelistedCandidates.length !== this.tempWhitelistedCandidates.length
        }
    },
    watch:{
        //set initial whitelist, && each time user saves whitelist
        whitelistedCandidates:{
            handler(whitelistedCandidates){
                this.tempWhitelistedCandidates = [...whitelistedCandidates]
            },
            immediate: true
        },
        voteCategory:{
            handler(){
                this.partitionCandidates();
            },
            immediate: true
        }
    },
    created(){
        window.addEventListener('beforeunload',this.warnUnsavedChanges.bind(this))
    },
    destroyed(){
        window.removeEventListener('beforeunload',this.warnUnsavedChanges.bind(this))
    },
    methods:{
        filterCandidates(candidates){
            return _.intersectionBy(candidates, this.filteredCandidates,'name')
        },
        partitionCandidates(){
            let partition = _.partition(this.candidates,
                            candidate=>{
                                return this.whitelistedNames.includes(candidate.name)
                            })
            this.tempWhitelistedCandidates = partition[0]
            this.tempBlacklistedCandidates = partition[1]
        },
        swap(candidate, toArray, fromArray){
            let index = _.findIndex(fromArray,d=>d.name == candidate.name)
            fromArray.splice(index,1)
            toArray.push(candidate)
            this.sortArrays(fromArray,toArray)
        },
        sortArrays(...arrays){
            arrays.forEach(arr=>arr.sort((a,b)=>a.name.localeCompare(b.name)))
        },
        //removes unsaved whitelisted candidates
        removeUnsavedWhitelist(){
            let removed = _.remove(this.tempWhitelistedCandidates,d=> !this.whitelistedNames.includes(d.name))
            this.tempBlacklistedCandidates.push(...removed)
            this.sortArrays(this.tempWhitelistedCandidates,this.tempBlacklistedCandidates)
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