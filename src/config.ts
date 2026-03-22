interface AppConfig {
  apiUrl: string
}

declare global {
  interface Window {
    __APP_CONFIG__: AppConfig
  }
}

function getConfig(): AppConfig {
  const raw = window.__APP_CONFIG__

  if (!raw) {
    throw new Error('App config not loaded. Ensure config.js is included in index.html')
  }

  if (!raw.apiUrl) {
    throw new Error('Missing required config value: apiUrl')
  }

  return {
    apiUrl: raw.apiUrl,
  }
}

export const config = getConfig()
