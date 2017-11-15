<template>

<div class="your-vote">
    <div v-if="!hasSelectedVote" class="default-vote flex-center">
        <div class="image-wrapper flex-center">
            <span>?</span>
        </div>
        <span>Your Vote</span>
    </div>
    <div v-else class="flex-center">
        <div class="image-wrapper flex-center">
            <img :src="selectedVote.img" :alt="selectedVote.img">
        </div>
        <span>{{ selectedVote.name }}</span>
    </div>
</div>

</template>

<script>

export default {
    name:'your-vote',
    props:['hasSelectedVote','selectedVote']
}

</script>

<style lang="scss" scoped>


.your-vote {
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