<template>
    <table>
        <thead>
            <tr>
                <td class="rank">Rank</td>
                <td></td>
                <td></td>
                <td class="count">Votes</td>
            </tr>
        </thead>
        <transition-group class="vote-list" name="vote-list" tag="tbody" v-on:before-leave="beforeLeave">
            <tr v-for="(vote,i) in votes"  class="vote-item" :key="vote.vote">
                <td class="rank">{{ vote.rank }}</td>
                <td class="vote-image">
                    <div v-if="displayImages" class="image-wrapper">
                        <img :src="getHeroImage(vote.vote)">
                    </div>
                </td>
                <td class="vote-name">{{ vote.vote }}</td> 
                <td class="count">{{ vote.count }}</td> 
            </tr>
        </transition-group>
    </table>
</template>

<script>

export default {
    name:'vote-table',
    props: {
        votes: Array,
        //no images for live config, or if vote category is all games
        displayImages: {
            type: Boolean,
            default: true
        }
    },
    computed:{
        game(){
            return this.$store.getters.game
        },
    },
	methods:{
        getHeroImage(name){
            if(!this.game.heroes)
                return '';
            let hero = _.find(this.game.heroes,hero=>{
                return hero.name.toLowerCase() == name.toLowerCase()
            })
            return hero ? hero.img : ''
        },
        beforeLeave(tr){
            //td widths collapse during list-leave b/c of position: absolute.
            for(var td of tr.children){
                td.style.width = td.offsetWidth + 'px'
            }
        }
	},
}

</script>

<style lang="scss" scoped>

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
    width: 320px;
    position: absolute;
}
</style>