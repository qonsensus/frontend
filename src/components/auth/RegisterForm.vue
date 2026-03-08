<template>
  <form class="w-full max-w-lg" @submit="onSubmit">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Please enter your details to create a new Qonsensus account.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <VeeField name="email" v-slot="{ field, errors }">
          <Field :data-invalid="!!errors.length">
            <FieldLabel>Email</FieldLabel>
            <Input type="email" v-bind="field" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <VeeField name="password" v-slot="{ field, errors }">
          <Field :data-invalid="!!errors.length">
            <FieldLabel>Password</FieldLabel>
            <Input type="password" v-bind="field" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <VeeField name="passwordConfirmation" v-slot="{ field, errors }">
          <Field :data-invalid="!!errors.length">
            <FieldLabel>Confirm Password</FieldLabel>
            <Input type="password" v-bind="field" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
      </CardContent>
      <CardFooter class="flex flex-col gap-2">
        <Button type="submit" class="w-full">Register</Button>
        <Button type="button" variant="outline" class="w-full" asChild>
          <RouterLink to="/login">Already have an account? Log in</RouterLink>
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>

<script setup lang="ts">
import type { components } from '@/types/dtos.ts'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useForm } from 'vee-validate'
import { FieldError, FieldLabel, Field } from '@/components/ui/field'
import { Field as VeeField } from 'vee-validate'
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import router from '@/router'
import { useApi } from '@/composables/utils/useApi.ts'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'

type RegisterUserDTO = components['schemas']['RegisterUserDto']

const zodSchema = z
  .object({
    email: z.string().email('Must be a valid email address'),
    password: z
      .string()
      .min(8, 'Must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[@$!%*?&]/, 'Must contain at least one special character'),
    passwordConfirmation: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords must match',
    path: ['passwordConfirmation'],
  })

const { handleSubmit } = useForm<RegisterUserDTO>({
  validationSchema: toTypedSchema(zodSchema),
  initialValues: {
    email: '',
    password: '',
    passwordConfirmation: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  const client = useApi()
  const { data } = await client('/user')
    .post(values)
    .json<components['schemas']['RegistrationResponseDto']>()
  if (!data.value?.tokenPair.accessToken) {
    console.error('Registration failed: No access token received')
    return
  }
  useAuthToken().setToken(data.value.tokenPair.accessToken)
  console.log('Auth State: ', useAuthToken().isAuthenticated())
  await router.push('/')
})
</script>

<style scoped></style>
