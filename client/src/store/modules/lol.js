import axios from 'axios'
import _ from 'lodash'
import * as MUTATIONS from '../mutations'
import * as ACTIONS from '../actions'

export const NS_LOL = 'lol'

const IMG_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/'

const lol = {
    namespaced: true,
    state: { 
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
                    val.img = IMG_BASE_URL + val.image.full;
                    return val
                })
                commit(MUTATIONS.SET_HEROES,{ heroes })
            })
        }
    }
}




export default lol
