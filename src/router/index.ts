import { createRouter, createWebHistory } from 'vue-router'
import { useAuthToken } from '@/composables/useAuthToken.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        noAuth: true,
      },
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.noAuth) return
  const { isAuthenticated } = useAuthToken()
  if (!isAuthenticated()) return '/login'
})

export default router
