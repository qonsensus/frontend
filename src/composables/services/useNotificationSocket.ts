import { io } from 'socket.io-client'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'

export function useNotificationSocket() {
  const socket = io('http://localhost:3000', {
    auth: {
      token: useAuthToken().getToken(),
    },
  })

  socket.on('friendRequest', (data) => {
    console.log(`Received reply: ${data}`)
  })
}
