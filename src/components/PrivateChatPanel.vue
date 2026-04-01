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
      </div>
    </ScrollArea>
    <!-- Typing indicator: lives outside the scroll area so it's always visible -->
    <div class="px-5 h-5 flex items-center">
      <p v-if="store.currentlyOpenChat?.typing" class="text-sm text-muted-foreground animate-pulse">
        Typing...
      </p>
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

/** Returns true when the user is close enough to the bottom that auto-scroll makes sense. */
function isNearBottom(threshold = 150): boolean {
  const viewport = getScrollViewport()
  if (!viewport) return true
  return viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= threshold
}

// Watch the array reference – fires when fetchChatMessages replaces the array
// (initial load or switching to a different conversation).
watch(
  () => store.currentChatMessages,
  (newMessages) => {
    if (newMessages && newMessages.length > 0) {
      nextTick(() => scrollChatToBottom(true))
    }
  },
)

// Watch message count – fires when a new message is pushed into the existing array
// (incoming message via socket).
watch(
  () => store.currentChatMessages?.length,
  (newLen, oldLen) => {
    // Skip: no messages yet, or the array reference just changed (handled above).
    if (!oldLen || !newLen || newLen <= oldLen) return
    nextTick(() => {
      if (isNearBottom()) {
        scrollChatToBottom()
      }
    })
  },
)

// Watch typing state – scroll down when the indicator appears so it's not cut off
// (only if the user is already near the bottom).
watch(
  () => store.currentlyOpenChat?.typing,
  (isTyping) => {
    if (isTyping && isNearBottom()) {
      nextTick(() => scrollChatToBottom())
    }
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
  // Always scroll to bottom after the user sends their own message.
  nextTick(() => scrollChatToBottom())
}
</script>

<style scoped></style>
