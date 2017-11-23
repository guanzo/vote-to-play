<template>
    <transition :name="transitionName">
        <section class="tab-content" v-show="isActive" :id="hash" >
            <slot />
        </section>
    </transition>
</template>

<script>
    export default {
        props: {
            id: { default: null },
            name: { required: true },
            direction: { default: 'none' }
        },
        data: () => ({
            isActive: false,
        }),
        computed: {
            transitionName(){
                return `tab-to-${this.direction}`
            },
            header() {
                return this.name;
            },
            hash() {
                return this.id ?
                    '#' + this.id :
                    '#' + this.name.toLowerCase().replace(/ /g, '-');
            },
        },
    };
</script>

<style lang="scss" scoped>

.tab-content{//vue material $md-transition-default-timing
    transition: .35s cubic-bezier(.4, 0, .2, 1);
}

.tab-to-left-enter,
.tab-to-right-leave-to{
    transform: translateX(-100%);
}

.tab-to-right-enter,
.tab-to-left-leave-to{
    transform: translateX(100%);
}
.tab-to-right-leave-active,
.tab-to-left-leave-active,{
    position: absolute;
    top:0;
    width: 100%;
}

</style>