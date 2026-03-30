<template>
  <template v-if="callStore.callState === 'none'">
    <div class="h-full flex items-center justify-center">
      <p class="text-gray-500">Connecting to the call...</p>
    </div>
  </template>
  <template v-else>
    <div class="h-full flex flex-wrap justify-center items-center gap-4">
      <CallParticipantCard
        v-for="peer in callStore.peers.values()"
        :key="peer.socketId"
        :peer="peer"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import CallParticipantCard from '@/components/CallParticipantCard.vue'
import { useCallStore } from '@/stores/call.ts'

const callStore = useCallStore()
</script>

<style scoped></style>
