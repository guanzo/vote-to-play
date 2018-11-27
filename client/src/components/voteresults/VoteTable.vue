<template>
    <div class="vote-table">
        <table>
            <thead>
                <tr>
                    <td class="rank">Rank</td>
                    <td />
                    <td />
                    <td class="count">Votes</td>
                </tr>
            </thead>
            <transition-group class="vote-list" name="vote-list" tag="tbody">
                <tr v-for="vote in votes" class="vote-item" :key="vote.vote">
                    <td class="rank">{{ vote.rank }}</td>
                    <td class="vote-image">
                        <div v-if="displayImages" class="image-wrapper">
                            <img :src="getCandidateImage(vote.vote)">
                        </div>
                    </td>
                    <td class="vote-name">{{ vote.vote }}</td>
                    <td class="count">{{ vote.count }}</td>
                </tr>
            </transition-group>
        </table>
    </div>
</template>

<script>

import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'

export default {
    name:'vote-table',
    props: {
        votes: Array,
    },
    computed:{
        game(){
            return this.$store.getters.selectedGameModule
        },
        namespace() { return this.game.gameName   },
        candidates(){
            return this.$store.getters[this.namespace+'/candidates']
        },
        //no images for live config, or if vote category is all games
        displayImages(){
            if(this.$route.path.includes('liveconfig') || this.namespace === ALL_GAMES)
                return false;
            return true
        }
    },
	methods:{
        getCandidateImage(name){
            const candidate = _.find(this.candidates,candidate=>{
                return candidate.name.toLowerCase() === name.toLowerCase()
            })
            return candidate ? candidate.img : ''
        },
	},
}

</script>

<style lang="scss" scoped>

.vote-table{
    position: relative;
}

table {
    width: 100%;
    td {
        padding: 3px;
    }
    tr{
        transition: all 1s;
        td{
            vertical-align: middle;
        }
        .rank {
            width: 50px;
            text-align: center;
        }
        .count {
            text-align: right;
        }
        .vote-image {
            width: 1%;
        }
        .vote-name {
            //width: 99%;
        }
        img {
            vertical-align: middle;
        }
        .percent {
            width: 45px;
            text-align: right;
        }
    }
}

.vote-list-enter, .vote-list-leave-to{
    opacity: 0;
    transform: translateY(30px);
}
.vote-list-leave-active {
    position: absolute;
}
</style>
