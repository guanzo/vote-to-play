<template>
    <Candidate
        :candidate="candidate"
        :showNameInGrid="showNameInGrid"
        class="candidate-vote"
        :class="{ 'is-selected': isSelected }"
    />
</template>

<script>
// Adds functionality to selected candidates within the voting grid.

import Candidate from './Candidate'

export default {
    name:'candidate-vote',
    props:{
        candidate: Object,
        showNameInGrid: Boolean
    },
    computed: {
        ...Vuex.mapState(['selectedCandidate']),
        isSelected () {
            const { name } = this.selectedCandidate
            return name === this.candidate.name
        },
    },
    components: {
        Candidate
    }
}

</script>

<style lang="scss" scoped>

.candidate-vote {
    &.is-selected {
        box-shadow: 0px 0px 2px 1px #eee;
    }
}

</style>
