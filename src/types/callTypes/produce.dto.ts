import type { MediaKind, RtpParameters } from 'mediasoup-client/types'

export interface ProduceDto {
  roomId: string
  transportId: string
  kind: MediaKind
  rtpParameters: RtpParameters
  appData: Record<string, unknown>
}
