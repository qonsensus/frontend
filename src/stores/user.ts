import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { components } from '@/types/dtos.ts'
import { useUserService } from '@/composables/services/useUserService.ts'

export const useUserStore = defineStore('UserStore', () => {
  const user = ref<components['schemas']['Profile'] | null>(null)

  async function fetchUser() {
    const { getMyProfile } = useUserService()
    user.value = await getMyProfile()
  }

  return {
    user,
    fetchUser,
  }
})
