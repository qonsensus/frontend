import type { DtlsParameters, IceCandidate, IceParameters } from 'mediasoup-client/types'
import type { IceCredsDto } from '@/types/callTypes/iceCreds.dto.ts'

export interface TransportOptionsDto {
  id: string
  iceParameters: IceParameters
  iceCandidates: IceCandidate[]
  dtlsParameters: DtlsParameters
  /** Pass these directly to the mediasoup-client Device / RTCPeerConnection */
  iceServers: IceCredsDto[] | null
}
