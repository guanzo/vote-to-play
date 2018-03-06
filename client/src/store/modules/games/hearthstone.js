import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';
import { gameOptions, gameMixin, FILTER_MODE_NONE } from './util/gameMixin'

export const NAMESPACE = 'Hearthstone'

//important for this to be after the namespace export
import gameApi from '@/api/game'
//name and title are reversed b/c ppl refer to them by "class" and not actual "name"
const hearthstone = _.merge({
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'class',
		className: 'hearthstone',
		gameOptions: gameOptions({ 
			showNameInGrid: true, 
			filterMode: FILTER_MODE_NONE,
			maxVoteResults: 3
		}),
        candidates: [],
        decks:[],
        filters:[]
    },
    mutations:{
        [MUTATIONS.SET_CANDIDATES](state,{ candidates }){
			state.candidates = candidates
		},
        [MUTATIONS.SET_HEARTHSTONE_DECKS](state, decks){
			//assign needed properties from existing decks, such as imgSplash
            decks = decks.map(deck=>{
                let candidate = state.candidates.find(d=>d.name === deck.class)
                return Object.assign({},candidate, deck)
            })
            state.decks = decks
        }
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({commit}){
			return gameApi.fetchJson('hearthstone_heroes.json')
			.then(res=>{
				let candidates = res.data
                commit(MUTATIONS.SET_CANDIDATES,{ candidates })
			})
		},
        [ACTIONS.SET_HEARTHSTONE_DECKS]({dispatch,rootState},decks){
            //strip unnecessary properties
            decks = decks.map(d=>_.pick(d,'id','class','name'))
            gameApi.addHearthstoneDeck({
                channelId: rootState.channelId, 
                decks
            })
            dispatch('ensureWhitelistInSync',decks)
        },//User may delete a deck that's in the whitelist. If so, update whitelist
        ensureWhitelistInSync({state, dispatch},decks){
            let { candidates, whitelistedNames } = state
            let originalClasses = candidates.map(d=>d.name)
            let deckClasses = decks.map(d=>d.name)

            let validWhitelistNames = _.intersection(whitelistedNames,
                    [...originalClasses, ...deckClasses])
            
            if(validWhitelistNames.length === whitelistedNames.length)
                return;

            let gameWhitelist = {
                voteCategory: NAMESPACE,
                names: validWhitelistNames.map(d=>({name:d}))
            }
            dispatch(ACTIONS.SAVE_GAME_WHITELIST, gameWhitelist,{ root: true } )

        }
    },
    getters:{
        candidates({candidates, decks}){
            return _.sortBy([...candidates, ...decks],'name')
        },
        hasCustomDecks({ decks }){
            return decks.length > 0
        },
        //no op
        filteredCandidates: (state,getters)=>getters.candidates,
    }
},gameMixin,whitelistMixin)

export default hearthstone
