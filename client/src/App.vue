<script setup lang="ts">
import { provide, ref } from 'vue';
import Layout from './components/Layout.vue'
provide('pos', ref(['116.481485', '39.990464']))
provide('imgSrc', ref(''))
provide('fall', ref(false))

</script>

<template>
  <Suspense>
    <Layout />
  </Suspense>
</template>
