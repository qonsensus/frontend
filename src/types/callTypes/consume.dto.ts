import type { RtpCapabilities } from 'mediasoup-client/types'

export interface ConsumeDto {
  roomId: string
  transportId: string
  producerId: string
  rtpCapabilities: RtpCapabilities
}
