<template>
  <div class="w-full border-t p-4 flex items-center justify-center gap-2">
    <Button
      size="icon-lg"
      :variant="callStore.isVoiceOn ? 'outline' : 'destructive'"
      @click="callStore.toggleVoice()"
    >
      <MicOff v-if="!callStore.isVoiceOn" />
      <Mic v-else />
    </Button>
    <Button size="icon-lg" variant="outline">
      <Headset />
    </Button>
    <Button
      size="icon-lg"
      :variant="callStore.isVideoOn ? 'default' : 'outline'"
      @click="callStore.toggleVideo()"
    >
      <VideoOff v-if="callStore.isVideoOn" />
      <Video v-else />
    </Button>
    <Button
      size="icon-lg"
      :variant="callStore.isScreenShareOn ? 'default' : 'outline'"
      @click="callStore.toggleScreenShare()"
    >
      <ScreenShareOff v-if="callStore.isScreenShareOn" />
      <ScreenShare v-else />
    </Button>
    <Button size="icon-lg" variant="destructive" @click="disconnect()">
      <Phone />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Mic,
  MicOff,
  Headset,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  Phone,
} from 'lucide-vue-next'
import { mediasoupKey } from '@/composables/services/useMediasoupSocket.ts'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useCallStore } from '@/stores/call.ts'

const mediasoup = inject(mediasoupKey)
const callStore = useCallStore()
const route = useRoute()

function disconnect() {
  mediasoup?.disconnect()
  router.push({ name: 'Chat', params: { conversationId: route.params.conversationId } })
}
</script>

<style scoped></style>
