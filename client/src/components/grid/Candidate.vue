<template>
    <div class="candidate"
        :key="candidate.name"
    >
        <div class="image-wrapper">
            <img :src="candidate.img" :alt="candidate.name">
        </div>
        <div v-if="showName" class="candidate-name">
            <div class="ellipsis">{{ candidate.name }}</div>
        </div>
    </div>
</template>

<script>

export default {
    name:'candidate',
    props:['candidate','showName']
}

</script>

<style lang="scss" scoped>

.candidate {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2px;
    transition: .3s;
    //transition: 10s;
    cursor: pointer;
    .image-wrapper{
        position: relative;
    }
    .candidate-name {
        max-width: 100%;
        padding: 0px 2px;
    }
    &:hover:after {
        opacity: 1;
    }
    &:after{
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        opacity: 0;
        transition: opacity 0.3s;
    }
}
</style>