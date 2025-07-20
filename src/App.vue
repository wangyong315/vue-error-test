<script setup>
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

// onMounted(() => {
//   let testNum = null
//   if(testNum.lenggth > 1){
//     console.log('报错了')
//   }
// })

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
        <RouterLink to="/trigger">
          trigger
        </RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>

</style>
