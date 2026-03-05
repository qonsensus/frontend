<template>
  <form @submit="onSubmit" class="w-full max-w-lg">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription> Please enter your credentials to login to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <VeeField name="email" v-slot="{ field, errors }" class="flex flex-col space-y-1.5">
              <Label for="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" v-bind="field" />
            </VeeField>
          </div>
          <div class="flex flex-col space-y-1.5">
            <VeeField name="password" v-slot="{ field, errors }">
              <Label for="password">Password</Label>
              <Input id="password" type="password" placeholder="********" v-bind="field" />
            </VeeField>
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex flex-col gap-2">
        <Button class="w-full"> Login</Button>
        <Button variant="outline" class="w-full"> Login with Google</Button>
      </CardFooter>
    </Card>
  </form>
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
import * as z from 'zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { FieldGroup } from '@/components/ui/field'

const schema = z.object({
  email: z.string().email(),
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  password: z
    .string()
    .min(8)
    .regex(/(?=.*[a-z])/)
    .regex(/(?=.*[A-Z])/)
    .regex(/(?=.*\d)/)
    .regex(/(?=.*[!@#$%^&*()_+{}:"<>?])/),
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    email: '',
    password: '',
  },
})

const onSubmit = handleSubmit((values) => {
  console.log(values)
})
</script>
