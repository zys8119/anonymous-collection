<template>
    <div class='tirilaser abs-f abs-content'>
        <div class="abs-content flex-center">
            <div class="flex-1 h-100% bg-#e8e8e8!  abs-r z-1 of-hidden" ref="el"></div>
            <transition name="fade">
                <div class="w-300px h-100% flex-center items-start flex-col abs-r z-2" v-if="show">
                    <div class="w-100% flex-center p-15px flex-col">
                        <div
                            class="p-10px b-rd-5px b-solid b-#999 b-1px  abs-r of-hidden cursor-pointer !&-hover-self-div:op-100">
                            <img class="w-120px" :src="qrcode" alt=""></img>
                            <div
                                class="bg-#000  bg-op-50 abs-content flex-center op-0 transition-all flex-ccenter flex-col gap-10px">
                                <n-button type="primary" @click="copyLink">复制链接</n-button>
                                <n-button type="warning">导出数据</n-button>
                            </div>
                        </div>
                        <div class="text-#999 text-12px mt-10px">扫码吐槽</div>
                    </div>
                    <div class="flex-1 w-100% of-x-hidden" ref="scroll">
                        <div class="p-10px b-#e5e5e5 b-t-1px last:b-b-1px" v-for="(item, index) in scrollList"
                            :key="index">
                            {{ item.content }}({{ item.name }})
                        </div>
                        <div v-if="scrollList.length === 0" class="text-center text-#999 text-12px">暂无数据!</div>
                    </div>
                </div>
            </transition>
        </div>
        <img class="abs left-10px top-10px  w-120px cursor-pointer z-100" src="/images/1.png" @click="show = !show"
            alt="">
    </div>
</template>
<script setup lang="ts" title="欣睿激光-吐槽">
import WordCloud, { ListEntry } from "wordcloud"
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { createDiscreteApi } from 'naive-ui'
import { differenceBy } from 'lodash'
const { message } = createDiscreteApi(['message'])
const show = ref(false)
const loaction = useBrowserLocation()
const qrText = computed(() => `${loaction.value.origin}/#/tirilaser-submit`)
const qrcode = useQRCode(qrText.value)
const { copy } = useClipboard()
const copyLink = async () => {
    await copy(qrText.value)
    message.success('复制成功!')
}
const el = ref()
const wordcloud = shallowRef()
const list = ref<ListEntry[]>([
])
const scrollList = computed(() => JSON.parse(JSON.stringify(list.value)).reverse())
const currentList = computed(() => JSON.parse(JSON.stringify(list.value)).map(e => {
    return [e.content, Math.random() * 30]
}))
const init = () => {
    if (!el.value) return setTimeout(init)
    wordcloud.value?.stop?.()
    wordcloud.value = WordCloud(el.value, {
        list: currentList.value,
        shape: 'square',
        gridSize: 18,
        weightFactor: 3,
    })
}
const stop = watch([list, show], init, { immediate: true, deep: true })
const getList = async () => {
    await fetch("/api/tirilaser/list")
        .then(res => res.json())
        .then(data => {
            const diffData = differenceBy(data.data.list, list.value, 'id') as any
            if (list.value.length > 0 && diffData.length > 0) {
                speechSynthesis.speak(new SpeechSynthesisUtterance(diffData.map(e => e.content).join(',')))
            }
            list.value = list.value.concat(diffData)

            // if(diffData.l)
            // speechSynthesis.speak(new SpeechSynthesisUtterance(diffData.map(e => e.content).join(',')))
        })
        .finally(() => {
            setTimeout(async () => {
                await getList()
            }, 1000);
        })
}
onMounted(async () => {
    await getList()
})
onBeforeUnmount(() => {
    wordcloud.value?.stop?.()
    stop()
})
</script>
<style scoped lang="less">
.tirilaser {

    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
        transform: translateX(100px);
        width: 0;
    }
}
</style>