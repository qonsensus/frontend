<template>
  <div class="flex-1 flex flex-col h-full p-4">
    <div class="flex gap-2 w-full">
      <Input placeholder="Search" class="flex-1" />
      <Button variant="outline">Search</Button>
      <Button size="icon">
        <UserPlus />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { components } from '@/types/dtos.ts'
import { onMounted, ref } from 'vue'
import { useFriendsService } from '@/composables/services/useFriendsService.ts'
import { UserPlus } from 'lucide-vue-next'

const friends = ref<components['schemas']['FriendshipListItemDto'][]>()

onMounted(async () => {
  const { getFriends } = useFriendsService()
  friends.value = await getFriends()
})
</script>

<style scoped></style>
