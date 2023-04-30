<script setup lang="ts">
import { Ref, inject, ref } from 'vue'
import axios from 'axios'
import formateDate from '../utils/formateDate'
import { apiURL } from '../utils/useEnv'
import { IRecords } from '../types'
import getPosURL from '../utils/getURL'

const records = ref<IRecords[]>([])
const { data: result } = await axios.get(apiURL)
const pos = inject<Ref<string[]>>('pos')!
const imgSrc = inject<Ref<string>>('imgSrc')!
const fall = inject<Ref<boolean>>('fall')!

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

async function checkPos(s: any) {
  const { pos: position, fall: fallen } = s.row
  const { data } = await axios.get(getPosURL(position), {
    responseType: 'blob'
  })
  imgSrc.value = window.URL.createObjectURL(data)
  pos.value = position.split(',')
  fall.value = fallen
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
    <el-table-column label="是否跌倒">
      <template #default="scope">
        <el-button type="primary" @click="checkPos(scope)">查询</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.el-table {
  margin-top: 25px;
}
</style>
