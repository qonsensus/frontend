<template>
  <Card class="py-3" v-if="profile">
    <CardContent class="flex items-center gap-4 px-3">
      <Avatar class="w-16 h-16">
        <AvatarImage :src="profile.avatarUrl || ''" />
        <AvatarFallback>
          <User class="w-10 h-10" />
        </AvatarFallback>
      </Avatar>
      <div class="flex-1">
        <h2 class="text-lg font-semibold">{{ profile.displayName }}</h2>
        <p class="text-sm text-muted-foreground">@{{ profile.handle }}</p>
      </div>
      <slot />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import type { components } from '@/types/dtos.ts'

defineProps<{
  profile: components['schemas']['Profile'] | null
}>()
</script>

<style scoped></style>
