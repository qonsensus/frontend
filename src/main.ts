import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'

import App from './App.vue'
import router from './router'
import { useColorMode } from '@vueuse/core'

const app = createApp(App)

app.use(createPinia())
app.use(router)

await router.isReady()

const mode = useColorMode()
mode.value = 'dark'

app.mount('#app')
