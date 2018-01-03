/**
 * EARLIER DESIGN IS BITING ME IN THE ASS
 * Originally, i saved game whitelist as array of strings
 * Now, b/c of allGames and world of tanks, i'm going to start
 * saving whitelists as array of objects, with id && name properties.
 * I'll need to check if elements in whitelistedNames are strings or objects
 * and code accordingly
 * The database will eventually fix itself, as users update their whitelist
 * 
 */

 //returns a iteratee depending on whether whitelistedNames
 //is an array of strings or objects
function getWhitelistContainsCandidateIteratee(whitelistedNames){
	return isArrayOfStrings(whitelistedNames)
			? d => whitelistedNames.includes(d.name)
			: d => whitelistedNames.some(b=>b.name == d.name)
	
}

function isArrayOfStrings(whitelistedNames){
	return _.isString(whitelistedNames[0])
}

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
		let { whitelistedNames } = state
		let iteratee = getWhitelistContainsCandidateIteratee(whitelistedNames)

        let removed = _.remove(state.tempWhitelist,d=>!iteratee(d))
        state.tempBlacklist.push(...removed)

        removed = _.remove(state.tempBlacklist,iteratee)
        state.tempWhitelist.push(...removed)
        processArrays(state.tempWhitelist,state.tempBlacklist, state.gameOptions)
    }
}

export const actions = {
    partition({commit,state,getters}){
		let { whitelistedNames } = state
		let iteratee = getWhitelistContainsCandidateIteratee(whitelistedNames)

		let partition = _.partition(getters.candidates,iteratee)
        commit('partition',{
            tempWhitelist: partition[0],
            tempBlacklist: partition[1]
        })
        commit('partition',{
            tempWhitelist: partition[0],
            tempBlacklist: partition[1]
        }) 
    },
}

export const getters = {
    whitelistedCandidates({whitelistedNames},{candidates}, rootState){
		let iteratee = getWhitelistContainsCandidateIteratee(whitelistedNames)
		return candidates.filter(iteratee)
	},
    filteredBlacklist(state,{candidates,filteredCandidates}){
        return _.intersectionBy(candidates, filteredCandidates,'id')
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
        let processedArr = _(arr).uniqBy(c=>c.id || c.name).orderBy([sortBy],[sortOrder]).value()
        arr.length = 0
        arr.push( ...processedArr )
    })
    
}