<template>
  <div class="flex gap-4 w-full">
    <ToggleGroup
      type="single"
      variant="outline"
      :model-value="route.params.tab"
      @update:model-value="
        (val) => {
          if (val) $router.push({ path: `/${val}` })
        }
      "
    >
      <ToggleGroupItem value="onlineFriends">
        <UserCheck />
      </ToggleGroupItem>
      <ToggleGroupItem value="allFriends">
        <Users />
      </ToggleGroupItem>
      <ToggleGroupItem value="incomingFriendRequests">
        <Inbox />
        <Badge class="text-xs" v-if="incomingFriendRequestCount > 0">
          {{ incomingFriendRequestCount }}
        </Badge>
      </ToggleGroupItem>
    </ToggleGroup>
    <InputGroup>
      <InputGroupInput placeholder="Search" class="flex-1" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="outline">
          <Search />
          Search
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    <AddFriendButton />
  </div>
</template>

<script setup lang="ts">
import AddFriendButton from '@/components/AddFriendButton.vue'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Search, UserCheck, Users, Inbox } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { useFriendsStore } from '@/stores/friends.ts'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const { incomingFriendRequests } = storeToRefs(useFriendsStore())
const incomingFriendRequestCount = computed(() => incomingFriendRequests.value?.length || 0)
const route = useRoute()
</script>
