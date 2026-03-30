<template>
  <template v-if="callStore.callState === 'none'">
    <div class="h-full flex items-center justify-center">
      <p class="text-gray-500">Connecting to the call...</p>
    </div>
  </template>
  <template v-else>
    <div class="flex-1 min-h-0 flex flex-col items-center justify-center">
      <div class="flex items-center justify-center flex-wrap gap-4 p-4">
        <CallParticipantCard
          :small
          v-for="peer in peerList"
          :key="peer.socketId"
          :peer="peer"
          :current-screen-share-peer
          @select-screen-share="(value) => (currentScreenSharePeer = value)"
        />
      </div>
      <template v-if="small">
        <div class="border-t flex-1 min-h-0 w-full p-4">
          <video
            class="w-full h-full object-contain"
            autoplay
            playsinline
            :ref="
              (el) =>
                attachStream(
                  el as HTMLVideoElement,
                  peersWithScreenShare.find((p) => p.socketId === currentScreenSharePeer)
                    ?.screenStream!,
                )
            "
          />
        </div>
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
import CallParticipantCard from '@/components/CallParticipantCard.vue'
import { useCallStore } from '@/stores/call.ts'
import { computed, ref, watch } from 'vue'

const currentScreenSharePeer = ref<string | null>(null)

const callStore = useCallStore()

const peerList = computed(() => Array.from(callStore.peers.values()))
const peersWithScreenShare = computed(() => peerList.value.filter((peer) => peer.screenStream))
const small = computed(() => peersWithScreenShare.value.length > 0)

watch(peersWithScreenShare, (newVal, oldVal) => {
  if (newVal.length > 0 && oldVal.length === 0) {
    currentScreenSharePeer.value = newVal[0]!.socketId
  } else if (newVal.length === 1) {
    currentScreenSharePeer.value = newVal[0]!.socketId
  }
})

function attachStream(el: HTMLVideoElement | HTMLAudioElement | null, stream: MediaStream) {
  if (el) {
    el.srcObject = stream
  }
}
</script>

<style scoped></style>
