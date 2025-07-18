<script setup>
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

const jsErr = () => {
  throw new Error('js错误')
}

onMounted(() => {
  let testNum = null
  if(testNum.length > 1){
    console.log('报错了')
  }
})

</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">
          home
        </RouterLink>
        <RouterLink to="/about">
          about
        </RouterLink>
      </nav>
    </div>
    <!-- <button @click="jsErr">模拟js错误</button> -->
  </header>
  <RouterView />
</template>

<style scoped>

</style>
