<script setup>
import { RouterLink, RouterView } from "vue-router";

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
