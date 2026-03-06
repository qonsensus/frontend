<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-3">
    <h1 class="text-2xl">Home</h1>
    <p>Welcome to the home page!</p>
    <Button @click="logout"> Logout </Button>
  </div>
</template>

<script setup lang="ts">
import { useAuthToken } from '@/composables/useAuthToken.ts'
import router from '@/router'
import { Button } from '@/components/ui/button'

function logout() {
  useAuthToken().clearToken()
  router.push('/login')
}
</script>

<style scoped></style>
