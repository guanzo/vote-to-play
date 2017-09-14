<template>
    <div class="viewer">
        <div class="viewer-header">
            <span @click="isExpanded = !isExpanded" class="icon">
                <i class="fa" :class="expandIcon"></i>
            </span>
            &nbsp;
            <img class="logo" src="~@/assets/images/dotavoter-logo.png">
        </div>
        <div class="viewer-body">
            <component :is="selectedGame"></component>
        </div>
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
        expandIcon(){
            return this.isExpanded ? 'fa-window-close-o' : 'fa-window-maximize'
        },
    },
    watch:{
        voteStatus(){

        }
    },
    created(){

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
        .icon{
            color: #eee;
            cursor: pointer;
        }
        .logo{
            width: 30px;
            height: 30px;
        }
    }
    .viewer-body{
        display: flex;
    }
}

</style>
