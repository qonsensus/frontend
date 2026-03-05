<template>
  <Card class="w-full max-w-lg">
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription> Please enter your credentials to login to your account.</CardDescription>
    </CardHeader>
    <form>
      <CardContent>
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div class="flex flex-col space-y-1.5">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a href="#" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
            </div>
            <Input id="password" type="password" />
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex flex-col gap-2">
        <Button class="w-full"> Login</Button>
        <Button variant="outline" class="w-full"> Login with Google</Button>
      </CardFooter>
    </form>
  </Card>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
</script>
