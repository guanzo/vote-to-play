<template>
    <transition name="fade-vertical">
        <div v-if="!userSubmittedVote" class="voter-section overlay-background">
            <div slot="filter-section" class="field is-horizontal">
                <div class="field-body">
                    <slot name="filters">
                    </slot>
                </div>
            </div>
            <div class="image-grid">
                <slot name="image-grid-contents">
                </slot>
            </div>
            <slot name="submit-vote-footer">
            </slot>
        </div>
    </transition>
</template>

<script>

export default {
    name: 'voter-section',
    computed:{
        userSubmittedVote(){
            return this.$store.getters.userSubmittedVote
        }
    }
}

</script>

<style lang="scss">

.voter-section{
    padding: 15px;
    max-height: 100%;
    display: flex;
    flex-direction: column;
     .image-grid{
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        
        .image-wrapper{
            position: relative;
            transition: .3s all;
            cursor: pointer;
            &:hover:before {
                box-shadow: 0px 0px 0px 3px #eee inset;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                content: "";
            }
            img {
                display: block;
                transition: .3s all;
                &.filtered-out {
                    filter: brightness(20%);
                }
            }
        }
    }
    button{
        float: right;
    }
    .filter-section {
        min-height: 40px;
        margin-bottom: 5px;
    }
    
}

</style>