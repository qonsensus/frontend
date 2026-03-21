import { useApi } from '@/composables/utils/useApi.ts'
import type { components } from '@/types/dtos.ts'

export function useConversationService() {
  async function fetchMyConversations() {
    const client = useApi(true)
    const { data } = await client('/conversation')
      .get()
      .json<components['schemas']['ConversationDto'][]>()
    if (!data.value) throw new Error('No conversations data')
    return data.value
  }

  async function createConversation(payload: components['schemas']['CreateConversationDto']) {
    const client = useApi(true)
    const { data } = await client('/conversation')
      .post(payload)
      .json<components['schemas']['ConversationDto']>()
    if (!data.value) throw new Error('No conversation data')
    return data.value
  }

  async function sendMessage(
    conversationId: string,
    payload: components['schemas']['SendMessageDto'],
  ): Promise<components['schemas']['ConversationMessageDto']> {
    const client = useApi(true)
    const { data } = await client(`/conversation/${conversationId}/message`)
      .post(payload)
      .json<components['schemas']['ConversationMessageDto']>()
    if (!data.value) throw new Error('No message data')
    return data.value
  }

  async function fetchConversationMessages(
    conversationId: string,
  ): Promise<components['schemas']['ConversationMessageDto'][]> {
    const client = useApi(true)
    const { data } = await client(`/conversation/${conversationId}/messages`)
      .get()
      .json<components['schemas']['ConversationMessageDto'][]>()
    if (!data.value) throw new Error('No messages data')
    return data.value
  }

  return {
    fetchMyConversations,
    createConversation,
    sendMessage,
    fetchConversationMessages,
  }
}
