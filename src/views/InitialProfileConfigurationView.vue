<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <InitialConfigurationForm :profile />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { components } from '@/types/dtos.ts'
import { useUserService } from '@/composables/services/useUserService.ts'
import InitialConfigurationForm from '@/components/profile/InitialConfigurationForm.vue'

const profile = ref<components['schemas']['Profile'] | null>(null)

onMounted(async () => (profile.value = await useUserService().getMyProfile()))
</script>

<style scoped></style>
