import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { components } from '@/types/dtos.ts'
import { useConversationService } from '@/composables/services/useConversationService.ts'

export const useConversationsStore = defineStore('ConversationsStore', () => {
  const conversations = ref<components['schemas']['ConversationDto'][]>([])

  function addConversation(conversation: components['schemas']['ConversationDto']) {
    conversations.value.push(conversation)
  }

  async function fetchConversations() {
    const { fetchMyConversations } = useConversationService()
    conversations.value = await fetchMyConversations()
  }

  return {
    conversations,
    addConversation,
    fetchConversations,
  }
})
