<template>
    <select v-model="game" class="select">
        <option value="" disabled selected>Select game</option>
        <option v-for="game in games" :value="game.abbr" :key="game.name">{{ game.name }}</option>
    </select>
</template>

<script>

import { SELECT_GAME } from '@/store/actions'

export default {
	name: 'select-game',
	computed:{
        games(){
            return this.$store.state.games
        },
        game: {
            get () {
                return this.$store.state.selectedGame
            },
            set (value) {
                this.$store.dispatch(SELECT_GAME, { game: value})
            }
        }
    },
}
</script>
