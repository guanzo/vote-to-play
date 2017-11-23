<template>
<div class="live-config">
    <tabs>
        <tab name="Settings">
            <settings></settings>
        </tab>
        <tab name="Vote">
            <vote-results :showStats="true">
            </vote-results>
        </tab>
    </tabs>
</div>
</template>

<script>
import settings from './Settings'
import voteResults from '@/components/voteresults/VoteResults'
import tabs from '@/components/tabs/Tabs'
import tab from '@/components/tabs/Tab'

export default {
    name: 'live-config',
    components:{
        settings,
        voteResults,
        tabs,
        tab
    }
}
</script>


<style lang="scss">

.live-config{
    padding: 5px;
    color: #333;
    height: 100%;
    position: relative;
    > div {
        min-height: 100%;
    }
}

</style>
