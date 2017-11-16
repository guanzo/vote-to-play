<template>

<div class="voter-header">
    <div v-if="!hasSelectedCandidate" class="default-vote flex-center">
        <div class="image-wrapper flex-center">
            <div>?</div>
        </div>
        <div>Your Vote</div>
    </div>
    <div v-else class="flex-center">
        <div class="image-wrapper flex-center">
            <img :src="selectedCandidate.img" :alt="selectedCandidate.img">
        </div>
        <div>{{ selectedCandidate.name }}</div>
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
    position: relative;
    display: flex;
    padding: 10px 0px;
    justify-content: center;
    font-size: 1.5em;
    color: white;
    text-shadow: #000 0px 0px 2px;
    transition: .5s;
    .default-vote {
        .image-wrapper{
            background: #333;
        }
    }
    .image-wrapper{
        margin-right: 10px;
    }
}

</style>