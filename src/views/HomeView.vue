<template>
  <div class="flex flex-col h-full w-full p-4">
    <Tabs default-value="recentChats" class="flex flex-col h-full gap-4">
      <TabsList class="w-full">
        <TabsTrigger value="recentChats">Recent Chats</TabsTrigger>
        <TabsTrigger value="online">Online</TabsTrigger>
        <TabsTrigger value="friends">Friends</TabsTrigger>
      </TabsList>
      <div class="h-full">
        <TabsContent value="recentChats">Recent Chats</TabsContent>
        <TabsContent value="online">Online</TabsContent>
        <TabsContent value="friends">Friends</TabsContent>
      </div>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>

<style scoped></style>
