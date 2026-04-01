<template>
  <PrivateChatPanel />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'
import PrivateChatPanel from '@/components/PrivateChatPanel.vue'
import { useChatStore } from '@/stores/chat.ts'

const route = useRoute()
const store = useChatStore()

watch(
  () => route.params.conversationId,
  async (newVal, oldVal) => {
    if (newVal && oldVal !== newVal) {
      await store.fetchChatMessages(newVal as string, new Date())
    }
  },
)

onMounted(async () => {
  if (route.params.conversationId) {
    store.setCurrentlyOpenChat(route.params.conversationId as string)
    await store.fetchChatMessages(route.params.conversationId as string, new Date())
  }
})
</script>

<style scoped></style>
