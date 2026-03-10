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

  async function getByHandle(handle: string): Promise<components['schemas']['Profile']> {
    const client = useApi(true)
    const urlParsedHandle = encodeURIComponent(handle)
    const { data } = await client(`/profile/by-handle?handle=${urlParsedHandle}`)
      .get()
      .json<components['schemas']['Profile']>()
    if (!data.value) throw new Error('No profile data')
    return data.value
  }

  async function handleExists(handle: string): Promise<boolean> {
    const client = useApi(true)
    const urlParsedHandle = encodeURIComponent(handle)
    const { data } = await client(`/profile/handle/exists?handle=${urlParsedHandle}`)
      .get()
      .json<components['schemas']['HandleExistsResponseDto']>()
    if (!data.value) throw new Error('No handle exists data')
    return data.value.exists
  }

  return {
    getMyProfile,
    updateMyProfile,
    getByHandle,
    handleExists,
  }
}
