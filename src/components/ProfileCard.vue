<template>
  <Card class="py-3" v-if="profile">
    <CardContent class="flex items-center px-3" :class="{ ['gap-3']: small, ['gap-4']: !small }">
      <Avatar :class="{ ['w-10 h-10']: small, ['w-16 h-16']: !small }" v-if="!noAvatar">
        <AvatarImage :src="profile.avatarUrl || ''" />
        <AvatarFallback>
          <User :class="{ ['w-6 h-6']: small, ['w-8 h-8']: !small }" />
        </AvatarFallback>
      </Avatar>
      <div class="flex-1" :class="{ ['ml-2']: noAvatar }">
        <p
          :class="{
            ['text-lg font-semibold']: !small,
            ['text-md']: small,
          }"
        >
          {{ profile.displayName }}
        </p>
        <p
          :class="{
            ['text-sm text-muted-foreground']: !small,
            ['text-xs text-muted-foreground']: small,
          }"
        >
          @{{ profile.handle }}
        </p>
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

withDefaults(
  defineProps<{
    profile: components['schemas']['Profile'] | null
    noAvatar?: boolean
    small?: boolean
  }>(),
  {
    noAvatar: false,
    small: false,
  },
)
</script>

<style scoped></style>
