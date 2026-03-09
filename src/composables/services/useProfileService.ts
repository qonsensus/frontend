import { useApi } from '@/composables/utils/useApi.ts'
import type { components } from '@/types/dtos.ts'

export function useProfileService() {
  async function getMyProfile() {
    const client = useApi(true)
    const { data } = await client('/profile/me').json()
    if (!data.value) throw new Error('No profile data')
    return data.value
  }

  async function updateMyProfile(payload: components['schemas']['UpdateProfileDto']) {
    const client = useApi(true)
    const { data } = await client('/profile/me').patch(payload).json()
    if (!data.value) throw new Error('No profile data')
    return data.value
  }

  return {
    getMyProfile,
    updateMyProfile,
  }
}
