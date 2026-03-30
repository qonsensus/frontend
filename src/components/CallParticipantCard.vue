<template>
  <div
    class="aspect-video rounded-lg flex flex-col transition-all duration-75 overflow-hidden bg-black relative group h-64"
    :class="[isTalking ? 'border-2 border-green-500' : 'border']"
  >
    <video
      v-if="props.peer.videoStream"
      ref="videoEl"
      autoplay
      playsinline
      class="w-full h-full object-contain"
    />
    <div v-else class="flex-1 flex items-center justify-center">
      <p class="text-sm text-white/60 select-none">{{ peer.socketId ?? 'Participant' }}</p>
    </div>
    <audio
      :ref="(el) => attachStream(el as HTMLAudioElement, peer.audioStream!)"
      autoplay
      :muted="isLocal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { type Peer } from '@/composables/services/useMediasoupSocket.ts'
import { useAudioLevel } from '@/composables/useAudioLevel.ts'

const props = defineProps<{
  peer: Peer
}>()

defineEmits<{
  (e: 'update:expanded', value: boolean): void
}>()

const videoEl = ref<HTMLVideoElement | null>(null)

const { isTalking, start } = useAudioLevel(0.005, 0.95)

const isLocal = computed(() => props.peer.isLocal)

watch(
  () => props.peer.audioStream,
  (stream) => {
    if (stream) {
      start(stream)
    }
  },
  { immediate: true },
)

watch(
  () => props.peer.videoStream,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        attachStream(videoEl.value, newVal)
      })
    }
  },
)

function attachStream(el: HTMLAudioElement | null, stream: MediaStream) {
  if (el && el.srcObject !== stream) {
    el.srcObject = stream
  }
}
</script>

<style scoped></style>
