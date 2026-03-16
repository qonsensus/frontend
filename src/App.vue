<template>
  <div class="w-screen h-screen flex">
    <RouterView name="leftSidebar" />
    <RouterView name="leftSecondarySidebar" />
    <RouterView class="w-full" />
  </div>
  <Toaster />
</template>

<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import { onMounted } from 'vue'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import { useNotificationSocket } from '@/composables/services/useNotificationSocket.ts'

onMounted(() => {
  const { isAuthenticated } = useAuthToken()
  if (!isAuthenticated()) return
  useNotificationSocket()
})
</script>

<style scoped></style>
