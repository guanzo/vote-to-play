<template>
<div class="live-config">
    <tabs>
        <tab name="Settings">
            <settings />
        </tab>
        <tab name="Votes">
            <vote-info />
            <vote-results />
        </tab>
    </tabs>
    <heartstone-notification />
</div>
</template>

<script>
import settings from './Settings'
import voteInfo from './VoteInfo'
import voteResults from '@/components/voteresults/VoteResults'
import tabs from '@/components/util/tabs/Tabs'
import tab from '@/components/util/tabs/Tab'
import heartstoneNotification from './HearthstoneNotification'


export default {
    name: 'live-config',
    components:{
        settings,
        voteInfo,
        voteResults,
        tabs,
        tab,
        heartstoneNotification
    }
}
</script>


<style lang="scss" scoped>

.live-config{
    position: relative;
    flex: 1;
    padding: 5px 0px;
    background: $white-bis;
    color: #333;
    /deep/ .tabs{
        margin-bottom: 1rem;
    }
    .tab-wrapper{
        min-height: 100%;
    }
    .notification{
        position: absolute;
        bottom: 0;
        left: 0;
    }
}

</style>
