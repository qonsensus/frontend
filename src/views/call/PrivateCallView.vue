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
import { useMediasoupSocket, mediasoupKey } from '@/composables/services/useMediasoupSocket.ts'

const route = useRoute()
const callId = route.params.conversationId as string
const mediasoup = useMediasoupSocket(callId)

provide(mediasoupKey, mediasoup)

onMounted(async () => {
  await mediasoup.connect()
})
</script>

<style scoped></style>
