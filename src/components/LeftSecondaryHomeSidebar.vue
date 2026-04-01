<template>
  <div class="h-full w-full p-4 gap-4 flex flex-col">
    <InputGroup>
      <InputGroupInput placeholder="Search" class="flex-1" />
      <InputGroupAddon addonType="append">
        <Search />
      </InputGroupAddon>
    </InputGroup>
    <div class="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto">
      <Card
        v-for="conversation in store.chats"
        :key="conversation.id"
        :class="{
          'p-2 rounded-md cursor-pointer transition duration-150 hover:bg-accent': true,
          'bg-primary/10': conversation.id === selectedConversationId,
        }"
        @click="$router.push(`/chat/${conversation.id}`)"
      >
        <CardContent class="px-1">
          <div class="flex gap-2">
            <Avatar class="h-12 w-12 border">
              <AvatarImage src="" alt="Avatar" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <div class="flex flex-col gap-1">
              <p class="font-medium leading-none">
                {{ conversation.participants.map((c) => c.displayName).join(', ') }}
              </p>
              <p class="text-sm text-muted-foreground">message preview...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useChatStore } from '@/stores/chat.ts'

const store = useChatStore()
const params = useRoute().params

const selectedConversationId = computed<string | undefined>(() => {
  return store.chats.find((c) => c.id === params.conversationId)?.id
})
</script>

<style scoped></style>
