<template>

<div class="voter-header is-size-5">
    <div v-if="!hasSelectedCandidate" class="default-vote flex-center">
        <div class="image-wrapper flex-center">
            <div><span class="icon-help"></span></div>
        </div>
        <div>Your Vote</div>
    </div>
    <div v-else class="flex-center">
        <div class="image-wrapper flex-center">
            <img :src="selectedCandidate.img" :alt="selectedCandidate.img">
        </div>
        <div class="ellipsis">{{ selectedCandidate.name }}</div>
    </div>
</div>

</template>

<script>

export default {
    name:'voter-header',
    props:['hasSelectedCandidate','selectedCandidate']
}

</script>

<style lang="scss" scoped>


.voter-header {
    grid-area: header;
    position: relative;
    display: flex;
    justify-content: center;
    color: white;
    text-shadow: #000 0px 0px 2px;
    transition: .5s;
    > * {
        max-width: 100%;
    }
    .default-vote {
        .image-wrapper{
            background: #333;
        }
    }
    .ellipsis{
        flex: 1;
    }
    .image-wrapper{
        margin-right: 10px;
    }
}

</style>