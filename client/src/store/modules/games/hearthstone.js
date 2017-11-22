import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './_whitelistMixin';


const IMG_BASE_URL = 'https://us.battle.net/hearthstone/static/images/game-guide/heroes/artwork-'

export const NAMESPACE = 'Hearthstone'
//name and title are reversed b/c ppl refer to them by "class" and not actual "name"
const hearthstone = _.merge({
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'class',
        className: 'hearthstone',
        maxVoteResults: 3,
        showNameInGrid: false,
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
        filters:[]
    },
    mutations:{//ensure it conforms to game module expected properties
        [MUTATIONS.SET_CANDIDATES](){},
        
    },
    actions:{
        [ACTIONS.GET_CANDIDATES](){}
    },
    getters:{//no op
        filteredCandidates: state=>state.candidates,
    }
},whitelistMixin)

export default hearthstone
