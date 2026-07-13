<template>
  <div class="h-full flex flex-col">
    <CallParticipants class="flex-1 min-h-0" />
    <CallControls />
  </div>
</template>

<script setup lang="ts">
import CallParticipants from '@/components/CallParticipants.vue'
import CallControls from '@/components/CallControls.vue'
import { useRoute } from 'vue-router'
import { onMounted, provide } from 'vue'
import { useCallService, callKey } from '@/composables/services/useCallService.ts'

const route = useRoute()
const callId = route.params.conversationId as string
const callService = useCallService(callId)

provide(callKey, callService)

onMounted(async () => {
  await callService.connect()
})
</script>

<style scoped></style>
