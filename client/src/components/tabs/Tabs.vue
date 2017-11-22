<template>
    <div class="tabs">
        <ul>
            <li v-for="tab in tabs"
                :class="{ 'is-active': tab.isActive }"
                v-show="tab.isVisible"
                :key="tab.id"
            >
                <a v-html="tab.header"
                   @click="selectTab(tab.hash, $event)"
                   :href="tab.hash"
                ></a>
            </li>
        </ul>
        <div>
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({
            tabs: [],
            activeTabHash: '',
        }),
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
            selectTab(selectedTabHash, event) {
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