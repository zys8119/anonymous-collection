<template>
    <div class='tirilaser abs-f abs-content'>
        <div class="abs-content flex-center">
            <div class="flex-1 h-100% bg-#e8e8e8!  abs-r z-1 of-hidden" ref="el"></div>
            <transition name="fade">
                <div class="w-300px h-100% flex-center items-start flex-col abs-r z-2" v-if="show">
                    <div class="w-100% flex-center p-15px flex-col">
                        <div
                            class="p-10px b-rd-5px b-solid b-#999 b-1px  abs-r of-hidden cursor-pointer &-hover-self-div:op-100">
                            <img class="w-120px" :src="qrcode" alt=""></img>
                            <div
                                class="bg-#000  bg-op-50 abs-content flex-center op-0 transition-all flex-ccenter flex-col gap-10px">
                                <n-button type="primary" @click="copyLink">复制链接</n-button>
                                <n-button type="warning" @click="exportData">导出数据</n-button>
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
        <n-modal v-model:show="showLogin" title="管理员操作" width="300px" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <div class="z-100 bg-#fff b-rd-5px  of-hidden p-15px">
                <n-form>
                    <n-form-item label="用户名">
                        <n-input name="username" @keyup.enter="login" v-model:value="username"
                            placeholder="请输入用户名"></n-input>
                    </n-form-item>
                    <n-form-item label="密码">
                        <n-input name="password" @keyup.enter="login" v-model:value="password"
                            placeholder="请输入密码"></n-input>
                    </n-form-item>
                    <n-button name="submit" type="primary" @click="login">确定</n-button>
                </n-form>
            </div>
        </n-modal>
    </div>
</template>
<script setup lang="ts" title="欣睿激光-吐槽">
import WordCloud, { ListEntry } from "wordcloud"
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { createDiscreteApi } from 'naive-ui'
import { differenceBy } from 'lodash'
const { message } = createDiscreteApi(['message'])
const username = ref('')
const password = ref('')
const show = ref(true)
const showLogin = ref(true)
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
    await fetch(import.meta.env.VITE_API_URL + "/tirilaser/list", {
        headers: {
            'Authorization': `Basic ${btoa(`${username.value}:${password.value}`)}`
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.code === 403) {
                message.error('未授权或账号密码错误!')
                showLogin.value = true
                username.value = ''
                password.value = ''
                return
            }
            const diffData = differenceBy(data.data.list, list.value, 'id') as any
            list.value = list.value.concat(diffData)
            setTimeout(async () => {
                await getList()
            }, 1000);
        }).catch(err => {
            console.log(err)
        })
}
const exportData = async () => {
    await fetch(import.meta.env.VITE_API_URL + "/tirilaser/export", {
        headers: {
            'Authorization': `Basic ${btoa(`${username.value}:${password.value}`)}`
        }
    })
        .then(res => res.arrayBuffer())
        .then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.xlsx';
            a.click();
            URL.revokeObjectURL(url);
        })
    await message.success('导出成功!')
}
const login = async () => {
    if (!username.value || !password.value) return message.error('请输入用户名和密码!')
    showLogin.value = false
    await getList()
}
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