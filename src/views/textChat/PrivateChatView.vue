<template>
  <ResizablePanelGroup
    class="flex-1 h-full"
    direction="horizontal"
    auto-save-id="homeViewResizableGroup"
  >
    <ResizablePanel :default-size="20" :max-size="40" :min-size="20">
      <LeftSecondaryHomeSidebar />
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel>
      <PrivateChatPanel @sendMessage="sendMessageHandler" :conversationTitle :messages="messages" />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useConversationService } from '@/composables/services/useConversationService.ts'
import { computed, onMounted, ref, watch } from 'vue'
import type { components } from '@/types/dtos.ts'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import LeftSecondaryHomeSidebar from '@/components/LeftSecondaryHomeSidebar.vue'
import PrivateChatPanel from '@/components/PrivateChatPanel.vue'
import { storeToRefs } from 'pinia'
import { useConversationsStore } from '@/stores/conversations.ts'

const route = useRoute()
const { fetchConversationMessages, sendMessage } = useConversationService()
const messages = ref<components['schemas']['ConversationMessage'][]>([])
const { conversations } = storeToRefs(useConversationsStore())
const selectedConversation = computed<components['schemas']['ConversationDto'] | undefined>(() => {
  return conversations.value.find((c) => c.id === route.params.conversationId)
})
const conversationTitle = computed(() => {
  if (!selectedConversation.value) return 'Private Chat'
  return selectedConversation.value.participants.map((p) => p.displayName).join(', ')
})

watch(
  () => route.params.conversationId,
  async (newVal, oldVal) => {
    if (newVal && oldVal !== newVal) {
      messages.value = await fetchConversationMessages(newVal as string)
    }
  },
)

onMounted(async () => {
  messages.value = await fetchConversationMessages(route.params.conversationId as string)
})

async function sendMessageHandler(content: string) {
  const dto: components['schemas']['SendMessageDto'] = {
    message: content,
  }
  const message = await sendMessage(route.params.conversationId as string, dto)
  messages.value.push(message)
}
</script>

<style scoped></style>
