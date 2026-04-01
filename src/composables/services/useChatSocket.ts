import { useChatStore } from '@/stores/chat.ts'
import { io } from 'socket.io-client'
import { config } from '@/config.ts'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import type { components } from '@/types/dtos.ts'

function useChatSocket() {
  const store = useChatStore()

  function connect() {
    if (store.socket) {
      console.warn('WebSocket is already connected.')
      return
    }
    store.socket = io(`${config.apiUrl}/chat`, {
      auth: {
        token: useAuthToken().getToken(),
      },
    })

    store.socket.on(
      'newMessage',
      (payload: { chatId: string; message: components['schemas']['ChatMessageDto'] }) => {
        store.addMessageToCurrentChat(payload.message)
        store.incrementUnseenCount(payload.chatId)
      },
    )

    store.socket.on('typing', (payload: { chatId: string }) => {
      store.chatTyping(payload.chatId)
    })

    store.socket.on('stopTyping', (payload: { chatId: string }) => {
      store.chatStopTyping(payload.chatId)
    })

    store.socket.on('messagesRead', (payload: { chatId: string; userId: string }) => {
      // TODO: Handle read receipts
    })
  }

  function disconnect() {
    if (store.socket) {
      store.socket.disconnect()
      store.socket = null
    }
  }

  function sendMessage(data: components['schemas']['SendMessageWsDto']) {
    if (!store.socket) {
      console.error('WebSocket is not connected.')
      return
    }
    store.socket.emitWithAck(
      'sendMessage',
      data,
      (response: components['schemas']['ChatMessageDto']) => {
        store.addMessageToCurrentChat(response)
      },
    )
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
