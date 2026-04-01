import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { components } from '@/types/dtos.ts'
import { type ChatDto, useChatService } from '@/composables/services/useChatService.ts'
import type { Socket } from 'socket.io-client'

export const useChatStore = defineStore('ChatStore', () => {
  const socket = ref<Socket | null>(null)
  const chats = ref<ChatDto[]>([])
  const currentlyOpenChatId = ref<string | null>(null)
  const currentlyOpenChat = computed(
    () => chats.value.find((c) => c.id === currentlyOpenChatId.value) || null,
  )
  const currentChatMessages = ref<components['schemas']['ChatMessageDto'][] | null>(null)

  async function fetchMyChats() {
    const service = useChatService()
    chats.value = await service.fetchMyChats()
  }

  async function fetchChatMessages(chatId: string, before: Date, take?: number) {
    if (chatId !== currentlyOpenChatId.value) return
    const service = useChatService()
    currentChatMessages.value = await service.fetchChatMessages(chatId, before, take)
  }

  function incrementUnseenCount(chatId: string) {
    const chat = chats.value.find((c) => c.id === chatId)
    if (chat?.id === currentlyOpenChatId.value) return
    if (chat) {
      chat.unseenMessagesCount += 1
    }
  }

  function setCurrentlyOpenChat(chatId: string | null) {
    currentlyOpenChatId.value = chatId
    currentChatMessages.value = null // clear stale messages immediately on switch
    if (chatId) {
      const chat = chats.value.find((c) => c.id === chatId)
      if (chat) {
        chat.unseenMessagesCount = 0
        chat.lastReadAt = new Date()
      }
    }
  }

  function addMessageToCurrentChat(message: components['schemas']['ChatMessageDto']) {
    if (currentlyOpenChatId.value === message.chatId) {
      currentChatMessages.value?.push(message)
    }
  }

  function chatTyping(chatId: string) {
    const chat = chats.value.find((c) => c.id === chatId)
    if (chat) {
      chat.typing = true
    }
  }

  function chatStopTyping(chatId: string) {
    const chat = chats.value.find((c) => c.id === chatId)
    if (chat) {
      chat.typing = false
    }
  }

  function addChat(chat: ChatDto) {
    const existingChat = chats.value.find((c) => c.id === chat.id)
    if (!existingChat) {
      chats.value.unshift(chat)
    }
  }

  return {
    socket,
    chats,
    currentlyOpenChatId,
    currentlyOpenChat,
    currentChatMessages,
    fetchMyChats,
    fetchChatMessages,
    incrementUnseenCount,
    setCurrentlyOpenChat,
    addMessageToCurrentChat,
    chatTyping,
    chatStopTyping,
    addChat,
  }
})
