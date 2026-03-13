<template>
  <div class="flex-1 flex flex-col h-full p-4 gap-4">
    <HomeViewHeader
      :incoming-friend-request-count="incomingFriendRequests?.length || 0"
      v-model:selected-tab="selectedTab"
    />
    <div class="flex-1 min-h-0 gap-4 flex">
      {{ selectedTab }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from '@/types/dtos.ts'
import { computed, onMounted, ref } from 'vue'
import { useFriendsService } from '@/composables/services/useFriendsService.ts'
import HomeViewHeader from '@/components/HomeViewHeader.vue'

const friends = ref<components['schemas']['FriendshipListItemDto'][]>()
const incomingFriendRequests = ref<components['schemas']['IncomingFrienshipRequestDto'][]>()
const outgoingFriendRequests = ref<components['schemas']['OutgoingFrienshipRequestDto'][]>()
const selectedTab = ref<string>('onlineFriends')

onMounted(async () => {
  const { getFriends, getIncomingFriendRequests, getOutgoingFriendRequests } = useFriendsService()
  const [friendsRes, incomingFriendRequestsRes, outgoingFriendRequestsRes] = await Promise.all([
    getFriends(),
    getIncomingFriendRequests(),
    getOutgoingFriendRequests(),
  ])
  friends.value = friendsRes
  incomingFriendRequests.value = incomingFriendRequestsRes
  outgoingFriendRequests.value = outgoingFriendRequestsRes
})
</script>
