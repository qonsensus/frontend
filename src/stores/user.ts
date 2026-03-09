import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { components } from '@/types/dtos.ts'
import { useProfileService } from '@/composables/services/useProfileService.ts'

export const useUserStore = defineStore('UserStore', () => {
  const user = ref<components['schemas']['Profile'] | null>(null)

  async function fetchUser() {
    const { getMyProfile } = useProfileService()
    user.value = await getMyProfile()
  }

  function setUser(profile: components['schemas']['Profile']) {
    user.value = profile
  }

  return {
    user,
    fetchUser,
    setUser,
  }
})
