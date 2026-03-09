<template>
  <div class="w-full h-full flex items-center justify-center">
    <form class="w-full max-w-2xl flex items-center" @submit="onSubmit">
      <FieldGroup>
        <FieldSet>
          <FieldLegend> Profile Settings </FieldLegend>
          <FieldDescription>
            Update your profile information, including display name, bio, and message of the day.
          </FieldDescription>
        </FieldSet>
        <VeeField name="displayName" v-slot="{ field, errors }">
          <Field>
            <FieldLabel>Display Name</FieldLabel>
            <Input v-bind="field" :aria-invalid="!!errors.length" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <VeeField name="bio" v-slot="{ field, errors }">
          <Field>
            <FieldLabel>Bio</FieldLabel>
            <Textarea v-bind="field" :aria-invalid="!!errors.length" class="h-32" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <VeeField name="motd" v-slot="{ field, errors }">
          <Field>
            <FieldLabel>Message of the Day</FieldLabel>
            <Textarea v-bind="field" :aria-invalid="!!errors.length" class="h-22" />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>
        <Field orientation="vertical">
          <Button type="submit" class="w-full"> Save </Button>
          <Button type="button" variant="outline" class="w-full" @click="router.back()">
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Field as VeeField, useForm } from 'vee-validate'
import { Input } from '@/components/ui/input'
import { onMounted, ref, watch } from 'vue'
import type { components } from '@/types/dtos.ts'
import { useUserService } from '@/composables/services/useUserService.ts'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user.ts'
import router from '@/router'

const userProfile = ref<components['schemas']['Profile'] | null>(null)

onMounted(async () => {
  userProfile.value = await useUserService().getMyProfile()
})

const zodSchema = z.object({
  displayName: z.string().min(1, 'Display Name is required'),
  bio: z.string().max(255, 'Must be at most 255 characters'),
  motd: z.string().max(128, 'Must be at most 255 characters'),
})

const { handleSubmit, setValues } = useForm({
  validationSchema: toTypedSchema(zodSchema),
})

watch(
  () => userProfile.value,
  () => {
    if (userProfile.value) {
      setValues({
        displayName: userProfile.value.displayName,
        bio: userProfile.value.bio || '',
        motd: userProfile.value.motd || '',
      })
    }
  },
)

const onSubmit = handleSubmit(async (values) => {
  try {
    const updatedUser = await useUserService().updateMyProfile(values)
    useUserStore().setUser(updatedUser)
    router.back()
  } catch (error) {
    console.error('Failed to update profile', error)
    alert('Failed to update profile')
  }
})
</script>

<style scoped></style>
