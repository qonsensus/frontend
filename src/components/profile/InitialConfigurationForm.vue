<template>
  <form class="w-full flex items-center justify-center" @submit="onSubmit">
    <Card class="w-full max-w-4xl">
      <CardHeader>
        <CardTitle> Welcome to Quonsensus! </CardTitle>
        <CardDescription>
          Feel free to edit the fields below to customize your profile. You can always change these
          later in your profile settings.
        </CardDescription>
      </CardHeader>
      <CardContent class="w-full flex flex-col gap-4">
        <VeeField name="displayName" v-slot="{ field, errors }">
          <Field>
            <FieldLabel>Display name</FieldLabel>
            <Input v-bind="field" :data-invalid="!!errors.length" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <VeeField name="bio" v-slot="{ field, errors }">
          <Field>
            <FieldLabel>Bio</FieldLabel>
            <Textarea
              class="resize-none h-24"
              v-bind="field"
              :data-invalid="!!errors.length"
              placeholder="A short description about yourself that will be displayed on your profile."
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <VeeField name="motd" v-slot="{ field, errors }">
          <Field>
            <FieldLabel>MOTD</FieldLabel>
            <Textarea
              v-bind="field"
              :data-invalid="!!errors.length"
              placeholder="What's currently on your mind?"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
      </CardContent>
      <CardFooter class="w-full flex flex-col gap-2">
        <Button class="w-full" type="submit"> Save </Button>
        <Button class="w-full" type="button" variant="outline"> Skip for now </Button>
      </CardFooter>
    </Card>
  </form>
</template>

<script setup lang="ts">
import type { components } from '@/types/dtos.ts'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field as VeeField } from 'vee-validate'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { watch } from 'vue'
import { Button } from '@/components/ui/button'
import { useUserService } from '@/composables/services/useUserService.ts'
import router from '@/router'

const props = defineProps<{
  profile: components['schemas']['Profile'] | null
}>()

const zodSchema = z.object({
  bio: z.string().max(255),
  displayName: z
    .string()
    .min(4, 'Must be at least 4 characters long')
    .max(64, 'Must be at most 64 characters long'),
  motd: z.string().max(128, 'Must be at most 128 characters long'),
})

const { handleSubmit, setValues } = useForm({
  validationSchema: toTypedSchema(zodSchema),
  initialValues: {
    bio: props.profile?.bio ?? '',
    displayName: props.profile?.displayName ?? '',
    motd: props.profile?.motd ?? '',
  },
})

watch(
  () => props.profile,
  (newProfile) => {
    if (newProfile) {
      setValues({
        bio: newProfile.bio ?? '',
        displayName: newProfile.displayName ?? '',
        motd: newProfile.motd ?? '',
      })
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit(async (values) => {
  const { updateMyProfile } = useUserService()
  await updateMyProfile(values)
  await router.push('/')
})
</script>

<style scoped></style>
