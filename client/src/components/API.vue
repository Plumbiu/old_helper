<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import formateDate from '../utils/formateDate'
import { apiURL } from '../utils/useEnv'
import { IRecords } from '../types'

const records = ref<IRecords[]>([])
const { data: result } = await axios.get(apiURL)

records.value = result.data.map((item: IRecords) => {
  return {
    ...item,
    createdAt: formateDate(item.createdAt),
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
</script>

<template>
  <div>
    <el-button type="primary" @click="filterFall('filter')">过滤</el-button>
    <el-button @click="filterFall('all')">显示全部</el-button>
  </div>
  <el-table  border stripe :data="records" max-height="500">
    <el-table-column prop="fall" label="是否跌倒" />
    <el-table-column prop="pos" label="位置" />
    <el-table-column prop="createdAt" label="日期" />
  </el-table>
</template>

<style scoped>
.el-table {
  margin-top: 25px;
}
</style>
