import axios from 'axios'

import * as MUTATIONS from '../mutations'
import * as ACTIONS from '../actions'

export const NS_LOL = 'lol'

const lol = {
    namespaced: true,
    state: { 
        champions: []
    },
    mutations:{
        [MUTATIONS.SET_HEROES](state,payload){
            state.champions = payload.data
        }
    },
    actions:{
        [ACTIONS.GET_HEROES]({commit}){
            console.log("get lol heroes")
            axios.get('https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json')
            .then((response)=>{
                commit(MUTATIONS.SET_HEROES,{ data: response.data.data })
            })
        }
    }
}




export default lol
