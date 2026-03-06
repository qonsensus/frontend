<template>
  <form @submit="onSubmit" class="w-full max-w-lg">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription> Please enter your credentials to login to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid w-full items-center gap-4">
          <FieldGroup label="Email" name="email">
            <VeeField name="email" v-slot="{ field, errors }">
              <Field :data-invalid="!!errors.length">
                <FieldLabel>Email</FieldLabel>
                <Input type="email" v-bind="field" />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>
          <FieldGroup label="Password" name="password">
            <VeeField name="password" v-slot="{ field, errors }">
              <Field :data-invalid="!!errors.length">
                <FieldLabel>Password</FieldLabel>
                <Input type="password" v-bind="field" />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>
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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

const schema = z.object({
  email: z.string().email('Must be a valid email address'),
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  password: z
    .string()
    .min(8)
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number')
    .regex(/(?=.*[!@#$%^&*()_+{}:"<>?])/, 'Password must contain at least one special character'),
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
