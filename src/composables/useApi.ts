import { createFetch } from '@vueuse/core'

export function useApi(authenticatedClient: boolean = false) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const sharedHeaders = {
    'Content-Type': 'application/json',
  }
  return createFetch({
    baseUrl: apiUrl,
    options: {
      async beforeFetch({ options }) {
        if (!authenticatedClient) {
          options.headers = {
            ...options.headers,
            ...sharedHeaders,
          }
          return { options }
        }
        const token = localStorage.getItem('token')
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
