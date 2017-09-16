<template>

<div v-if="!userSubmittedVote" class="voter-section overlay-background">
    <slot name="filter-section"></slot>
    <slot name="image-grid"></slot>
    <slot name="submit-vote-footer"></slot>
</div>

</template>

<script>

export default {
    name: 'voter-section',
    props:['userSubmittedVote']
}

</script>

<style lang="scss">

.voter-section{

    .image-wrapper{
        position: relative;
        transition: .3s all;
        margin: 3px;
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
            max-height: 100px;
            width: auto;
            display: block;
            transition: .3s all;
            &.filtered-out {
                filter: brightness(20%);
            }
        }
    }
}

</style>