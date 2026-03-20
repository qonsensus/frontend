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
      <PrivateChatPanel />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useConversationService } from '@/composables/services/useConversationService.ts'
import { onMounted, ref, watch } from 'vue'
import type { components } from '@/types/dtos.ts'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import LeftSecondaryHomeSidebar from '@/components/LeftSecondaryHomeSidebar.vue'
import PrivateChatPanel from '@/components/PrivateChatPanel.vue'

const params = useRoute().params
const { fetchConversationMessages } = useConversationService()
const messages = ref<components['schemas']['ConversationMessage'][]>([])

watch(
  () => params,
  async (newVal, oldVal) => {
    if (newVal.conversationId && oldVal.conversationId !== newVal.conversationId) {
      messages.value = await fetchConversationMessages(newVal.conversationId as string)
    }
  },
)

onMounted(async () => {
  messages.value = await fetchConversationMessages(params.conversationId as string)
})
</script>

<style scoped></style>
