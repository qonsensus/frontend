<template>
  <ScrollArea class="h-full w-full">
    <ProfileCard v-for="fr in friends" :profile="fr.friendProfile" class="w-full" />
  </ScrollArea>
</template>

<script setup lang="ts">
import type { components } from '@/types/dtos.ts'
import { ScrollArea } from '@/components/ui/scroll-area'
import ProfileCard from '@/components/ProfileCard.vue'

defineProps<{
  friends: components['schemas']['FriendshipListItemDto'][]
}>()
</script>

<style scoped></style>
