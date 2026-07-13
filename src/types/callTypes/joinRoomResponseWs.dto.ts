import type { RtpCapabilities } from 'mediasoup-client/types'
import type { PeerDto } from '@/types/callTypes/peer.dto.ts'

export interface JoinRoomResponseWsDto {
  rtpCapabilities: RtpCapabilities
  otherPeers: Omit<PeerDto, 'consumers' | 'transports'>[]
}
