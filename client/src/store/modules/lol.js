import axios from 'axios'

import * as MUTATIONS from '../mutations'
import * as ACTIONS from '../actions'

const dota = {
    state: { 
        champions: []
    },
    mutations:{
        [MUTATIONS.SET_CHAMPIONS](state,payload){
            state.champions = payload.data
        }
    },
    actions:{
        [ACTIONS.GET_CHAMPIONS]({commit}){
            axios.get('https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json')
            .then((response)=>{
                commit(MUTATIONS.SET_CHAMPIONS,{ data: response.data.data })
            })
        }
    }
}




export default dota
