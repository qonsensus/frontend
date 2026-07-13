import type { DtlsParameters } from 'mediasoup-client/types'

export interface ConnectTransportDto {
  roomId: string
  transportId: string
  dtlsParameters: DtlsParameters
}
