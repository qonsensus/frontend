<template>
  <div class="h-full w-full p-4 gap-4">
    <InputGroup>
      <InputGroupInput placeholder="Search" class="flex-1" />
      <InputGroupAddon addonType="append">
        <Search />
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
</script>

<style scoped></style>
