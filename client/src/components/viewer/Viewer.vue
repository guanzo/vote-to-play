<template>
    <div class="viewer">
        <div class="viewer-header">
            <img @click="isExpanded = !isExpanded" class="logo" src="~@/assets/images/dotavoter-logo.png">
        </div>
        <transition name="fade-vertical">
            <div v-show="isExpanded" class="viewer-body">
                <component :is="selectedGame"></component>
            </div>
        </transition>
    </div>
</template>

<script>

import axios from 'axios'
import { mapState } from 'vuex'
import _ from 'lodash'
import dota from './dota/Dota'
import lol from './lol/LeagueOfLegends'
import ow from './ow/Overwatch'

export default {
    name: 'viewer',
    data(){
        return {
            isExpanded: false
        }
    },
    computed:{
        ...mapState(['selectedGame','isActiveVote']),
    },
    components:{
        'Dota 2': dota,
        'Overwatch': ow,
        'League of Legends': lol
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.viewer{
    padding: 15px;
    .viewer-header{
        margin-top: 40px;
        margin-bottom: 15px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        opacity: 0.35;
        transition: 0.35s;
        -webkit-backface-visibility: hidden;
        &:hover{
            opacity: 1;
        }
        .logo{
            width: 30px;
            height: 30px;
            cursor: pointer;
        }
    }
    .viewer-body{
        display: flex;
        
    }
}



</style>
