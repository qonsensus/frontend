import type { RtpCapabilities } from 'mediasoup-client/types'
import type { OtherPeerDto } from '@/types/callTypes/peer.dto.ts'

export interface JoinRoomResponseWsDto {
  rtpCapabilities: RtpCapabilities
  otherPeers: OtherPeerDto[]
}
