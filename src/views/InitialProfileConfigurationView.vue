<template>
  <pre>{{ profile }}</pre>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { components } from '@/types/dtos.ts'
import { useUserService } from '@/composables/services/useUserService.ts'

const profile = ref<components['schemas']['Profile'] | null>(null)

onMounted(async () => (profile.value = await useUserService().getMyProfile()))
</script>

<style scoped></style>
