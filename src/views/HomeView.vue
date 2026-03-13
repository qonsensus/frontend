<template>
  <div class="flex-1 flex flex-col h-full p-4 gap-4">
    <HomeViewHeader v-model:selected-tab="selectedTab" />
    <div class="flex-1 min-h-0 gap-4 flex">
      {{ selectedTab }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { components } from '@/types/dtos.ts'
import { onMounted, ref } from 'vue'
import { useFriendsService } from '@/composables/services/useFriendsService.ts'
import HomeViewHeader from '@/components/HomeViewHeader.vue'

const friends = ref<components['schemas']['FriendshipListItemDto'][]>()
const selectedTab = ref<string>('onlineFriends')

onMounted(async () => {
  const { getFriends } = useFriendsService()
  friends.value = await getFriends()
})
</script>
