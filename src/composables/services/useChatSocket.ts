import { useChatStore } from '@/stores/chat.ts'
import { io } from 'socket.io-client'
import { config } from '@/config.ts'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import type { components } from '@/types/dtos.ts'

export function useChatSocket() {
  const store = useChatStore()

  function connect() {
    if (store.socket) {
      console.warn('WebSocket is already connected.')
      return
    }
    const socket = io(`${config.apiUrl}/chat`, {
      auth: {
        token: useAuthToken().getToken(),
      },
    })

    socket.on(
      'newMessage',
      (payload: { chatId: string; message: components['schemas']['ChatMessageDto'] }) => {
        console.log(payload)
        store.addMessageToCurrentChat(payload.message)
        store.incrementUnseenCount(payload.chatId)
      },
    )

    socket.on('typing', (payload: { chatId: string }) => {
      store.chatTyping(payload.chatId)
    })

    socket.on('stopTyping', (payload: { chatId: string }) => {
      store.chatStopTyping(payload.chatId)
    })

    socket.on('messagesRead', (payload: { chatId: string; userId: string }) => {
      // TODO: Handle read receipts
    })

    store.socket = socket
  }

  function disconnect() {
    if (store.socket) {
      store.socket.disconnect()
      store.socket = null
    }
  }

  async function sendMessage(data: components['schemas']['SendMessageWsDto']) {
    if (!store.socket) {
      console.error('WebSocket is not connected.')
      return
    }
    const response: components['schemas']['ChatMessageDto'] = await store.socket.emitWithAck(
      'sendMessage',
      data,
    )
    store.addMessageToCurrentChat(response)
  }

  function startTyping(chatId: string) {
    if (!store.socket) {
      console.error('WebSocket is not connected.')
      return
    }
    store.socket.emit('typing', { chatId })
    store.chatTyping(chatId)
  }

  function stopTyping(chatId: string) {
    if (!store.socket) {
      console.error('WebSocket is not connected.')
      return
    }
    store.socket.emit('stopTyping', { chatId })
    store.chatStopTyping(chatId)
  }

  function readMessages(chatId: string) {
    if (!store.socket) {
      console.error('WebSocket is not connected.')
      return
    }
    store.socket.emit('readMessages', { chatId })
  }

  return {
    connect,
    disconnect,
    sendMessage,
    startTyping,
    stopTyping,
    readMessages,
  }
}
