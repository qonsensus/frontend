<template>
  <Avatar
    :class="{
      ['w-10 h-10']: size === 'small',
      ['w-16 h-16']: size === 'default',
      ['w-22 h-22']: size === 'large',
    }"
  >
    <AvatarImage :src="profile.avatarUrl || ''" />
    <AvatarFallback>
      <User
        :class="{
          ['w-6 h-6']: size === 'small',
          ['w-8 h-8']: size === 'default',
          ['w-10 h-10']: size === 'large',
        }"
      />
    </AvatarFallback>
  </Avatar>
</template>

<script setup lang="ts">
import { User } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { components } from '@/types/dtos.ts'

const {} = withDefaults(
  defineProps<{
    size?: 'small' | 'default' | 'large'
    profile: components['schemas']['Profile']
  }>(),
  {
    size: 'default',
  },
)
</script>
