
import axios from 'axios'
import _ from 'lodash'
import * as MUTATIONS from '../mutations'
import * as ACTIONS from '../actions'

export const NAMESPACE_DOTA = 'dota'

const dota = {
    namespaced: true,
    state: { 
        gameName: 'Dota 2',
        nomenclature: 'hero',
        maxResults: 5,
        heroes: []
    },
    mutations:{
        [MUTATIONS.SET_HEROES](state,{ heroes }){
            state.heroes = heroes
        }
    },
    actions:{
        [ACTIONS.GET_HEROES]({commit}){
            axios.get(process.env.SERVER_URL+'/api/heroes/dota')
            .then((response)=>{

                let heroes = _.map(response.data,(val,id)=>{
                    val.id = id
                    val.img = require("@/assets/images/dota/portraits/" + id + `_sb.png`);
                    return val
                })
                commit(MUTATIONS.SET_HEROES,{ heroes })
            })
        }
    }
}

export default dota
