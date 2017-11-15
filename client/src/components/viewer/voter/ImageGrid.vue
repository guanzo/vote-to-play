<template>
    <div class="image-grid" :style="overflow">
        <div v-for="(hero,i) in heroes"
            @click="selectVote(hero)"
            :class="filterClass(hero)" 
            class="image-wrapper" 
            :key="hero.name"
        >
            <img :src="hero.img" :alt="hero.name">
        </div>
    </div>
</template>

<script>
import { SELECT_VOTE } from '@/store/mutations'

export default {
    name:'image-grid',
    props:['heroes','filteredHeroes'],
    computed:{
        hasActiveFilter(){
            return this.filteredHeroes.length < this.heroes.length
        },
    },
    methods:{
        selectVote(vote){
            this.$store.commit(SELECT_VOTE, { vote })
            this.$emit('select-vote',vote)
        },
        filterClass(hero){
            if(!this.hasActiveFilter)
                return ''
            return this.passesFilter(hero) ? 'filtered-in': 'filtered-out'
        },
        passesFilter(hero){
            return this.filteredHeroes.find(d=>d.name == hero.name)
        },
    }
}

</script>

<style lang="scss" scoped>

.image-grid{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0px;
    overflow-y: auto;
    overflow-x: hidden;
    transition: .5s;
    .image-wrapper{
        margin: 2px;
        position: relative;
        transition: .5s;
        img {
            display: block;
        }
        cursor: pointer;
        &.filtered-out {
            filter: brightness(20%);
        }
        &.filtered-in {
            box-shadow: 0px 0px 2px 1px white;
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
    }
}
</style>