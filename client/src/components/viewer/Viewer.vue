<template>
    <div class="viewer">
        <div class="viewer-header">
            <transition name="fade">
                <div v-if="showExpandTip" class="expand-tip overlay-background">
                    The broadcaster wants your vote! <span v-if="!isExpanded">Click the icon to proceed.</span>
                </div>
            </transition>
            <img @click="showUI" class="logo" src="~@/assets/images/dotavoter-logo.png">
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
import { mapState, mapGetters } from 'vuex'
import _ from 'lodash'
import dota from './dota/Dota'
import lol from './lol/LeagueOfLegends'
import ow from './ow/Overwatch'

export default {
    name: 'viewer',
    data(){
        return {
            isExpanded: false,
            showExpandTip: false,
        }
    },
    computed:{
        ...mapState(['selectedGame','votes']),
        ...mapGetters(['userSubmittedVote'])
    },
    watch:{
        votes(){
            if(this.votes.length == 0)
                this.showExpandTip = true;
        },
        userSubmittedVote(){
            if(this.userSubmittedVote)
                this.showExpandTip = false;
        }
    },
    methods:{
        showUI(){
            this.isExpanded = !this.isExpanded
            this.showExpandTip = false;
        }
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
        .logo{
            width: 30px;
            height: 30px;
            cursor: pointer;
            opacity: 0.35;
            transition: 0.35s;
            -webkit-backface-visibility: hidden;
            &:hover{
                opacity: 1;
            }
        }
    }
    .viewer-body{
        display: flex;
        
    }
    .expand-tip {
        padding: 5px 7.5px;
        margin-right: 15px;
    }
}



</style>
