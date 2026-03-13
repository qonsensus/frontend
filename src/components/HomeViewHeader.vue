<template>
  <div class="flex gap-4 w-full">
    <ToggleGroup
      type="single"
      variant="outline"
      :model-value="model"
      @update:model-value="
        (val) => {
          if (val) model = val.toString()
        }
      "
    >
      <ToggleGroupItem value="onlineFriends">
        <UserCheck />
      </ToggleGroupItem>
      <ToggleGroupItem value="friendRequests">
        <Users />
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
import { Search, UserCheck, Users } from 'lucide-vue-next'

const model = defineModel<string>('selectedTab', { required: true })
</script>
