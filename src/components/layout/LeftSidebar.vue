<template>
  <div class="h-full w-18 border-r flex flex-col items-center">
    <div class="grow" />
    <div class="flex flex-col items-center border-t gap-4 py-4 w-full">
      <RouterLink to="/settings/profile">
        <Avatar
          class="border flex items-center justify-center w-11 h-11 hover:bg-accent transition-colors cursor-pointer"
        >
          <AvatarImage :src="user?.avatarUrl || 'none'" />
          <AvatarFallback class="flex items-center justify-center text-primary">
            <User />
          </AvatarFallback>
        </Avatar>
      </RouterLink>
      <ButtonGroup orientation="vertical">
        <Button variant="outline" size="icon-lg" @click="isMicOn = !isMicOn">
          <Mic v-if="isMicOn" />
          <MicOff class="text-red-400" v-else />
        </Button>
        <Button variant="outline" size="icon-lg" @click="isHeadphonesOn = !isHeadphonesOn">
          <Headphones v-if="isHeadphonesOn" />
          <HeadphoneOff class="text-red-400" v-else />
        </Button>
      </ButtonGroup>
      <Button variant="outline" size="icon-lg">
        <Settings />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings, Mic, MicOff, Headphones, HeadphoneOff, User } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { ref } from 'vue'
import { ButtonGroup } from '@/components/ui/button-group'
import { useUserStore } from '@/stores/user.ts'

const { user } = useUserStore()
const isMicOn = ref(true)
const isHeadphonesOn = ref(true)
</script>

<style scoped></style>
