import * as M from '@/store/mutations'
import * as A from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';
import { gameOptions, gameMixin, FILTER_MODE_NONE } from './util/gameMixin'

export const NAMESPACE = 'Hearthstone'

//important for this to be after the namespace export
import gameApi from '@/api/game-api'
import voteApi from '@/api/vote-api'
//name and title are reversed b/c ppl refer to them by "class" and not actual "name"
const hearthstone = _.merge({},gameMixin,whitelistMixin,{
    namespaced: true,
    state: {
        gameName: NAMESPACE,
        candidateNomenclature: 'class',
		className: 'hearthstone',
		gameOptions: gameOptions({
			showNameInGrid: true,
			filterMode: FILTER_MODE_NONE,
		}),
        candidates: [],
        decks:[],
        filters:[]
    },
    mutations:{
        [M.SET_CANDIDATES](state, { candidates }){
			state.candidates = candidates
		},
        [M.SET_HEARTHSTONE_DECKS](state, decks){
			state.decks = decks
			cl('state.decks', state.decks)
        }
    },
    actions:{
        [A.GET_CANDIDATES]({commit}){
			return gameApi.fetchJson('hearthstone_heroes.json')
			.then(res=>{
				const candidates = res.data
                commit(M.SET_CANDIDATES,{ candidates })
			})
		},//User may delete a deck that's in the whitelist. If so, update whitelist
        ensureWhitelistInSync({state},decks){
            const { candidates, whitelistedNames } = state

            const validWhitelistNames = _.intersectionBy(
				whitelistedNames,
				[...candidates, ...decks],
				'name'
			)

            if(validWhitelistNames.length === whitelistedNames.length) {
				return
			}

            const gameWhitelist = {
                voteCategory: NAMESPACE,
                names: validWhitelistNames
			}
			voteApi.saveGameWhitelist(gameWhitelist)
        }
    },
    getters:{
        candidates({ candidates, decks }){
			//assign needed properties from existing decks, such as imgSplash
            decks = decks.map(deck=>{
				const candidate = candidates.find(d=>d.name === deck.class)
                return Object.assign({},candidate, deck)
			})
			return _.sortBy([...candidates, ...decks],'name')
        },
        hasCustomDecks({ decks }){
            return decks.length > 0
        },
        //no op
        filteredCandidates: (state,getters)=>getters.candidates,
    }
})

export default hearthstone
