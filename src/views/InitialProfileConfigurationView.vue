<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <InitialConfigurationForm :profile />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { components } from '@/types/dtos.ts'
import InitialConfigurationForm from '@/components/profile/InitialConfigurationForm.vue'
import { useProfileService } from '@/composables/services/useProfileService.ts'

const profile = ref<components['schemas']['Profile'] | null>(null)

onMounted(async () => (profile.value = await useProfileService().getMyProfile()))
</script>

<style scoped></style>
