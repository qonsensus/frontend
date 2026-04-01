import { useApi } from '@/composables/utils/useApi.ts'
import type { components } from '@/types/dtos.ts'

export type ChatDto = Omit<
  components['schemas']['ChatDto'],
  'lastReadAt' | 'latestMessageCreatedAt'
> & {
  lastReadAt: Date
  latestMessageCreatedAt: Date | null
  typing: boolean
}

export function useChatService() {
  async function fetchMyChats(): Promise<ChatDto[]> {
    const client = useApi(true)
    const { data } = await client('/chat').get().json<components['schemas']['ChatDto'][]>()
    if (!data.value) throw new Error('No chat data')
    return data.value.map((chat) => ({
      ...chat,
      lastReadAt: new Date(chat.lastReadAt),
      latestMessageCreatedAt: chat.latestMessageCreatedAt
        ? new Date(chat.latestMessageCreatedAt)
        : null,
      typing: false,
    }))
  }

  async function createChat(payload: components['schemas']['CreateChatDto']): Promise<ChatDto> {
    const client = useApi(true)
    const { data } = await client('/chat').post(payload).json<components['schemas']['ChatDto']>()
    if (!data.value) throw new Error('No conversation data')
    return {
      ...data.value,
      lastReadAt: new Date(data.value.lastReadAt),
      latestMessageCreatedAt: data.value.latestMessageCreatedAt
        ? new Date(data.value.latestMessageCreatedAt)
        : null,
      typing: false,
    }
  }

  async function fetchChatMessages(
    chatId: string,
    before: Date,
    take?: number,
  ): Promise<components['schemas']['ChatMessageDto'][]> {
    const client = useApi(true)
    const queryParams = new URLSearchParams({
      before: before.toISOString(),
    })
    if (take) {
      queryParams.append('take', take.toString())
    }
    const { data } = await client(`/chat/${chatId}/messages?${queryParams.toString()}`)
      .get()
      .json<components['schemas']['ChatMessageDto'][]>()
    if (!data.value) throw new Error('No messages data')
    return data.value
  }

  return {
    fetchMyChats,
    createChat,
    fetchChatMessages,
  }
}
