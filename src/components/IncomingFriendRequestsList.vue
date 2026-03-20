<template>
  <ScrollArea class="h-full w-full">
    <ProfileCard v-for="fr in model" :profile="fr.requesterProfile" class="w-full">
      <div class="flex gap-2 mr-4">
        <Button size="icon" @click="acceptFriendRequestHandler(fr.id)">
          <Check />
        </Button>
        <Button size="icon" variant="outline" @click="declineFriendRequestHandler(fr.id)">
          <Trash />
        </Button>
      </div>
    </ProfileCard>
  </ScrollArea>
</template>

<script setup lang="ts">
import type { components } from '@/types/dtos.ts'
import { ScrollArea } from '@/components/ui/scroll-area'
import ProfileCard from '@/components/ProfileCard.vue'
import { Button } from '@/components/ui/button'
import { Check, Trash } from 'lucide-vue-next'
import { useFriendsService } from '@/composables/services/useFriendsService.ts'
import { useFriendsStore } from '@/stores/friends.ts'

const model = defineModel<components['schemas']['IncomingFrienshipRequestDto'][]>({
  required: true,
})

const { acceptFriendRequest, declineFriendRequest, getIncomingFriendRequests } = useFriendsService()

async function acceptFriendRequestHandler(requestId: string) {
  await acceptFriendRequest(requestId)
  model.value = await getIncomingFriendRequests()
  await useFriendsStore().fetchFriends()
}

async function declineFriendRequestHandler(requestId: string) {
  await declineFriendRequest(requestId)
  model.value = await getIncomingFriendRequests()
}
</script>

<style scoped></style>
