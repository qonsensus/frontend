import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'

import App from './App.vue'
import router from './router'
import { useColorMode } from '@vueuse/core'
import { useApplicationBootstrap } from '@/composables/utils/useApplicationBootstrap.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)

await router.isReady()

const mode = useColorMode()
mode.value = 'dark'

// bootstrap app data
await useApplicationBootstrap().catch((err) => {
  console.log('Error during application bootstrap:')
  console.log(err)
  throw err
})

app.mount('#app')
