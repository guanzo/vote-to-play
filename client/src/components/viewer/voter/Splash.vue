<template>
    <transition name="fade" @after-leave="afterSplashLeave">
        <div v-if="splashTransition.isActive && loadedSplashImg" class="splash-img-container">
            <img class="splash-img" 
                :class="splashTransition.class" 
                :style="splashTransition.style" 
                :src="loadedSplashImg"
            >    
        </div>
    </transition>
</template>

<script>

export default {
    name:'splash',
    props:['splashTransition','selectedVote'],
    data(){
        return {
            loadedSplashImg: null
        }
    },
    watch:{
        'splashTransition.isActive'(isActive){
            if(!isActive){
                this.loadedSplashImg = null
                return;
            }

            var img = new Image();
            img.onload = ()=>{
                this.loadedSplashImg = img.src
            };         
            img.src = this.selectedVote.imgSplash;
        }
    },
    methods:{
        afterSplashLeave(){
            this.splashTransition.hideVoteUI = false;
        },
    },
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
}

</style>