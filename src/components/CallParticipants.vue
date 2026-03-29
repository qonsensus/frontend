<template>
  <template v-if="!mediasoup.isConnected.value">
    <div class="h-full flex items-center justify-center">
      <p class="text-gray-500">Connecting to the call...</p>
    </div>
  </template>
  <template v-else>
    <div class="h-full flex flex-wrap justify-center items-center gap-4">
      <CallParticipantCard
        v-for="participant in peers"
        :key="participant.socketId"
        :peer="participant"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { mediasoupKey, type RemotePeer } from '@/composables/services/useMediasoupSocket.ts'
import CallParticipantCard from '@/components/CallParticipantCard.vue'

const mediasoup = inject(mediasoupKey)!

const localPeer = computed<RemotePeer | null>(() => {
  const socketId = mediasoup.localSocketId.value
  const audioStream = mediasoup.localAudioStream.value
  const videoStream = mediasoup.localVideoStream.value || undefined
  const screenStream = mediasoup.localScreenStream.value || undefined
  if (!socketId || !audioStream) return null

  const stream = new MediaStream()
  if (videoStream) {
    videoStream.getVideoTracks().forEach((t) => stream.addTrack(t))
  }

  const result: RemotePeer = {
    socketId: `${socketId} (you)`,
    audioStream,
    videoStream,
    screenStream,
  }

  console.info(localPeer.value)

  return result
})

const peers = computed<RemotePeer[]>(() => {
  const remote = Array.from(mediasoup.remotePeers.value.values()).map((p) => ({ ...p }))
  return localPeer.value ? [localPeer.value, ...remote] : remote
})
</script>

<style scoped></style>
