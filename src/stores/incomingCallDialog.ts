import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import type { components } from '@/types/dtos.ts'

export const useIncomingCallDialog = defineStore('IncomingCallDialogStore', () => {
  const dialogOpen = ref<boolean>(false)
  const payload = ref<components['schemas']['IncomingCallWsDto']>({
    callerAvatarUrl: '',
    callerDisplayName: '',
    chatId: '',
  })

  function notifyIncomingCall(data: components['schemas']['IncomingCallWsDto']) {
    payload.value = data
    dialogOpen.value = true
  }

  function closeDialog() {
    dialogOpen.value = false
  }

  return {
    dialogOpen: readonly(dialogOpen),
    payload: readonly(payload),
    notifyIncomingCall,
    closeDialog,
  }
})
