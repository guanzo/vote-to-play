<template>
    <div class="flex-center is-size-7">
        <table class="table is-narrow m-b-0">
            <tbody>
                <tr><td>Category</td><td>{{ voteCategory }}</td></tr>
                <tr><td>Mode</td><td>{{ voteMode }}</td></tr>
                <tr v-show="votes.length"><td>Total votes</td><td>{{ votes.length }}</td></tr>
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
    name:'vote-stats',
    computed:{
        ...Vuex.mapState(['votes','voteCategory','voteMode']),
    }
}

</script>

<style lang="scss" scoped>

.table{
    background: transparent;
}

</style>