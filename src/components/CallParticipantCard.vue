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
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import type { RemotePeer } from '@/composables/services/useMediasoupSocket.ts'
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

// computed ref so the analyser reconnects automatically if the stream changes
const stream = computed(() => props.peer.stream)
const { isTalking } = useAudioLevel(stream, 0.01, 0.99)

const hasVideo = computed(
  () => !!props.peer.videoProducerId && props.peer.stream.getVideoTracks().length > 0,
)
const videoEl = ref<HTMLVideoElement | null>(null)

watch(
  [hasVideo, videoEl],
  ([video, el]) => {
    if (video && el) {
      el.srcObject = props.peer.stream
    } else if (!video && el) {
      el.srcObject = null
    }
  },
  { immediate: true, flush: 'post' },
)

onBeforeUnmount(() => {
  if (videoEl.value) {
    videoEl.value.srcObject = null
  }
})
</script>

<style scoped></style>
