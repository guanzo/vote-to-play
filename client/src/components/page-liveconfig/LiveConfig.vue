<template>
<div class="live-config">
    <tabs>
        <tab name="Settings">
            <settings></settings>
        </tab>
        <tab name="Vote">
            <vote-info></vote-info>
            <vote-results></vote-results>
        </tab>
    </tabs>
</div>
</template>

<script>
import settings from './Settings'
import voteInfo from './VoteInfo'
import voteResults from '@/components/voteresults/VoteResults'
import tabs from '@/components/util/tabs/Tabs'
import tab from '@/components/util/tabs/Tab'

export default {
    name: 'live-config',
    components:{
        settings,
        voteInfo,
        voteResults,
        tabs,
        tab
    }
}
</script>


<style lang="scss" scoped>

.live-config{
    padding: 5px;
    color: #333;
    height: 100%;
    position: relative;
    > div {
        min-height: 100%;
    }
    /deep/ .tabs{
        margin-bottom: 1rem;
    }
}

</style>
