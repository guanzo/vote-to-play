
export const state = {
    whitelistedNames:[],
    tempWhitelist:[],
    tempBlacklist:[],
}

export const mutations = {
    partition(state,{ tempWhitelist, tempBlacklist }){
        state.tempWhitelist = [...tempWhitelist]
        state.tempBlacklist = [...tempBlacklist]
    },
    updateTempWhitelist(state,candidates){
        state.tempWhitelist = [...candidates]
    },
    swap(state,{ candidate, toArray, fromArray }){
		let index = _.findIndex(fromArray,d=>d.name == candidate.name)
        fromArray.splice(index,1)
        toArray.push(candidate)
        processArrays(fromArray,toArray, state.gameOptions)
    },
    swapAll(state,{ toArray, fromArray }){
        let candidates = fromArray.splice(0);
        toArray.push(...candidates)
        processArrays(fromArray,toArray, state.gameOptions)
    },
    removeUnsavedChanges(state){
        let removed = _.remove(state.tempWhitelist,d=> {
            return !state.whitelistedNames.includes(d.name)
        })
        state.tempBlacklist.push(...removed)

        removed = _.remove(state.tempBlacklist,d=> {
            return state.whitelistedNames.includes(d.name)
        })
        state.tempWhitelist.push(...removed)
        processArrays(state.tempWhitelist,state.tempBlacklist, state.gameOptions)
    }
}

export const actions = {
    partition({commit,state,getters}){
        let partition = _.partition(getters.candidates,
            candidate=>{
                return state.whitelistedNames.includes(candidate.name)
			})
        commit('partition',{
            tempWhitelist: partition[0],
            tempBlacklist: partition[1]
        }) 
    },
}

export const getters = {
    whitelistedCandidates({whitelistedNames},{candidates}){
        return candidates.filter(candidate=>whitelistedNames.includes(candidate.name))
    },
    filteredBlacklist(state,{candidates,filteredCandidates}){
        return _.intersectionBy(candidates, filteredCandidates,'name')
    },
    hasUnsavedChanges(state, getters){
        return !_.isEmpty(_.xorBy(getters.whitelistedCandidates, state.tempWhitelist,'name'))
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}

export function processArrays(fromArray, toArray, {sortBy = 'name', sortOrder = 'asc'} = {}){
    [fromArray, toArray].forEach((arr,i)=>{
        let processedArr = _(arr).uniqBy('name').orderBy([sortBy],[sortOrder]).value()
        arr.length = 0
        arr.push( ...processedArr )
    })
    
}