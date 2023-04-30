<script setup lang="ts">
import { Ref, inject } from 'vue'
import axios from 'axios'
import getPosURL from '../utils/getURL'
import { wsURL } from '../utils/useEnv'

const imgSrc = inject<Ref<string>>('imgSrc')!
const pos = inject<Ref<string[]>>('pos')!
const fall = inject<Ref<boolean>>('fall')!
const client = mqtt.connect(wsURL)
client.on('connect', async () => {
  client.subscribe(['GPS'])
  const { data } = await axios.get(getPosURL('116.481485,39.990464'), {
    responseType: 'blob',
  })
  imgSrc.value = window.URL.createObjectURL(data)
})
client.on('message', async (topic: any, message: any) => {
  if (topic === 'GPS') {
    const { pos: position, DieDao } = JSON.parse(message.toString())
    pos.value = position.split(',')
    fall.value = DieDao
    const { data } = await axios.get(getPosURL(position), {
      responseType: 'blob',
    })
    imgSrc.value = window.URL.createObjectURL(data)
  }
})
</script>

<template>
  <el-row>
    <el-col :span="12">
      <el-statistic :value-style="`${fall ? 'color: red'  : ''}`" title="老人是否跌倒" :value="fall" />
    </el-col>
    <el-col :span="12">
      <el-statistic :value="(+pos[0]).toFixed(2)">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            经/纬度
            <el-icon style="margin-left: 4px" :size="12">
              <Male />
            </el-icon>
          </div>
        </template>
        <template #suffix>/{{(+pos[1]).toFixed(2)}}</template>
      </el-statistic>
    </el-col>
  </el-row>
  <img style="margin-top: 7.5px;" :src="imgSrc" alt="图片" />
</template>

<style scoped>
.el-text {
  margin: 20px 0;
}
img {
  width: 100%;
}
</style>
