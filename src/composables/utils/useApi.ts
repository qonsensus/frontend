import { createFetch } from '@vueuse/core'
import router from '@/router'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'

export function useApi(authenticatedClient: boolean = false) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const sharedHeaders = {
    'Content-Type': 'application/json',
  }
  return createFetch({
    baseUrl: apiUrl,
    options: {
      async onFetchError({ error, response }) {
        if (response?.status === 401) {
          useAuthToken().clearToken()
          await router.push('/login')
          throw error
        }
        throw error
      },
      async beforeFetch({ options }) {
        if (!authenticatedClient) {
          options.headers = {
            ...options.headers,
            ...sharedHeaders,
          }
          return { options }
        }
        const token = useAuthToken().getToken()
        if (token) {
          options.headers = {
            ...options.headers,
            ...sharedHeaders,
            Authorization: `Bearer ${token}`,
          }
        }
        return { options }
      },
    },
  })
}
