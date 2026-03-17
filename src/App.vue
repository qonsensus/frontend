<template>
  <div class="w-screen h-screen flex">
    <RouterView name="leftSidebar" />
    <RouterView class="w-full" />
  </div>
  <Toaster position="top-right" />
</template>

<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
</script>

<style scoped></style>
