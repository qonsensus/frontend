import { createFetch } from '@vueuse/core'

export function useApi(authenticatedClient: boolean = false) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return createFetch({
    baseUrl: apiUrl,
    options: {
      async beforeFetch({ options }) {
        if (authenticatedClient) return { options }
        const token = localStorage.getItem('token')
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          }
        }
        return { options }
      },
    },
  })
}
