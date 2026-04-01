<template>
  <div class="h-full flex flex-col w-full">
    <div class="p-3 border-b gap-3 flex items-center">
      <Button size="icon" variant="ghost" @click="$router.back()">
        <ChevronLeft />
      </Button>
      <p class="font-medium text-lg">{{ conversationTitle }}</p>
      <div class="flex-1" />
      <ButtonGroup>
        <Button
          size="icon"
          variant="outline"
          @click="$router.push(`/private-call/${store.currentlyOpenChat?.id}`)"
        >
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
    <ScrollArea class="min-h-0 flex-1" ref="scrollArea">
      <div class="px-4 flex flex-col h-full justify-end">
        <ChatMessage
          v-for="(message, index) in store.currentChatMessages"
          :key="message.id"
          :message="message"
          :prevMessage="(store.currentChatMessages || [])[index - 1]"
        />
        <p v-if="store.currentlyOpenChat?.typing">Typing...</p>
      </div>
    </ScrollArea>
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
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { ButtonGroup } from '@/components/ui/button-group'
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ChatMessage from './ChatMessage.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatStore } from '@/stores/chat.ts'
import { useChatSocket } from '@/composables/services/useChatSocket.ts'
import { useRoute } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'

const route = useRoute()
const chatMessage = ref<string>('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const store = useChatStore()
const conversationTitle = computed(() => {
  if (!store.currentlyOpenChat) return 'Private Chat'
  return store.currentlyOpenChat.participants.map((p) => p.displayName).join(', ')
})
const scrollAreaRef = useTemplateRef('scrollArea')

const stopTyping = useDebounceFn(() => {
  useChatSocket().stopTyping(route.params.conversationId as string)
}, 1000)

function getScrollViewport(): HTMLElement | null {
  const root = scrollAreaRef.value?.$el as HTMLElement | undefined
  if (!root) return null
  return root.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null
}

watch(
  () => store.currentChatMessages,
  (newValue, oldValue) => {
    nextTick(() => {
      if (!oldValue || !newValue) return
      if (oldValue.length === 0 && newValue.length > 0) {
        scrollChatToBottom(true)
      } else {
        scrollChatToBottom()
      }
    })
  },
)

watch(chatMessage, (newVal) => {
  if (!store.currentlyOpenChat) return
  if (newVal && newVal.length === 0) {
    useChatSocket().stopTyping(route.params.conversationId as string)
    return
  }
  if (!store.currentlyOpenChat.typing) {
    useChatSocket().startTyping(route.params.conversationId as string)
  }
  stopTyping()
})

function scrollChatToBottom(instant = false) {
  const viewport = getScrollViewport()
  if (!viewport) return

  viewport.scrollTo({
    top: viewport.scrollHeight,
    behavior: instant ? 'instant' : 'smooth',
  })
}

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
  })
}

async function sendMessage() {
  if (chatMessage.value.trim() === '') return
  await useChatSocket().sendMessage({
    chatId: route.params.conversationId as string,
    message: chatMessage.value.trim(),
  })
  chatMessage.value = ''
}
</script>

<style scoped></style>
