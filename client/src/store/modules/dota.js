
import axios from 'axios'
import _ from 'lodash'
import * as MUTATIONS from '../mutations'
import * as ACTIONS from '../actions'

export const NS_DOTA = 'dota'

//'http://cdn.dota2.com/apps/dota2/images/heroes/antimage_sb.png'.
//filename is hero id + '_' + image suffix type. sb is the small image square
const IMAGE_CDN = 'http://cdn.dota2.com/apps/dota2/images/heroes/'

const dota = {
    namespaced: true,
    state: { 
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
                    val.img = IMAGE_CDN + id + `_sb.png`;
                    return val
                })
                commit(MUTATIONS.SET_HEROES,{ heroes })
            })
        }
    }
}

export default dota
