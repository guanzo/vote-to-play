export default {
    state:{
        whitelistedNames:[],
        tempWhitelistedCandidates:[],
        tempBlacklistedCandidates:[],
    },
    mutations:{
        partition(state){
            let partition = _.partition(state.candidates,
                candidate=>{
                    return state.whitelistedNames.includes(candidate.name)
                })
            state.tempWhitelistedCandidates = partition[0]
            state.tempBlacklistedCandidates = partition[1]
        },
        updateTempWhitelist(state,candidates){
            state.tempWhitelistedCandidates = [...candidates]
        },
        swap(state,{ candidate, toArray, fromArray }){
            let index = _.findIndex(fromArray,d=>d.name == candidate.name)
            fromArray.splice(index,1)
            toArray.push(candidate)
            sortArrays(fromArray,toArray)
        },
        removeUnsavedWhitelist(state){
            let removed = _.remove(state.tempWhitelistedCandidates,d=> !state.whitelistedNames.includes(d.name))
            state.tempBlacklistedCandidates.push(...removed)
            sortArrays(state.tempWhitelistedCandidates,state.tempBlacklistedCandidates)
        }
    },
    getters:{
        whitelistedCandidates({candidates,whitelistedNames}){
            return candidates.filter(candidate=>whitelistedNames.includes(candidate.name))
        },
        filteredBlacklist({candidates},getters){
            return _.intersectionBy(candidates, getters.filteredCandidates,'name')
        }
    }
}

function sortArrays(...arrays){
    arrays.forEach(arr=>arr.sort((a,b)=>a.name.localeCompare(b.name)))
}