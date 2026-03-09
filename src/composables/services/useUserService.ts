import { useApi } from '@/composables/utils/useApi.ts'
import type { components } from '@/types/dtos.ts'

export function useUserService() {
  async function createUser(
    payload: components['schemas']['RegisterUserDto'],
  ): Promise<components['schemas']['RegistrationResponseDto']> {
    const client = useApi(false)
    const { data } = await client('/user')
      .post(payload)
      .json<components['schemas']['RegistrationResponseDto']>()
    if (!data.value) throw new Error('No registration response data')
    return data.value
  }

  return {
    createUser,
  }
}
