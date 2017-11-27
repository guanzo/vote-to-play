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
            toArray.push(candidate)
            processArrays(fromArray,toArray)
        },
        swapAll(state,{ toArray, fromArray }){
            let candidates = fromArray.splice(0);
            toArray.push(...candidates)
            processArrays(fromArray,toArray)
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
            processArrays(state.tempWhitelist,state.tempBlacklist)
        }
    },
    getters:{
        whitelistedCandidates({candidates,whitelistedNames}){
            return candidates.filter(candidate=>whitelistedNames.includes(candidate.name))
        },
        filteredBlacklist({candidates},getters){
            return _.intersectionBy(candidates, getters.filteredCandidates,'name')
        },
        hasUnsavedChanges(state, getters){
            return !_.isEmpty(_.xorBy(getters.whitelistedCandidates, state.tempWhitelist,'name'))
        }
    }
}

export function processArrays(...arrays){
    arrays.forEach((arr,i)=>{
        let processedArr = _(arr).uniqBy('name').sortBy('name').value()
        arr.length = 0
        arr.push( ...processedArr )
    })
    
}