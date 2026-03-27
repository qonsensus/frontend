<template>
  <div class="w-full border-t p-4 flex items-center justify-center gap-2">
    <Button
      size="icon-lg"
      :variant="mediasoup.isMuted.value ? 'destructive' : 'outline'"
      @click="mediasoup.toggleMute()"
    >
      <MicOff v-if="mediasoup.isMuted.value" />
      <Mic v-else />
    </Button>
    <Button size="icon-lg" variant="outline">
      <Headset />
    </Button>
    <Button
      size="icon-lg"
      :variant="mediasoup.isVideoEnabled.value ? 'default' : 'outline'"
      @click="mediasoup.toggleVideo()"
    >
      <VideoOff v-if="!mediasoup.isVideoEnabled.value" />
      <Video v-else />
    </Button>
    <Button
      size="icon-lg"
      :variant="mediasoup.isScreenSharing.value ? 'default' : 'outline'"
      @click="mediasoup.toggleScreenShare()"
    >
      <ScreenShareOff v-if="mediasoup.isScreenSharing.value" />
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

const mediasoup = inject(mediasoupKey)!
const route = useRoute()

function disconnect() {
  mediasoup.disconnect()
  router.push({ name: 'Chat', params: { conversationId: route.params.conversationId } })
}
</script>

<style scoped></style>
