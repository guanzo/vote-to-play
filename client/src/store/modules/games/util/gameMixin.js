/**
 * Defines base functionality for all games.
 */

import { TOGGLE_SHOW_NAME_IN_GRID } from '@/store/actions'

//3 filtering modes
//default, leaves non-matched candidates in place, but darkens them
export const FILTER_MODE_HIGHLIGHT = 'HIGHLIGHT'
//removes non-matched candidates: world of tanks
export const FILTER_MODE_REMOVE = 'REMOVE'
//candidates are not filterable: all-games, hearthstone
export const FILTER_MODE_NONE = 'NONE'

/**
 * These options control various aspects of the UI.
 * Moba games such as dota, lol, hots, battlerite will use the default options.
 * Other games have custom options.
 */
export function gameOptions(customOptions){
	return {
		maxVoteResults: 5,//how many candidates to show in vote results
		showNameInGrid: false,//display candidate name in grid
		filterMode: FILTER_MODE_HIGHLIGHT,
		hasPaginatedGrid: false,//can only be true if filterMode is remove
		sortBy: 'name', //how candidates are sorted by default
		sortOrder: 'asc',//asc or desc. used by _.orderBy
		...customOptions
	}
}

export const gameMixin = {
	mutations:{
		[TOGGLE_SHOW_NAME_IN_GRID](state,value){
			state.gameOptions.showNameInGrid = value;
		}
	},
	getters:{
		activeFilters(state){
			return state.filters.filter(isFilterActive)
		}
	}
}

const isFilterActive = ({type,vmodel,options})=>{
	if(type === 'text')
		return vmodel.length > 0
	else if(type === 'select')
		return vmodel !== options[0]
}