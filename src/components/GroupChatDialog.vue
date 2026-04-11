<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle class="text-2xl">Create Group Chat</DialogTitle>
        <DialogDescription class="text-sm text-muted-foreground">
          Search for friends to add to the group chat.
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-5">
        <Input placeholder="Search friends..." v-model="searchValue" />
        <ScrollArea class="h-100">
          <div class="flex flex-col gap-2">
            <ProfileCard
              v-for="option in filteredFriendOptions"
              :profile="option.friendProfile"
              small
            >
              <Button
                variant="outline"
                size="sm"
                @click="selectOption(option)"
                v-if="!model.some((item) => item.id === option.id)"
              >
                Add
              </Button>
              <Button variant="destructive" size="sm" @click="deselectOption(option)" v-else>
                Remove
              </Button>
            </ProfileCard>
          </div>
        </ScrollArea>
        <DialogFooter>
          <div class="flex flex-col gap-2 w-full">
            <Separator />
            {{ model.map((item) => item.friendProfile?.displayName).join(', ') }}
          </div>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { components } from '@/types/dtos.ts'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import ProfileCard from '@/components/ProfileCard.vue'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useFriendsService } from '@/composables/services/useFriendsService.ts'

const searchValue = ref<string>('')
const open = ref(true)
const friendOptions = ref<components['schemas']['FriendshipListItemDto'][]>([])
const model = defineModel<components['schemas']['FriendshipListItemDto'][]>({
  default: () => [],
})

const filteredFriendOptions = computed(() => {
  if (!searchValue.value || searchValue.value === '') return friendOptions.value
  return friendOptions.value.filter((option) =>
    option.friendProfile?.displayName?.toLowerCase().startsWith(searchValue.value.toLowerCase()),
  )
})

onMounted(async () => {
  friendOptions.value = await useFriendsService().getFriends(20, 1, true)
})

watch(open, async (val) => {
  if (!val) return
  friendOptions.value = await useFriendsService().getFriends(20, 1, true)
})

function selectOption(option: components['schemas']['FriendshipListItemDto']) {
  if (!model.value.some((item) => item.id === option.id)) {
    model.value = [...model.value, option]
  }
}

function deselectOption(option: components['schemas']['FriendshipListItemDto']) {
  console.log('Removing option:', option)
  model.value = model.value.filter((item) => item.id !== option.id)
}
</script>
