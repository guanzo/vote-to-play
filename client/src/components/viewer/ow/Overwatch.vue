<template>
    <div class="ow">
        overwatch
        <vote-results></vote-results>
    </div>
</template>

<script>

import axios from 'axios'
import _ from 'lodash'
import {VOTE} from '@/store/actions'
import voteResults from '../VoteResults'

const DEFAULT_ROLE = 'Roles'

export default {
    name: 'ow-heroes',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            selectedHero: null
        }
    },
    computed:{
        heroes(){
            return this.$store.state.dota.heroes
        },
        sortedHeroes(){
            return _.sortBy(this.heroes,'dname')
        },
        roles(){
            return _(this.heroes).map(hero=>hero.roles).flatMap().uniq().sort().value()
        }
    },
    methods:{
        passesFilter(hero){
            let result = true;
            if(this.query.length)
                result = hero.dname.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && hero.roles.includes(this.selectedRole)
            return result;
        },
        vote(){
            this.$store.dispatch(VOTE, { vote: this.selectedHero.name })
        }
    },
    components:{
        voteResults
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.dota{
	font-family: 'Cinzel', serif;
    color: #eee;
    display: flex;
}

.dota-heroes{
    .images{
        display: flex;
        flex-wrap: wrap;
    }
    button{
        float: right;
    }
    
}


.image-wrapper{
    position: relative;
    transition: .3s all;
    cursor: pointer;
    &:before {
        box-shadow: 0px 0px 0px 0px $primary inset;
    }
    &:hover:before {
        box-shadow: 0px 0px 0px 3px #eee inset;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: "";
    }
    &:hover{
        box-shadow: 0px 0px 0px 3px $primary inset;
    }
    img {
        display: block;
        transition: .3s all;
        &.filtered-out {
            filter: brightness(20%);
        }
    }
}

.vote-bar{
    margin-top: 20px;
    padding: 5px;
    .default-vote, .your-vote {
        padding: 5px;
        background: $overlay-background;
    }
    .default-vote {
        display: flex;
        .image-placeholder{
            background: grey;
            width: 60px;
            height: 30px;
        }
    }
    .your-vote {
        display: flex;
        margin-left: auto;
        font-size: 1.5em;
        color: white;
        text-shadow: #000 0px 0px 2px;
        span {
            margin-right: 10px;
        }
    }
    .vote-button {
        margin-left: auto;
    }
}

</style>
