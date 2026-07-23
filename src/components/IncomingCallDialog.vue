<template>
  <AlertDialog v-model:open="dialogOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <div class="w-full flex flex-col items-center gap-4">
          <Avatar class="h-32 w-32">
            <AvatarImage :src="payload.callerAvatarUrl || ''" />
            <AvatarFallback>
              <User class="text-xl h-20 w-20" />
            </AvatarFallback>
          </Avatar>
          <p class="text-xl">{{ `${payload.callerDisplayName} is calling...` }}</p>
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter class="flex flex-row gap-6 justify-center! w-full mt-4">
        <Button @click="answerCall()" size="lg"> <Phone /> Answer </Button>
        <Button @click="closeDialog()" variant="destructive" size="lg">
          <PhoneOff /> Reject
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import { useIncomingCallDialog } from '@/stores/incomingCallDialog.ts'
import { User, Phone, PhoneOff } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import router from '@/router'
import ringtone from '@/assets/call-ringtone.mp3'
import { watch } from 'vue'

const { payload, dialogOpen } = storeToRefs(useIncomingCallDialog())
const { closeDialog } = useIncomingCallDialog()
const audio = new Audio(ringtone)
audio.loop = true
audio.volume = 0.6

watch(dialogOpen, (open) => {
  if (open) {
    audio.play()
  } else {
    audio.pause()
    audio.currentTime = 0
  }
})

function answerCall() {
  closeDialog()
  router.push(`/private-call/${payload.value.chatId}`)
}
</script>
