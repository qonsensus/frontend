import type { PeerDto } from '@/types/callTypes/peer.dto.ts'

export interface RoomDto {
  id: string
  peers: Map<string, PeerDto>
}
