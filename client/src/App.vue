<template>
	<div id="app">
		<router-view v-if="isAuthed && selectedGame"/>
	</div>
</template>

<script>

import voteApi from '@/api/vote-api'
export default {
    name: 'app',
    data () {
        return {
            hasFetchedInitialState: false
        }
    },
    computed: {
        ...Vuex.mapState(['isAuthed', 'selectedGame']),
        canFetchInitialState () {
            return this.isAuthed && this.selectedGame
        }
    },
    watch: {
        canFetchInitialState () {
            if (this.hasFetchedInitialState) {
                return
            }
            this.hasFetchedInitialState = true
            voteApi.getInitialState()
        }
    },
}
</script>

<style lang="scss">

html,
body {
    background: transparent !important;
    margin: 0;
    padding: 0;
    height: 100%;
}

#app {
    color: #eee;
    display: flex;
    flex-direction: column;
    height:100%;
    width:100%;
}

</style>
