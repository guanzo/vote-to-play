
<script>
    export default {
        render(){
            return (
                <div class="tab-wrapper">
                    <div class="tabs is-fullwidth is-small">
                        <ul>
                            {this.tabs.map(tab=>{
                                return (
                                    <li class={{ 'is-active':tab.isActive }} key={tab.id}>
                                        <a onClick={this.selectTab.bind(this,tab.hash)}
                                            href={tab.hash}
                                        >{tab.header}</a>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div class="tab-content-wrapper">
                    {this.$slots.default.filter(slot=>slot.tag).map(slot=>{
                        if(slot.componentInstance)
                            slot.componentInstance.direction = this.direction
                        return slot
                    })}
                    </div>
                </div>
            )
        },
        data: () => ({
            tabs: [],
            activeTabHash: '',
            direction: ''
        }),
        watch:{
            activeTabHash(newTab,oldTab){
                if(!oldTab)
                    return this.direction = 'none'
                let newIndex = this.findTabIndex(newTab)
                let oldIndex = this.findTabIndex(oldTab)
                this.direction = (newIndex > oldIndex) ? 'right':'left'
            }
        },
        created() {
            this.tabs = this.$children;
        },
        mounted() {
            if (this.tabs.length) 
                this.selectTab(this.tabs[0].hash);
        },
        methods: {
            findTab(hash) {
                return this.tabs.find(tab => tab.hash === hash);
            },
            findTabIndex(hash) {
                return this.tabs.findIndex(tab=>tab.hash == hash)
            },
            selectTab(selectedTabHash) {
                const selectedTab = this.findTab(selectedTabHash);
                if (! selectedTab) {
                    return;
                }
                this.tabs.forEach(tab => {
                    tab.isActive = (tab.hash === selectedTab.hash);
                });
                this.$emit('changed', { tab: selectedTab });
                this.activeTabHash = selectedTab.hash;
            },
        },
    };
</script>

<style lang="scss" scoped>

.tab-wrapper{
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto 1fr;
    grid-template-areas:
        "tabs"
        "tab-content";
}

.tabs{
    grid-area: tabs;
}

.tab-content-wrapper{
    grid-area: tab-content;
    position: relative;
    > * {
        min-height: 100%;
    }
}

</style>