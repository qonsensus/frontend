<template>
  <ScrollArea class="h-full w-full">
    <ProfileCard v-for="fr in incomingFriendRequests" :profile="fr.requesterProfile" class="w-full">
      <div class="flex gap-2 mr-4">
        <Button size="icon" @click="acceptFriendRequest(fr.id)">
          <Check />
        </Button>
        <Button size="icon" variant="outline" @click="declineFriendRequest(fr.id)">
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

defineProps<{
  incomingFriendRequests: components['schemas']['IncomingFrienshipRequestDto'][]
}>()

const { acceptFriendRequest, declineFriendRequest } = useFriendsService()
</script>

<style scoped></style>
