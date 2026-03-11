import { createRouter, createWebHistory } from 'vue-router'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/settings/profile',
      name: 'ProfileSettings',
      components: {
        default: () => import('@/views/settings/ProfileSettingsView.vue'),
        leftSidebar: () => import('@/components/layout/LeftSidebar.vue'),
      },
    },
    {
      path: '/',
      name: 'Home',
      components: {
        default: () => import('@/views/HomeView.vue'),
        leftSidebar: () => import('@/components/layout/LeftSidebar.vue'),
        leftSecondarySidebar: () => import('@/components/layout/LeftSecondaryHomeSidebar.vue'),
      },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: {
        noAuth: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: {
        noAuth: true,
      },
    },
    {
      path: '/profile/initial',
      name: 'InitialProfileConfiguration',
      component: () => import('@/views/InitialProfileConfigurationView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.noAuth) return
  const { isAuthenticated } = useAuthToken()
  if (!isAuthenticated() && to.path !== '/login')
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
})

export default router
