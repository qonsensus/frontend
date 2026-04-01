import { io } from 'socket.io-client'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import type { components } from '@/types/dtos.ts'
import { toast } from 'vue-sonner'
import { useFriendsStore } from '@/stores/friends.ts'
import router from '@/router'
import { config } from '@/config.ts'
import { useChatStore } from '@/stores/chat.ts'
import type { ChatDto } from '@/composables/services/useChatService.ts'

export function useNotificationSocket() {
  const socket = io(config.apiUrl, {
    auth: {
      token: useAuthToken().getToken(),
    },
  })

  socket.on('friendRequest', (data: components['schemas']['IncomingFriendRequestWsDto']) => {
    toast.info('New friend request!', {
      description: `${data.senderDisplayName} has sent you a friend request.`,
      dismissible: true,
      cancel: {
        label: 'Dismiss',
      },
      action: {
        label: 'View',
        onClick: async () => {
          await router.push('/incomingFriendRequests')
        },
      },
    })
    useFriendsStore().addIncomingFriendRequest(data.listItem)
  })

  socket.on('newConversation', (data: components['schemas']['ChatDto']) => {
    const chat: ChatDto = {
      ...data,
      lastReadAt: new Date(data.lastReadAt),
      latestMessageCreatedAt: data.latestMessageCreatedAt
        ? new Date(data.latestMessageCreatedAt)
        : null,
      typing: false,
    }
    useChatStore().addChat(chat)
  })
}
