<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-3">
    <h1 class="text-2xl">Home</h1>
    <p>Welcome to the home page!</p>
    <Button @click="logout"> Logout </Button>
    <pre>{{ profile }}</pre>
  </div>
</template>

<script setup lang="ts">
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import router from '@/router'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import type { components } from '@/types/dtos.ts'

const profile = ref<components['schemas']['Profile']>(history.state.profile)

function logout() {
  useAuthToken().clearToken()
  router.push('/login')
}
</script>

<style scoped></style>
