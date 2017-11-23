
<script>
    export default {
        render(){
            return (
                <div>
                    <div class="tabs is-fullwidth is-small ">
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
                    <div class="tab-body-container">
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
            console.log(this.$slots.default.filter(slot=>slot.tag))
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
            setTabVisible(hash, visible) {
                const tab = this.findTab(hash);
                if (! tab) {
                    return;
                }
                tab.isVisible = visible;
                if (tab.isActive) {
                    // If tab is active, set a different one as active.
                    tab.isActive = visible;
                    this.tabs.every((tab, index, array) => {
                        if (tab.isVisible) {
                            tab.isActive = true;
                            return false;
                        }
                        return true;
                    });
                }
            },
        },
    };
</script>

<style lang="scss" scoped>

.tab-body-container{
    position: relative;
}

</style>