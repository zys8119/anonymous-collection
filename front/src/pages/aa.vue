<template>
    <div class='aa'>
        asdas
        asdasdasdas
    </div>
</template>
<script setup lang="ts">
definePage({
    meta: {
        title: 'aa页面',
    },
})
const route = useRoute()
console.log(route)
</script>
<style scoped lang="less">
.aa {}
</style>