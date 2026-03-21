<template>
  <div class="w-full flex flex-col">
    <div class="flex items-center gap-2 mt-4 mb-2" v-if="!isSameAuthorAsPrev">
      <div v-if="isMyMessage" class="flex-1 border-t" />
      <Badge class="font-bold text-sm flex items-baseline" variant="outline">
        <p>{{ message.authorName }}</p>
      </Badge>
      <div v-if="!isMyMessage" class="flex-1 border-t" />
    </div>
    <p :class="{ 'text-right': isMyMessage, 'px-1': true }">
      <span
        class="text-xs text-muted tabular-nums mr-2 transition duration-50 hover:text-primary cursor-default"
        v-if="!isMyMessage"
        >{{ formatTime(message.createdAt) }}</span
      >
      {{ message.content }}
      <span
        class="text-xs text-muted tabular-nums ml-2 transition duration-50 hover:text-primary cursor-default"
        v-if="isMyMessage"
        >{{ formatTime(message.createdAt) }}</span
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import type { components } from '@/types/dtos.ts'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.ts'
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'

const { user } = storeToRefs(useUserStore())

const props = defineProps<{
  message: components['schemas']['ConversationMessageDto']
  prevMessage?: components['schemas']['ConversationMessageDto']
}>()

const isMyMessage = computed(() => {
  return props.message.authorProfileId === user.value?.id
})

const isSameAuthorAsPrev = computed(() => {
  if (!props.prevMessage) return false
  return props.message.authorProfileId === props.prevMessage.authorProfileId
})

function formatTime(date: string) {
  let timeString = new Date(date).toLocaleTimeString()
  // Remove seconds from the time string
  timeString = timeString.replace(/:\d{2}\s/, ' ')
  // Add leading zero to hours if needed
  timeString = timeString.replace(/^(\d):/, '0$1:')
  return timeString
}
</script>

<style scoped></style>
