<template>
  <div class="min-h-screen">
    <NavBar />
    <main class="container mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
</script> 
