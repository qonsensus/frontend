<template>
  <form @submit="onSubmit" class="w-full max-w-lg">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription> Please enter your credentials to login to your account.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <VeeField name="email" v-slot="{ field, errors }">
          <Field :data-invalid="!!errors.length">
            <FieldLabel>Email</FieldLabel>
            <Input type="email" v-bind="field" :disabled="loading" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <VeeField name="password" v-slot="{ field, errors }">
          <Field :data-invalid="!!errors.length">
            <FieldLabel>Password</FieldLabel>
            <Input type="password" v-bind="field" :disabled="loading" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
      </CardContent>
      <CardFooter class="flex flex-col gap-2">
        <Button class="w-full" type="submit" :disabled="loading"> Login </Button>
        <Button variant="outline" type="button" class="w-full" :disabled="loading" as-child>
          <RouterLink to="/register">Don't have an account? Register</RouterLink>
        </Button>
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
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { ref } from 'vue'
import type { components } from '@/types/dtos.ts'
import router from '@/router'
import { useApi } from '@/composables/utils/useApi.ts'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import { useUserStore } from '@/stores/user.ts'

const loading = ref(false)

const schema = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    email: '',
    password: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  const client = useApi()
  console.log(values)
  const { data } = await client('/auth/login', {
    method: 'POST',
    body: JSON.stringify(values),
  }).json<components['schemas']['TokenPair']>()
  if (data.value?.accessToken) {
    useAuthToken().setToken(data.value.accessToken)
  }
  await useUserStore().fetchUser()
  loading.value = false
  await router.push('/')
})
</script>
