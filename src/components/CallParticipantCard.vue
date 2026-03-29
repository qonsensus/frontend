<template>
  <div
    class="aspect-video rounded-lg flex flex-col transition-all duration-75 overflow-hidden bg-black relative group"
    :class="[
      isTalking ? 'border-2 border-green-500' : 'border',
      expanded ? 'h-full w-full' : 'h-64',
    ]"
  >
    <video
      v-if="hasVideo"
      ref="videoEl"
      autoplay
      playsinline
      class="w-full h-full object-contain"
    />
    <div v-else class="flex-1 flex items-center justify-center">
      <p class="text-sm text-white/60 select-none">{{ label ?? peer.socketId ?? 'Participant' }}</p>
    </div>
    <audio
      :ref="(el) => attachStream(el as HTMLAudioElement, peer.audioStream!)"
      autoplay
      :muted="isLocal"
    />

    <!-- Expand / collapse button (only for expandable cards) -->
    <Button
      v-if="expandable"
      class="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
      :title="expanded ? 'Collapse' : 'Expand'"
      @click="$emit('update:expanded', !expanded)"
      size="icon"
    >
      <!-- Collapse icon -->
      <Minimize v-if="expanded" />
      <!-- Expand icon -->
      <Expand v-else />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import { mediasoupKey, type RemotePeer } from '@/composables/services/useMediasoupSocket.ts'
import { useAudioLevel } from '@/composables/useAudioLevel.ts'
import { Button } from '@/components/ui/button'
import { Expand, Minimize } from 'lucide-vue-next'

const props = defineProps<{
  peer: RemotePeer
  label?: string
  expandable?: boolean
  expanded?: boolean
}>()

defineEmits<{
  (e: 'update:expanded', value: boolean): void
}>()

const videoEl = ref<HTMLVideoElement | null>(null)

const { isTalking, start } = useAudioLevel(0.01, 0.9)

const mediasoup = inject(mediasoupKey)!

const hasVideo = computed(() => !!props.peer.videoProducerId)
const isLocal = computed(() => props.peer.socketId.endsWith('(you)'))
const videoStream = computed(() => props.peer.videoStream)

watch(
  () => props.peer.audioStream,
  (stream) => {
    if (stream && !isLocal.value) {
      start(stream)
    }
  },
  { immediate: true },
)

watch(hasVideo, (newVal) => {
  if (newVal && (videoStream.value || mediasoup.localVideoStream.value)) {
    nextTick(() => {
      console.log('isLocal: ', isLocal.value)
      if (isLocal.value) {
        console.log(mediasoup.localVideoStream.value!)
        attachStream(videoEl.value, mediasoup.localVideoStream.value!)
      } else {
        attachStream(videoEl.value, videoStream.value!)
      }
    })
  }
})

function attachStream(el: HTMLAudioElement | null, stream: MediaStream) {
  if (el && el.srcObject !== stream) {
    el.srcObject = stream
  }
}
</script>

<style scoped></style>
