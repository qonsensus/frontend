<template>
  <PrivateChatPanel @sendMessage="sendMessageHandler" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useChatService } from '@/composables/services/useChatService.ts'
import { onMounted, watch } from 'vue'
import type { components } from '@/types/dtos.ts'
import PrivateChatPanel from '@/components/PrivateChatPanel.vue'
import { storeToRefs } from 'pinia'
import { useConversationsStore } from '@/stores/conversations.ts'

const route = useRoute()
const { fetchConversationMessages, sendMessage } = useChatService()
const { conversations, currentlyOpenConversation, currentlyOpenConversationMessages } =
  storeToRefs(useConversationsStore())

watch(
  () => route.params.conversationId,
  async (newVal, oldVal) => {
    if (newVal && oldVal !== newVal) {
      currentlyOpenConversation.value = conversations.value.find((c) => c.id === newVal) || null
      currentlyOpenConversationMessages.value = await fetchConversationMessages(newVal as string)
    }
  },
)

onMounted(async () => {
  if (route.params.conversationId) {
    currentlyOpenConversation.value =
      conversations.value.find((c) => c.id === route.params.conversationId) || null
    currentlyOpenConversationMessages.value = await fetchConversationMessages(
      route.params.conversationId as string,
    )
  }
})

async function sendMessageHandler(content: string) {
  const dto: components['schemas']['SendMessageDto'] = {
    message: content,
  }
  await sendMessage(route.params.conversationId as string, dto)
}
</script>

<style scoped></style>
