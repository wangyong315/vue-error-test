<script setup>
import { RouterLink, RouterView } from "vue-router";

const jsErr = () => {
  throw new Error('js错误')
}
</script>

<template>
  <div>
    <button @click="jsErr">模拟js错误</button>
  </div>
  <RouterView />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
