<template>
  <div class="h-full flex flex-col w-full">
    <div class="p-3 border-b gap-3 flex items-center">
      <Button size="icon" variant="ghost" @click="$router.back()">
        <ChevronLeft />
      </Button>
      <p class="font-medium text-lg">{{ conversationTitle }}</p>
      <div class="flex-1" />
      <ButtonGroup>
        <Button size="icon" variant="outline">
          <Phone />
        </Button>
        <Button size="icon" variant="outline">
          <Video />
        </Button>
        <Button size="icon" variant="outline">
          <Users />
        </Button>
      </ButtonGroup>
    </div>
    <div class="min-h-0 flex-1 p-4">
      <div v-for="message in messages" :key="message.id">
        <p>
          <strong> {{ message.author?.profile?.displayName || 'TEST' }} </strong>:
          {{ message.content }}
        </p>
      </div>
    </div>
    <div class="p-5">
      <InputGroup>
        <textarea
          @keydown.enter.prevent="sendMessage"
          ref="textareaRef"
          data-slot="input-group-control"
          class="flex field-sizing-content min-h-20 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Autoresize textarea..."
          v-model="chatMessage"
        />
        <InputGroupAddon align="block-end" class="p-0">
          <div class="w-full flex items-center border-t p-3 gap-3">
            <ButtonGroup class="ml-auto">
              <Button size="icon-sm" variant="secondary" disabled>
                <Paperclip />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon-sm" variant="secondary">
                    <SmileIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="p-0 border-none bg-transparent" align="end">
                  <EmojiPicker
                    disable-skin-tones
                    theme="dark"
                    native
                    @select="(e) => insertTextAtCursor(e.i)"
                  />
                </PopoverContent>
              </Popover>
            </ButtonGroup>
            <Button size="icon" variant="default">
              <SendHorizonal />
            </Button>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import {
  ChevronLeft,
  Phone,
  Video,
  Users,
  SendHorizonal,
  Paperclip,
  SmileIcon,
} from 'lucide-vue-next'
import { nextTick, ref } from 'vue'
import { ButtonGroup } from '@/components/ui/button-group'
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { components } from '@/types/dtos.ts'

const chatMessage = ref<string>('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const props = defineProps<{
  conversationTitle: string
  messages: components['schemas']['ConversationMessage'][]
}>()

const emit = defineEmits<{
  (event: 'sendMessage', message: string): void
}>()

function insertTextAtCursor(text: string) {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const before = chatMessage.value.substring(0, start)
  const after = chatMessage.value.substring(end)
  chatMessage.value = `${before} ${text} ${after}`

  nextTick(() => {
    const newPosition = start + text.length
    textarea.setSelectionRange(newPosition, newPosition)
    textarea.focus()
    console.log(chatMessage.value)
  })
}

function sendMessage() {
  if (chatMessage.value.trim() === '') return
  emit('sendMessage', chatMessage.value)
  chatMessage.value = ''
}
</script>

<style scoped></style>
