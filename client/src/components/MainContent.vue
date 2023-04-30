<script setup lang="ts">
import Mqtt from './Mqtt.vue'
import API from './API.vue'
import axios from 'axios'
import { Ref, inject } from 'vue'
import { wsURL } from '../utils/useEnv'
import getPosURL from '../utils/getURL'
const imgSrc = inject<Ref<string>>('imgSrc')!
const pos = inject<Ref<string[]>>('pos')!
const fall = inject<Ref<boolean>>('fall')!
const client = mqtt.connect(wsURL)

client.on('connect', () => {
  client.subscribe(['GPS'])
})

client.on('message', async (topic: any, message: any) => {
  if (topic === 'GPS') {
    const record = JSON.parse(message.toString())
    const { data } = await axios.get(getPosURL(record.pos), {
      responseType: 'blob',
    })
    pos.value = record.pos.split(',')
    fall.value = record.DieDao
    imgSrc.value = window.URL.createObjectURL(data)
  }
})
</script>

<template>
  <div class="container">
    <div class="table_container">
      <API />
    </div>
    <div>
      <Mqtt />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
}
.table_container {
  width: 50%;
}
</style>
