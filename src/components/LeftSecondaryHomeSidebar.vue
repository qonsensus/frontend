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
        v-for="conversation in conversations"
        :key="conversation.id"
        class="p-2 rounded-md cursor-pointer"
      >
        <CardContent class="px-1">
          <div class="flex gap-2">
            <Avatar class="h-10 w-10">
              <AvatarImage src="" alt="Avatar" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <div class="flex flex-col gap-1">
              <p class="text-sm font-medium leading-none">
                {{ conversation.participants.map((c) => c.displayName).join(', ') }}
              </p>
              <p class="text-xs text-muted-foreground">message preview...</p>
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
import { storeToRefs } from 'pinia'
import { useConversationsStore } from '@/stores/conversations.ts'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const { conversations } = storeToRefs(useConversationsStore())
</script>

<style scoped></style>
