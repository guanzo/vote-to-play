export default {
    state:{
        whitelistedNames:[],
        tempWhitelist:[],
        tempBlacklist:[],
    },
    mutations:{
        partition(state){
            let partition = _.partition(state.candidates,
                candidate=>{
                    return state.whitelistedNames.includes(candidate.name)
                })
            state.tempWhitelist = partition[0]
            state.tempBlacklist = partition[1]
        },
        updateTempWhitelist(state,candidates){
            state.tempWhitelist = [...candidates]
        },
        swap(state,{ candidate, toArray, fromArray }){
            let index = _.findIndex(fromArray,d=>d.name == candidate.name)
            fromArray.splice(index,1)
            
            index = _.findIndex(toArray,d=>d.name == candidate.name)
            if(index == -1)
                toArray.push(candidate)
            sortArrays(fromArray,toArray)
        },
        removeUnsavedWhitelist(state){
            let removed = _.remove(state.tempWhitelist,d=> !state.whitelistedNames.includes(d.name))
            state.tempBlacklist.push(...removed)
            sortArrays(state.tempWhitelist,state.tempBlacklist)
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