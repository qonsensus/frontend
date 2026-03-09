<template>
  <div class="h-full w-20 border-r flex flex-col items-center">
    <div class="grow" />
    <div class="flex flex-col items-center border-t gap-4 py-4 w-full">
      <Avatar class="border flex items-center justify-center w-12 h-12">
        <AvatarImage src="@/assets/logo.png" />
        <AvatarFallback class="flex items-center justify-center">JD</AvatarFallback>
      </Avatar>
      <Button variant="outline" size="icon-lg">
        <Settings />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
</script>

<style scoped></style>
