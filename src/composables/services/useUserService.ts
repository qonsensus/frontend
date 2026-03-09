import { useApi } from '@/composables/utils/useApi.ts'
import type { components } from '@/types/dtos.ts'

export function useUserService() {
  async function getMyProfile(): Promise<components['schemas']['Profile']> {
    const client = useApi(true)
    const { data } = await client('/user/me/profile').json<components['schemas']['Profile']>()
    if (!data.value) throw new Error('No profile data')
    return data.value
  }

  async function updateMyProfile(
    payload: components['schemas']['UpdateProfileDto'],
  ): Promise<components['schemas']['Profile']> {
    const client = useApi(true)
    const { data } = await client('/user/me/profile')
      .patch(payload)
      .json<components['schemas']['Profile']>()
    if (!data.value) throw new Error('No profile data')
    return data.value
  }

  return {
    getMyProfile,
    updateMyProfile,
  }
}
