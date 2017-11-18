<template>
    <transition name="fade">
        <div v-if="splashTransition.isActive && splashImg" class="splash-img-container">
            <img class="splash-img" 
                :class="splashTransition.splashClass" 
                :style="splashTransition.splashStyle" 
                :src="splashImg"
            >
            <div v-if="selectedCandidate.title" class="hero-title">
                {{ selectedCandidate.title }}
            </div>
        </div>
    </transition>
</template>

<script>

export default {
    name:'splash',
    props:['splashTransition','selectedCandidate'],
    data(){
        return {
            splashImg: null
        }
    },
    watch:{
        'splashTransition.isActive'(isActive){
            if(!isActive){
                this.splashImg = null
                return;
            }

            var img = new Image();
            img.onload = ()=>{
                this.splashTransition.splashImgIsLoaded = true
                this.splashImg = img.src
                this.$nextTick(this.setEndListener)
            };         
            img.onerror = ()=>{
                this.$emit('transitionDone')
            }
            img.src = this.selectedCandidate.imgSplash;
        }
    },
    methods:{
        setEndListener(){
            let el = this.$el.querySelector('img')
            el.addEventListener('animationend',()=>{
                this.$emit('transitionDone')
            })
        }
    }
}

</script>

<style lang="scss">

$shift-amount: 5;

@keyframes shift-to-right{
    from { transform: translateX(0); }
    to {   transform: translateX($shift-amount * 1%); }
}
@keyframes shift-to-left{
    from { transform: translateX(0); }
    to {   transform: translateX($shift-amount * -1%); }
}
.splash-img-container {
    position: absolute;
    z-index: 0;
    overflow: hidden;
    width:100%;
    height:100%;
    top: 0;
    left: 0;
    img.splash-img{
        position: relative;
        object-fit: cover;
        width: (100 + $shift-amount) * 1% !important;
        max-width: (100 + $shift-amount) * 1% !important;
        height: 100%;
        max-height: 100% !important;
        &.animate-to-right{
            animation: shift-to-right forwards;
            right: $shift-amount * 1%;
        }
        &.animate-to-left{
            animation: shift-to-left forwards;
        }
    }
    .hero-title{
        color: white;
        font-size: 1.5em;
        text-shadow: #000 0px 0px 3px;
        position: absolute;
        bottom: 15px;
        left:50%;
        transform: translate(-50%, 0%);
    }
}

</style>