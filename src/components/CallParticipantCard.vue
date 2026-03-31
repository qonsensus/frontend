<template>
  <div
    class="rounded-lg flex flex-col transition-all duration-75 overflow-hidden bg-black relative group"
    :class="[isTalking ? 'border border-green-500' : 'border']"
  >
    <template v-if="props.peer.videoStream">
      <div class="aspect-video" :class="[`${props.small ? 'h-32' : 'h-64'}`]">
        <video ref="videoEl" autoplay playsinline class="w-full h-full object-contain" />
      </div>
      <div class="px-2 py-1 absolute top-0 left-0 w-full bg-black/50 backdrop-blur-sm">
        <p class="text-sm text-white/60 select-none">{{ peer.socketId ?? 'Participant' }}</p>
      </div>
    </template>
    <div
      v-else
      class="flex-1 flex items-center justify-center aspect-video"
      :class="[`${props.small ? 'h-32' : 'h-64'}`]"
    >
      <p class="text-sm text-white/60 select-none">{{ peer.socketId ?? 'Participant' }}</p>
    </div>
    <Button
      v-if="hasScreenShare"
      class="absolute bottom-2 right-2 z-10 transition-opacity duration-150"
      @click.stop="selectScreenShare()"
      :variant="isCurrentScreenShare ? 'default' : 'secondary'"
      size="icon-sm"
    >
      <ScreenShare />
    </Button>
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
import { Button } from '@/components/ui/button'
import { ScreenShare } from 'lucide-vue-next'

const props = defineProps<{
  peer: Peer
  small: boolean
  currentScreenSharePeer: string | null
}>()

const emit = defineEmits<{
  (e: 'selectScreenShare', value: string): void
}>()

const videoEl = ref<HTMLVideoElement | null>(null)

const { isTalking, start } = useAudioLevel(0.005, 0.95)

const isLocal = computed(() => props.peer.isLocal)
const hasScreenShare = computed(() => !!props.peer.screenStream)
const isCurrentScreenShare = computed(() => props.currentScreenSharePeer === props.peer.socketId)

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

function selectScreenShare() {
  if (hasScreenShare.value) {
    emit('selectScreenShare', props.peer.socketId)
  }
}
</script>

<style scoped></style>
