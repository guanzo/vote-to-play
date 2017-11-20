<template>
    
    <div class="whitelist-controls">
        <slot>
            <div></div><!-- spacing helper -->
        </slot>
        <div class="buttons is-centered">
            <button class="button is-danger is-outlined">Cancel</button>
            <button class="button is-success">Save</button>
        </div>
    </div>

</template>

<script>

export default {
    name:'whitelist-controls'
}

</script>

<style lang="scss" scoped>

.whitelist-controls{
    //display: flex;
    //justify-content: center;

    $save-color:  #43A047;
    .save{
        color: #eee;
        background: #43A047;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    }
    $cancel-color: #D50000;
    .cancel{
        color: $cancel-color;
        border: 2px solid $cancel-color;
        transition: 0.15s;
        &:hover{
            background: $cancel-color;
            color: #eee;
        }
    }
}

</style>