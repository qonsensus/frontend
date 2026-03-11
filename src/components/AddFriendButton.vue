<template>
  <Dialog>
    <DialogTrigger asChild>
      <Button size="icon">
        <UserPlus />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px] min-w-4xl">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4">
        <div class="grid gap-3">
          <Label for="name-1">Name</Label>
          <Input id="name-1" name="name" default-value="Pedro Duarte" />
        </div>
        <div class="grid gap-3">
          <Label for="username-1">Username</Label>
          <Input id="username-1" name="username" default-value="@peduarte" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline"> Cancel </Button>
        </DialogClose>
        <Button type="submit"> Save changes </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
</script>

<style scoped></style>
