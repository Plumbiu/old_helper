<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
interface IRecords {
  id: number
  createdAt: Date
  fall: boolean
  pos: string
}
const records = ref<IRecords[]>([])
const imgSrc = ref('')
const { data: result } = await axios.get('http://localhost:3000')
const pos = ref('116.481485,39.990464')

function getPosURL(pos: string) {
  return `https://restapi.amap.com/v3/staticmap?location=${pos}&zoom=10&size=750*300&markers=mid,,A:116.481485,39.990464&key=6fccbd888ac5f3c86e8393c8c7f10dc1`
}
const { data } = await axios.get(getPosURL('116.481485,39.990464'), {
  responseType: 'blob',
})
imgSrc.value = window.URL.createObjectURL(data)

records.value = result.data.map((item: IRecords) => {
  const date = new Date(item.createdAt)
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return {
    ...item,
    createdAt: `${y}-${m}-${d} ${hh}:${mm}:${ss}`,
  }
})
let cloneRecords = records.value

function filterFall(rule?: string) {
  if (rule === 'all') {
    records.value = cloneRecords
  } else if (rule === 'filter') {
    records.value = cloneRecords.filter(item => item.fall)
  }
}

const client = mqtt.connect('ws://127.0.0.1:8888')
client.on('connect', () => {
  console.log('connect!')
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
  <div class="container">
    <div class="table_container">
      <div>
        <el-button type="primary" @click="filterFall('filter')">过滤</el-button>
        <el-button @click="filterFall('all')">显示全部</el-button>
      </div>
      <el-table border stripe :data="records" max-height="500">
        <el-table-column prop="fall" label="是否跌倒" />
        <el-table-column prop="pos" label="位置" />
        <el-table-column prop="createdAt" label="日期" />
      </el-table>
    </div>
    <div class="img_container">
      <img :src="imgSrc" alt="图片" />
      {{ pos }}
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}
.table_container {
  width: 50%;
}
.el-table {
  margin-top: 25px;
}
.img_container img {
  width: 100%;
}
</style>
