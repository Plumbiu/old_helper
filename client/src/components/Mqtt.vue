<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import getPosURL from '../utils/getURL'
import { wsURL } from '../utils/useEnv'

const imgSrc = ref('')
const pos = ref(['116.481485', '39.990464'])
const { data } = await axios.get(getPosURL('116.481485,39.990464'), {
  responseType: 'blob',
})
imgSrc.value = window.URL.createObjectURL(data)

const client = mqtt.connect(wsURL)
client.on('connect', () => {
  client.subscribe(['GPS'])
})
client.on('message', async (topic: any, message: any) => {
  if (topic === 'GPS') {
    const payload = JSON.parse(message.toString())
    pos.value = payload.pos.split(',')
    const { data } = await axios.get(getPosURL(payload.pos), {
      responseType: 'blob',
    })
    imgSrc.value = window.URL.createObjectURL(data)
  }
})
</script>

<template>
  <el-statistic :value="pos[0]">
    <template #title>
      <div style="display: inline-flex; align-items: center">经纬度</div>
    </template>
    <template #suffix>/ {{ pos[1] }}</template>
  </el-statistic>
  <img :src="imgSrc" alt="图片" />
</template>

<style scoped>
.el-text {
  margin: 20px 0;
}
img {
  width: 100%;
}
</style>
