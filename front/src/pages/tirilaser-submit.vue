<template>
    <div class='tirilaser-submit abs-content'>
        <black-hole-background class="bg-#000" :particleRGBColor="[0, 0, 0]"></black-hole-background>
        <div class="flex-center abs-content z-1000">
            <img class="abs left-10px top-10px  w-120px cursor-pointer z-100" src="/images/1.png" alt="">
            <div class="max-w-2xl max-w-90%">
                <Focus sentence="这里没有老板 没有领导 没有任何人 只有你自己" />
                <n-input class="w-full b-1px b-#fe2c2c text-#000!  text-30px" :rows="2" placeholder="您的吐槽"
                    v-model:value="content" @keyup.enter="submit" clearable></n-input>
                <n-button class="w-100% m-y-10px" type="primary" @click="submit">提交</n-button>
                <div class="text-#999 text-12px flex-center">匿名收集</div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts" title="欣睿激光-吐槽">
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(['message'])
const content = ref("")
const submit = async () => {
    if (!content.value) return message.error("请输入内容")
    await fetch(import.meta.env.VITE_API_URL + "/tirilaser/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: content.value
        })
    })
    content.value = ""
    await message.success("提交成功")
}
useDark()
</script>
<style scoped lang="less">
.tirilaser-submit {}
</style>