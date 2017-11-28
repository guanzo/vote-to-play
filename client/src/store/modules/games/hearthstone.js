import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';

export const NAMESPACE = 'Hearthstone'

import gameApi from '@/api/game'

const IMG_BASE_URL = 'https://us.battle.net/hearthstone/static/images/game-guide/heroes/artwork-'

//name and title are reversed b/c ppl refer to them by "class" and not actual "name"
const hearthstone = _.merge({
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'class',
        className: 'hearthstone',
        maxVoteResults: 3,
        showNameInGrid: true,
        candidates: [
             {
                name: "Druid",
                title: 'Malfurion Stormrage',
                img: IMG_BASE_URL + 'malfurion.jpg',
                imgSplash: cl.url('hearthstone/splash/Druid_splash.jpg')
            },
            {
                name: "Hunter",
                title: 'Rexxar',
                img: IMG_BASE_URL + 'rexxar.jpg',
                imgSplash: cl.url('hearthstone/splash/Hunter_splash.jpg')
            },
            {
                name: "Mage",
                title: 'Jaina Proudmoore',
                img: IMG_BASE_URL + 'jaina.jpg',
                imgSplash: cl.url('hearthstone/splash/Mage_splash.jpg')
            },
            {
                name: "Paladin",
                title: 'Uther Lightbringer',
                img: IMG_BASE_URL + 'uther.jpg',
                imgSplash: cl.url('hearthstone/splash/Paladin_splash.jpg')
            },
            {
                name: "Priest",
                title: 'Anduin Wrynn',
                img: IMG_BASE_URL + 'anduin.jpg',
                imgSplash: cl.url('hearthstone/splash/Priest_splash.jpg')
            },
            {
                name: "Rogue",
                title: 'Valeera Sanguinar',
                img: IMG_BASE_URL + 'valeera.jpg',
                imgSplash: cl.url('hearthstone/splash/Rogue_splash.jpg')
            },
            {
                name: "Shaman",
                title: 'Thrall',
                img: IMG_BASE_URL + 'thrall.jpg',
                imgSplash: cl.url('hearthstone/splash/Shaman_splash.jpg')
            },
            {
                name: "Warlock",
                title: "Gul'dan",
                img: IMG_BASE_URL + 'guldan.jpg',
                imgSplash: cl.url('hearthstone/splash/Warlock_splash.jpg')
            },
            {
                name: "Warrior",
                title: 'Garrosh Hellscream',
                img: IMG_BASE_URL + 'garrosh.jpg',
                imgSplash: cl.url('hearthstone/splash/Warrior_splash.jpg')
            }
        ],
        decks:[],
        filters:[]
    },
    mutations:{//ensure it conforms to game module expected properties
        [MUTATIONS.SET_CANDIDATES](){},
        [MUTATIONS.SET_HEARTHSTONE_DECKS](state, decks){
            decks = decks.map(deck=>{
                let candidate = state.candidates.find(d=>d.name == deck.class)
                return Object.assign({},candidate, deck)
            })
            state.decks = decks
        }
    },
    actions:{
        [ACTIONS.GET_CANDIDATES](){},
        [ACTIONS.SET_HEARTHSTONE_DECKS]({dispatch,rootState},decks){
            //strip unnecessary properties
            decks = decks.map(d=>_.pick(d,'class','name'))
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
            
            if(validWhitelistNames.length == whitelistedNames.length)
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
},whitelistMixin)

export default hearthstone
