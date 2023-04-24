<script lang="ts" setup>
import MainContent from './MainContent.vue'

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>护老助手</el-header>
      <el-main>
        <MainContent />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.el-header {
  height: 80px;
  line-height: 80px;
  text-align: center;
  background-color: lightskyblue;
  font-size: 35px;
  color: white;
  font-weight: bold;
}
.el-container {
  height: 100vh;
}
</style>