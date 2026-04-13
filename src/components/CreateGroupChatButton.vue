<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline"> <Users /> New Group</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle class="text-2xl">Create Group Chat</DialogTitle>
        <DialogDescription class="text-sm text-muted-foreground">
          Search for friends to add to the group chat.
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-5">
        <TagsInput v-model="model">
          <TagsInputItem v-for="participant in model" :key="participant.id" :value="participant">
            <TagsInputItemText>{{ participant.friendProfile?.displayName }}</TagsInputItemText>
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput
            :value="searchValue"
            @input="searchValue = $event.target.value"
            @keydown.enter.prevent="selectOption(filteredFriendOptions[focusedIndex])"
            @keydown.down.prevent="focusNext()"
            @keydown.up.prevent="focusLast()"
          />
        </TagsInput>
        <ScrollArea class="h-120">
          <div class="flex flex-col gap-2">
            <div
              v-for="(option, index) in filteredFriendOptions"
              :key="option.id"
              :ref="(el) => setOptionRef(el, index)"
            >
              <ProfileCard :profile="option.friendProfile" :focused="focusedIndex === index" small>
                <Button
                  size="sm"
                  @click="selectOption(option)"
                  v-if="!model.some((item) => item.id === option.id)"
                >
                  Add
                </Button>
                <Button variant="destructive" size="sm" @click="deselectOption(option)" v-else>
                  Remove
                </Button>
              </ProfileCard>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <div class="flex flex-col gap-6 w-full">
            <Separator />
            <div class="flex gap-4 w-full h-22 items-center">
              <Avatar class="h-22 w-22">
                <AvatarImage :src="''" />
                <AvatarFallback><Upload /></AvatarFallback>
              </Avatar>
              <div class="flex flex-col gap-3 w-full">
                <Input :placeholder="suggestedTitle" class="w-full" />
                <Input placeholder="Description" class="w-full" />
              </div>
            </div>
            <Button class="w-full" @click="createGroup">Create Group</Button>
          </div>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUpdate, onMounted, ref, watch } from 'vue'
import type { components } from '@/types/dtos.ts'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import ProfileCard from '@/components/ProfileCard.vue'
import { Separator } from '@/components/ui/separator'
import { useFriendsService } from '@/composables/services/useFriendsService.ts'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, Users } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { useChatService } from '@/composables/services/useChatService.ts'

const { createChat } = useChatService()
const searchValue = ref<string>('')
const open = ref(false)
const friendOptions = ref<components['schemas']['FriendshipListItemDto'][]>([])
const model = defineModel<components['schemas']['FriendshipListItemDto'][]>({
  default: () => [],
})

const focusedIndex = ref(0)
const optionRefs = ref<HTMLElement[]>([])

onBeforeUpdate(() => {
  optionRefs.value = []
})

function setOptionRef(el: unknown, index: number) {
  if (el) optionRefs.value[index] = el as HTMLElement
}

const filteredFriendOptions = computed<components['schemas']['FriendshipListItemDto'][]>(() => {
  if (!searchValue.value || searchValue.value === '') return friendOptions.value
  return friendOptions.value.filter((option) =>
    option.friendProfile?.displayName?.toLowerCase().startsWith(searchValue.value.toLowerCase()),
  )
})
const suggestedTitle = computed<string>(() => {
  const name = model.value.map((val) => val.friendProfile.displayName).join(', ')
  if (name.length < 1) return 'Group Name'
  return `Chat with ${name.length > 20 ? name.slice(0, 20) + '...' : name}`
})

watch(filteredFriendOptions, () => {
  focusedIndex.value = 0
})

watch(focusedIndex, (index) => {
  nextTick(() => {
    optionRefs.value[index]?.scrollIntoView({ block: 'nearest' })
  })
})

onMounted(async () => {
  friendOptions.value = await useFriendsService().getFriends(20, 1, true)
})

watch(open, async (val) => {
  if (!val) return
  reset()
  friendOptions.value = await useFriendsService().getFriends(20, 1, true)
})

function selectOption(option?: components['schemas']['FriendshipListItemDto']) {
  if (!option) return
  if (!model.value.some((item) => item.id === option.id)) {
    model.value = [...model.value, option]
    searchValue.value = ''
  } else {
    deselectOption(option)
  }
}

function deselectOption(option: components['schemas']['FriendshipListItemDto']) {
  model.value = model.value.filter((item) => item.id !== option.id)
}

function focusNext() {
  if (filteredFriendOptions.value.length === 0) return
  if (focusedIndex.value >= filteredFriendOptions.value.length - 1) {
    focusedIndex.value = 0
  } else {
    focusedIndex.value++
  }
}

function focusLast() {
  if (filteredFriendOptions.value.length === 0) return
  if (focusedIndex.value <= 0) {
    focusedIndex.value = filteredFriendOptions.value.length - 1
  } else {
    focusedIndex.value--
  }
}

async function createGroup() {
  if (model.value.length < 2) return
  await createChat({
    name: suggestedTitle.value,
    participantIds: model.value.map((item) => item.friendId),
  })
  open.value = false
}

function reset() {
  model.value = []
  focusedIndex.value = 0
}
</script>
