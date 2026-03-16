import { io } from 'socket.io-client'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import type { components } from '@/types/dtos.ts'
import { toast } from 'vue-sonner'
import { useFriendsStore } from '@/stores/friends.ts'

export function useNotificationSocket() {
  const socket = io('http://localhost:3000', {
    auth: {
      token: useAuthToken().getToken(),
    },
  })

  socket.on('friendRequest', (data: components['schemas']['IncomingFriendRequestWsDto']) => {
    toast('New friend request!', {
      description: `${data.senderDisplayName} has sent you a friend request.`,
      action: {
        label: 'View',
        onClick: () => {
          // Implement navigation to the friend requests page or relevant UI
          console.log('Navigate to friend requests page')
        },
      },
    })
    useFriendsStore().addIncomingFriendRequest(data.listItem)
  })
}
