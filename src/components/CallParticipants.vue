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
      <audio
        v-for="[socketId, peer] in mediasoup.remotePeers.value"
        :key="socketId"
        :ref="(el) => attachStream(el as HTMLAudioElement, peer.stream)"
        autoplay
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { mediasoupKey, type RemotePeer } from '@/composables/services/useMediasoupSocket.ts'
import CallParticipantCard from '@/components/CallParticipantCard.vue'

const mediasoup = inject(mediasoupKey)!

const expandedProducerId = ref<string | null>(null)

function toggleExpand(producerId: string, val: boolean) {
  expandedProducerId.value = val ? producerId : null
}

const localPeer = computed<RemotePeer | null>(() => {
  const socketId = mediasoup.localSocketId.value
  const audioStream = mediasoup.localAudioStream.value
  const videoStream = mediasoup.localVideoStream.value
  if (!socketId || !audioStream) return null

  const stream = new MediaStream()
  if (videoStream) {
    videoStream.getVideoTracks().forEach((t) => stream.addTrack(t))
  }

  return {
    socketId: `${socketId} (you)`,
    stream,
    videoProducerId: videoStream ? 'local-video' : undefined,
  }
})

const peers = computed<RemotePeer[]>(() => {
  const remote = Array.from(mediasoup.remotePeers.value.values()).map((p) => ({ ...p }))
  return localPeer.value ? [localPeer.value, ...remote] : remote
})

function attachStream(el: HTMLAudioElement | null, stream: MediaStream) {
  if (el && el.srcObject !== stream) {
    el.srcObject = stream
  }
}
</script>

<style scoped></style>
