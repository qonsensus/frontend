<template>
  <Dialog v-model:open="open">
    <DialogTrigger asChild>
      <Button size="icon">
        <UserPlus />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-100 min-w-4xl">
      <DialogHeader>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogDescription>
          Search for your friend's profile and send them a friend request!
        </DialogDescription>
      </DialogHeader>
      <Input
        placeholder="Search for a user by their handle..."
        @input="search($event.target.value)"
      />
      <ProfileCard :profile="foundProfile" />
      <DialogFooter>
        <div class="w-full flex flex-col gap-2">
          <Button class="w-full" :disabled="!foundProfile || loading" @click="sendFriendRequest">
            Add Friend
          </Button>
          <DialogClose as-child>
            <Button variant="outline" class="w-full" :disabled="loading"> Cancel </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ProfileCard from '@/components/ProfileCard.vue'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { useDebounceFn } from '@vueuse/core'
import type { components } from '@/types/dtos.ts'
import { useProfileService } from '@/composables/services/useProfileService.ts'
import { useUserStore } from '@/stores/user.ts'
import { storeToRefs } from 'pinia'
import { useFriendsService } from '@/composables/services/useFriendsService.ts'

const loading = ref(false)
const open = ref(false)
const foundProfile = ref<components['schemas']['Profile'] | null>(null)
const search = useDebounceFn(async (searchQuery: string) => {
  const result = await useProfileService().getByHandle(searchQuery)
  const currentUserId = storeToRefs(useUserStore()).user.value?.id
  if (result && result.id !== currentUserId) {
    foundProfile.value = result
  } else {
    foundProfile.value = null
  }
}, 500)

async function sendFriendRequest() {
  if (!foundProfile.value) return
  loading.value = true
  await useFriendsService().sendFriendRequest(foundProfile.value.ownerId)
  loading.value = false
  open.value = false
}
</script>

<style scoped></style>
