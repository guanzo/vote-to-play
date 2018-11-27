<template>

<div class="whitelist">
    <h5 class="subtitle">Whitelist <span class="icon-ok has-text-success" /></h5>
    <candidate-grid
		v-bind="$attrs"
        :candidates="tempWhitelist"
        :filteredCandidates="tempWhitelist"
        :noResults="noResults"
        :beforeLeave="beforeLeave"
        @selectCandidate="c=>swap(c,tempBlacklist,tempWhitelist)"
        class="dark"
     />

    <div class="whitelist-tools flex-center m-t-10 m-b-10">
        <hr>
        <div>
            <div @click="swapAll(tempWhitelist,tempBlacklist)" class="icon-angle-double-up is-size-1" />
            <div @click="swapAll(tempBlacklist,tempWhitelist)" class="icon-angle-double-down is-size-1" />
        </div>
        <hr>
    </div>

    <h5 class="subtitle">Blacklist <span class="icon-cancel has-text-danger" /></h5>
    <candidate-grid
		v-bind="$attrs"
        :candidates="tempBlacklist"
        :filteredCandidates="filteredBlacklist"
        :beforeLeave="beforeLeave"
        @selectCandidate="c=>swap(c,tempWhitelist,tempBlacklist)"
        class="dark m-b-25"
     />
    <whitelist-controls
        :voteCategory="voteCategory"
        :tempWhitelist="tempWhitelist"
        :hasUnsavedChanges="hasUnsavedChanges"
        @cancel="commit('removeUnsavedChanges')"
    >
        <slot name="controls" />
    </whitelist-controls>
</div>

</template>

<script>
import candidateGrid from '@/components/grid/CandidateGrid'
import whitelistControls from './WhitelistControls'

export default {
    name:'whitelist',
    inheritAttrs: false,
    props:{
        voteCategory: String
    },
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
        tempWhitelist(){ return this.game.tempWhitelist },
        tempBlacklist(){ return this.game.tempBlacklist },
        candidates(){
            return this.$store.getters[this.namespace+'/candidates']
        },
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
            return this.$store.getters[this.namespace+'/hasUnsavedChanges']
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
                this.$store.dispatch(this.namespace+'/partition');
            },
            immediate: true
        },
		//allGames && hearthstone compatibility
		//these games can change their candidates dynamically
        candidates(){
            this.$store.dispatch(this.namespace+'/partition');
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
        swapAll(toArray, fromArray){
            this.commit('swapAll',{ toArray, fromArray })
        },
        warnUnsavedChanges(e){
            if(!this.hasUnsavedChanges)
                return;
            const msg = 'You have unsaved changes'
            e.returnValue = msg
            return msg
        },//fade out element in place when swapping between white/black lists
        beforeLeave(el){
            //getComputedStyle has low performance, just hardcode margin
			const marginTop = 2;
			const top = (el.offsetTop - marginTop)+'px';
			const left = el.offsetLeft+'px'
			//assign all at once to prevent unnecessary reflows
			Object.assign(el.style, { left, top })
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
	.candidate-grid{
		max-height: 400px;
	}
    .whitelist-tools{
        > * {
            flex: 1 1 30%;
        }
        hr {
            margin: 0;
        }
        div {
            display: flex;
            justify-content: space-around;
            align-items: center;
            [class^="icon"]{
                cursor: pointer;
                position: relative;
                transition: 0.3s;
                &.icon-angle-double-up:hover{
                    color: $success;
                }
                &.icon-angle-double-down:hover{
                    color: $danger;
                }
            }
        }
    }
}

</style>
