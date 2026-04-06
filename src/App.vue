<template>
  <div class="w-screen h-screen flex">
    <RouterView name="leftSidebar" />
    <ResizablePanelGroup
      class="flex-1 h-full"
      direction="horizontal"
      auto-save-id="homeViewResizableGroup"
    >
      <template v-if="hasSecondarySidebar">
        <ResizablePanel :default-size="20" :max-size="40" :min-size="20">
          <RouterView class="w-full" name="leftSecondarySidebar" />
        </ResizablePanel>
        <ResizableHandle />
      </template>
      <ResizablePanel>
        <RouterView class="w-full" />
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
  <Toaster position="top-right" />
  <GroupChatDialog />
</template>

<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import GroupChatDialog from '@/components/GroupChatDialog.vue'

const route = useRoute()

const hasSecondarySidebar = computed(() => {
  return route.matched.some((record) => record.components?.leftSecondarySidebar)
})
</script>

<style scoped></style>
