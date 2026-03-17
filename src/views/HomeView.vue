<template>
  <ResizablePanelGroup
    class="flex-1 h-full"
    direction="horizontal"
    auto-save-id="homeViewResizableGroup"
  >
    <ResizablePanel :default-size="20" :max-size="25" :min-size="15">
      <LeftSecondaryHomeSidebar />
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel>
      <div class="flex flex-col h-full p-4 gap-4 w-full">
        <HomeViewHeader :incoming-friend-request-count="incomingFriendRequests?.length || 0" />
        <div class="flex-1 min-h-0 gap-4 flex">
          <IncomingFriendRequestsList
            v-model="incomingFriendRequests"
            v-show="route.params.tab === 'incomingFriendRequests'"
          />
          <FriendsList :friends="friends || []" v-show="route.params.tab === 'allFriends'" />
        </div>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import HomeViewHeader from '@/components/HomeViewHeader.vue'
import IncomingFriendRequestsList from '@/components/IncomingFriendRequestsList.vue'
import FriendsList from '@/components/FriendsList.vue'
import { storeToRefs } from 'pinia'
import { useFriendsStore } from '@/stores/friends.ts'
import { useRoute } from 'vue-router'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import LeftSecondaryHomeSidebar from '@/components/LeftSecondaryHomeSidebar.vue'

const route = useRoute()
const { friends, incomingFriendRequests } = storeToRefs(useFriendsStore())
const { fetchAll } = useFriendsStore()

onMounted(async () => {
  await fetchAll()
})
</script>
