

import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

export const NAMESPACE_LOL = 'lol'

const IMG_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/'
const IMG_SPLASH_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/'
const lol = {
    namespaced: true,
    state: { 
        gameName: 'League of Legends',
        characterNomenclature: 'champion',
        maxResults: 5,
        heroes: []
    },
    mutations:{
        [MUTATIONS.SET_HEROES](state, { heroes }){
            state.heroes = heroes
        }
    },
    actions:{
        [ACTIONS.GET_HEROES]({commit}){
            axios.get('https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json')
            .then((response)=>{
                
                let heroes = _.map(response.data.data,(val)=>{
                    val.name = val.id;
                    val.img = IMG_BASE_URL + val.image.full;
                    //riot provides splash art per skin, thats what the _0 is for.
                    //maybe in the future, cycle thru skins.
                    val.imgSplash = IMG_SPLASH_BASE_URL + val.name + '_0.jpg'
                    return val
                })
                commit(MUTATIONS.SET_HEROES,{ heroes })
            })
        }
    }
}




export default lol
