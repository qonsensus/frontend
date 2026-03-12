<template>
  <Dialog>
    <DialogTrigger asChild>
      <Button size="icon">
        <UserPlus />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px] min-w-4xl">
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
          <Button type="submit" class="w-full"> Add Friend </Button>
          <DialogClose as-child>
            <Button variant="outline" class="w-full"> Cancel </Button>
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

const foundProfile = ref<components['schemas']['Profile'] | null>(null)
const search = useDebounceFn(async (searchQuery: string) => {
  foundProfile.value = await useProfileService().getByHandle(searchQuery)
}, 500)
</script>

<style scoped></style>
