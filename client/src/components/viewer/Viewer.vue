<template>
    <div class="viewer">
        <div class="viewer-header">
            <img class="logo" src="~@/assets/images/dotavoter-logo.png">
        </div>
        <div class="viewer-body">
            <component :is="selectedGame"></component>
        </div>
    </div>
</template>

<script>

import axios from 'axios'
import _ from 'lodash'
import dota from './Dota/Dota'

export default {
    name: 'viewer',
    computed:{
        selectedGame(){
            return this.$store.state.selectedGame
        }
    },
    created(){
    },
    components:{
        'Dota 2': dota,
        'Overwatch': dota,
        'League of Legends': dota
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.viewer{
    padding: 15px;
    .viewer-header{
        margin-top: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .logo{
            width: 30px;
            height: 30px;
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
}

</style>
