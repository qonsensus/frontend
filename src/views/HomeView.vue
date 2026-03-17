<template>
  <div class="flex-1 flex flex-col h-full p-4 gap-4">
    <HomeViewHeader :incoming-friend-request-count="incomingFriendRequests?.length || 0" />
    <div class="flex-1 min-h-0 gap-4 flex">
      <IncomingFriendRequestsList
        v-model="incomingFriendRequests"
        v-show="route.params.tab === 'incomingFriendRequests'"
      />
      <FriendsList :friends="friends || []" v-show="route.params.tab === 'allFriends'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import HomeViewHeader from '@/components/HomeViewHeader.vue'
import IncomingFriendRequestsList from '@/components/IncomingFriendRequestsList.vue'
import FriendsList from '@/components/FriendsList.vue'
import { storeToRefs } from 'pinia'
import { useFriendsStore } from '@/stores/friends.ts'
import { useRoute } from 'vue-router'

const route = useRoute()
const { friends, incomingFriendRequests } = storeToRefs(useFriendsStore())
const { fetchAll } = useFriendsStore()

onMounted(async () => {
  await fetchAll()
})
</script>
