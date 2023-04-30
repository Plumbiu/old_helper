<script setup lang="ts">
import Mqtt from './Mqtt.vue'
import API from './API.vue'
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
