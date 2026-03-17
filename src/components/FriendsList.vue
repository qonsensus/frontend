<template>
  <ScrollArea class="h-full w-full">
    <ProfileCard v-for="fr in friends" :profile="fr.friendProfile" class="w-full">
      <div class="flex gap-2 mr-4">
        <Button size="icon" variant="outline" @click="createConversationHandler(fr.friendId)">
          <MessageSquarePlus />
        </Button>
      </div>
    </ProfileCard>
  </ScrollArea>
</template>

<script setup lang="ts">
import { MessageSquarePlus } from 'lucide-vue-next'
import type { components } from '@/types/dtos.ts'
import { ScrollArea } from '@/components/ui/scroll-area'
import ProfileCard from '@/components/ProfileCard.vue'
import { Button } from '@/components/ui/button'
import { useConversationService } from '@/composables/services/useConversationService.ts'

const { createConversation } = useConversationService()

defineProps<{
  friends: components['schemas']['FriendshipListItemDto'][]
}>()

async function createConversationHandler(friendId: string) {
  const dto: components['schemas']['CreateConversationDto'] = {
    participantIds: [friendId],
    name: '',
  }
  await createConversation(dto)
}
</script>

<style scoped></style>
