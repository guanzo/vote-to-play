<template>

<div class="voter-header is-size-5 flex-center">
    <div class="flex-center">
        <div class="image-wrapper flex-center"
                :class="{'default-vote': !hasSelectedCandidate}">
            <transition name="fade" @leave="reflowTransition" @enter="reflowTransition">
                    <div v-if="!hasSelectedCandidate" class="header-img"><span class="icon-help" /></div>
                    <img v-else
                        :src="selectedCandidate.img"
                        :alt="selectedCandidate.name"
                        :key="selectedCandidate.name"
                        class="header-img"
                    >
            </transition>
        </div>
        <div class="ellipsis" >
            <transition name="fade" @leave="reflowTransition" @enter="reflowTransition">
                <div v-if="!hasSelectedCandidate" class="header-name">Your Vote</div>
                <div v-else :key="selectedCandidate.name" class="header-name">{{ selectedCandidate.name }}</div>
            </transition>
        </div>
    </div>
</div>

</template>

<script>

export default {
    name:'voter-header',
    props:{
        hasSelectedCandidate: Boolean,
        selectedCandidate: Object
    },
    data(){
        return {
            imgLeavingX: 0,
            nameLeavingX: 0
        }
    },
    beforeUpdate(){
        this.imgLeavingX = this.$el.querySelector('.header-img').getBoundingClientRect().x
        this.nameLeavingX = this.$el.querySelector('.header-name').getBoundingClientRect().x
    },
    methods:{
        /** Entering & leaving elements have the exact same transition
         *  The point is to animate the document reflow.
         */
        reflowTransition(el){
            this.$nextTick(()=>{
                const enteringX = el.getBoundingClientRect().x
                const leavingX = this.getLeavingElementX(el)
                el.style.transitionProperty = 'none';
                el.style.transform = `translateX(${leavingX - enteringX}px) translateZ(0) scale(1.0, 1.0)`
                el.offsetHeight
                el.style.transitionProperty = 'all';
                el.style.transform = null
            })
        },
        getLeavingElementX(el){
            if(el.classList.contains('header-img'))
                return this.imgLeavingX
            else
                return this.nameLeavingX
        },

    }
}

</script>

<style lang="scss" scoped>

.voter-header {
    grid-area: header;
    position: relative;
    color: white;
    text-shadow: #000 0px 0px 2px;
    transition: .5s;
    > * {
        max-width: 100%;
        position: relative;
    }
    img{
        backface-visibility: hidden;
    }
    .fade-enter-active, .fade-leave-active{
        transition: .25s;
    }
    .fade-leave-active{
        position: absolute;
    }
    .default-vote.image-wrapper{
        background: #333;
    }
    .image-wrapper{
        margin-right: 10px;
    }
    .ellipsis{
        flex: 1;
        overflow: visible;
    }
}

</style>
