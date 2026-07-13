import type { Producer } from 'mediasoup-client/types'
import type { components } from '@/types/dtos.ts'

export interface PeerDto {
  socketId: string
  userProfile: components['schemas']['Profile']
  producers: Map<string, Producer>
}
