import type { components } from '@/types/dtos.ts'
import { useApi } from '@/composables/utils/useApi.ts'

export function useAuthService() {
  async function login(
    payload: components['schemas']['LoginDto'],
  ): Promise<components['schemas']['TokenPair']> {
    const client = useApi(false)
    const { data } = await client('/auth/login')
      .post(payload)
      .json<components['schemas']['TokenPair']>()
    if (!data.value) throw new Error('No token pair data')
    return data.value
  }

  return { login }
}
