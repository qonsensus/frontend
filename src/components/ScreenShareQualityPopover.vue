<template>
  <Popover v-model:open="open" class="mb-2">
    <PopoverTrigger>
      <slot :as-child="true" />
    </PopoverTrigger>
    <PopoverContent class="w-80 flex flex-col gap-4">
      <template v-if="!store.isScreenShareOn">
        <Select
          class="w-full"
          v-model="selectedSettings"
          label="Presets"
          :default-value="getPreset('standard')"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select a preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="getPreset('custom')">Custom</SelectItem>
            <SelectItem :value="getPreset('low')">Low (480p 30fps)</SelectItem>
            <SelectItem :value="getPreset('standard')">Standard (720p 30fps)</SelectItem>
            <SelectItem :value="getPreset('high')">High (1080p 30fps)</SelectItem>
          </SelectContent>
        </Select>
        <template v-if="selectedSettings && selectedSettings.isCustom">
          <Select v-model="selectedSettings.qualitySettings.fps" label="FPS">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select FPS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="30">30 fps</SelectItem>
              <SelectItem :value="60">60 fps</SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="selectedSettings.qualitySettings.resolution" label="Resolution">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select a resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="480">480p</SelectItem>
              <SelectItem :value="720">720p</SelectItem>
              <SelectItem :value="1080">1080p</SelectItem>
            </SelectContent>
          </Select>
          <div class="flex gap-2">
            <Select
              v-model="selectedSettings.qualitySettings.minBitrate"
              label="Min Bitrate (mbps)"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select bitrate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="1000">1000 mbps</SelectItem>
                <SelectItem :value="2000">2000 mbps</SelectItem>
                <SelectItem :value="3000">3000 mbps</SelectItem>
                <SelectItem :value="4000">4000 mbps</SelectItem>
                <SelectItem :value="5000">5000 mbps</SelectItem>
              </SelectContent>
            </Select>
            <Select
              v-model="selectedSettings.qualitySettings.maxBitrate"
              label="Max Bitrate (kbps)"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select bitrate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="1000">1000 mbit/s</SelectItem>
                <SelectItem :value="2000">2000 mbit/s</SelectItem>
                <SelectItem :value="3000">3000 mbit/s</SelectItem>
                <SelectItem :value="4000">4000 mbit/s</SelectItem>
                <SelectItem :value="5000">5000 mbit/s</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </template>
        <Button class="w-full" @click="startStream()"> Start </Button>
      </template>
      <Button v-else class="w-full" variant="destructive" @click="stopStream()"> Stop </Button>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCallStore } from '@/stores/call.ts'
import { ref } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { ScreenShareQualitySettings } from '@/composables/services/useMediasoupSocket.ts'

interface QualitySettings {
  fps: 30 | 60
  resolution: 480 | 720 | 1080
  minBitrate: 1000 | 2000 | 3000 | 4000 | 5000
  maxBitrate: 1000 | 2000 | 3000 | 4000 | 5000
  startBitrate: 1000 | 2000 | 3000 | 4000 | 5000
}

interface QualityPreset {
  name: string
  qualitySettings: QualitySettings
  isDefault: boolean
  isCustom: boolean
}

const open = ref<boolean>(false)
const store = useCallStore()
const emits = defineEmits<{
  (e: 'startStream'): void
}>()

const presets: QualityPreset[] = [
  {
    name: 'Low (480p 30fps)',
    isDefault: true,
    isCustom: false,
    qualitySettings: {
      fps: 30,
      maxBitrate: 2000,
      minBitrate: 1000,
      startBitrate: 1000,
      resolution: 480,
    },
  },
  {
    name: 'Standard (720p 30fps)',
    isDefault: true,
    isCustom: false,
    qualitySettings: {
      fps: 30,
      resolution: 720,
      maxBitrate: 3000,
      minBitrate: 1000,
      startBitrate: 1000,
    },
  },
  {
    name: 'High (1080p 30fps)',
    isDefault: true,
    isCustom: false,
    qualitySettings: {
      fps: 30,
      resolution: 1080,
      maxBitrate: 5000,
      minBitrate: 2000,
      startBitrate: 2000,
    },
  },
  {
    name: 'Custom',
    isDefault: true,
    isCustom: true,
    qualitySettings: {
      fps: 60,
      resolution: 1080,
      maxBitrate: 5000,
      minBitrate: 1000,
      startBitrate: 1000,
    },
  },
]

const selectedSettings = ref<QualityPreset>(getPreset('standard'))

function getPreset(preset: 'custom' | 'low' | 'standard' | 'high') {
  let result: QualityPreset | undefined = undefined
  switch (preset) {
    case 'low':
      result = presets[0]
      break
    case 'standard':
      result = presets[1]
      break
    case 'high':
      result = presets[2]
      break
    case 'custom':
      result = presets[3]
      break
  }
  if (result) {
    return result
  }
  throw new Error('Unknown preset')
}

function startStream() {
  const settings: ScreenShareQualitySettings = {
    fps: selectedSettings.value.qualitySettings.fps,
    maxBitrate: selectedSettings.value.qualitySettings.maxBitrate,
    minBitrate: selectedSettings.value.qualitySettings.minBitrate,
    startBitrate: selectedSettings.value.qualitySettings.startBitrate,
    width: 0,
    height: 0,
  }

  switch (selectedSettings.value.qualitySettings.resolution) {
    case 480:
      settings.width = 854
      settings.height = 480
      break
    case 720:
      settings.width = 1280
      settings.height = 720
      break
    case 1080:
      settings.width = 1920
      settings.height = 1080
      break
  }

  store.setScreenShareSettings(settings)
  emits('startStream')
  open.value = false
}

function stopStream() {
  store.disableScreenShare()
  open.value = false
}
</script>
