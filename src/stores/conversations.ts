import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { components } from '@/types/dtos.ts'
import { useChatService } from '@/composables/services/useChatService.ts'

export const useConversationsStore = defineStore('ConversationsStore', () => {
  const conversations = ref<components['schemas']['ConversationDto'][]>([])

  // Currently open conversation
  const currentlyOpenConversation = ref<components['schemas']['ConversationDto'] | null>(null)
  const currentlyOpenConversationMessages = ref<components['schemas']['ConversationMessageDto'][]>(
    [],
  )

  function addConversation(conversation: components['schemas']['ConversationDto']) {
    conversations.value.push(conversation)
  }

  async function fetchConversations() {
    const { fetchMyConversations } = useChatService()
    conversations.value = await fetchMyConversations()
  }

  return {
    conversations,
    currentlyOpenConversation,
    currentlyOpenConversationMessages,
    addConversation,
    fetchConversations,
  }
})
