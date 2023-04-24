<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import getPosURL from '../utils/getURL'
import { wsURL } from '../utils/useEnv'

const imgSrc = ref('')
const pos = ref('116.481485 39.990464')
const { data } = await axios.get(getPosURL('116.481485,39.990464'), {
  responseType: 'blob',
})
imgSrc.value = window.URL.createObjectURL(data)

const client = mqtt.connect(wsURL)
client.on('connect', () => {
  client.subscribe(['GPS_Status', 'DieDao', 'GPS_Position'])
})
client.on('message', async (topic: any, message: any) => {
  if (topic === 'GPS_Status') {
    console.log(topic, message.toString())
  }
  if (topic === 'DieDao') {
  }
  if (topic === 'GPS_Position') {
    pos.value = message.toString().split(',').join(' ')
    const { data } = await axios.get(getPosURL(message.toString()), {
      responseType: 'blob',
    })
    imgSrc.value = window.URL.createObjectURL(data)
  }
})
</script>

<template>
  <div>
    <el-text>{{ pos }}</el-text>
  </div>
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
