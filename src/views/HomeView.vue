<template>
  <div class="flex-1 flex flex-col h-full p-4 gap-4">
    <div class="flex gap-2 w-full">
      <Input placeholder="Search" class="flex-1" />
      <Button variant="outline">Search</Button>
      <AddFriendButton />
    </div>
    <div class="flex-1 min-h-0 gap-4 flex">
      <Card class="flex-5">
        <CardHeader>
          <CardTitle> Online Friends </CardTitle>
          <CardDescription>
            All of your friends that are currently online and ready to chat!
          </CardDescription>
        </CardHeader>
        <CardContent> ssdfdsfdsfdsfdsf sadfsdfsdf </CardContent>
      </Card>
      <Card class="flex-2">
        <CardHeader>
          <CardTitle> Friend Requests </CardTitle>
          <CardDescription> View and manage your pending friend requests. </CardDescription>
        </CardHeader>
        <CardContent> ssdfdsfdsfdsfdsf sadfsdfsdf </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { components } from '@/types/dtos.ts'
import { onMounted, ref } from 'vue'
import { useFriendsService } from '@/composables/services/useFriendsService.ts'
import AddFriendButton from '@/components/AddFriendButton.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const friends = ref<components['schemas']['FriendshipListItemDto'][]>()

onMounted(async () => {
  const { getFriends } = useFriendsService()
  friends.value = await getFriends()
})
</script>

<style scoped></style>
