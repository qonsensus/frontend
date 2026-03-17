<template>
  <div class="h-full w-full p-4 gap-4 flex flex-col">
    <InputGroup>
      <InputGroupInput placeholder="Search" class="flex-1" />
      <InputGroupAddon addonType="append">
        <Search />
      </InputGroupAddon>
    </InputGroup>
    <div class="flex-1 min-h-0">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        class="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
      >
        {{ conversation.id }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { storeToRefs } from 'pinia'
import { useConversationsStore } from '@/stores/conversations.ts'

const { conversations } = storeToRefs(useConversationsStore())
</script>

<style scoped></style>
