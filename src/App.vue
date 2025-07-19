<script setup>
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

onMounted(() => {
  let testNum = null
  throw new Error('js错误')
  testNum.forEach(element => {
    console.log(element);
  });
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
  </header>
  <RouterView />
</template>

<style scoped>

</style>
