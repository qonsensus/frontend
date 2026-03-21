import { io } from 'socket.io-client'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import type { components } from '@/types/dtos.ts'
import { toast } from 'vue-sonner'
import { useFriendsStore } from '@/stores/friends.ts'
import router from '@/router'
import { useConversationsStore } from '@/stores/conversations.ts'

export function useNotificationSocket() {
  const socket = io('http://localhost:3000', {
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

  socket.on('newConversation', (data: components['schemas']['ConversationDto']) => {
    useConversationsStore().addConversation(data)
  })

  socket.on('newMessage', (data: components['schemas']['ConversationMessageDto']) => {
    // If the message belongs to the currently open conversation, add it to the messages list
    const conversationsStore = useConversationsStore()
    if (conversationsStore.currentlyOpenConversation?.id === data.conversationId) {
      conversationsStore.currentlyOpenConversationMessages.push(data)
    }
  })
}
