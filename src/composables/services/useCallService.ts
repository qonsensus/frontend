import { storeToRefs } from 'pinia'
import { useCallStore } from '@/stores/call.ts'
import { io, type Socket } from 'socket.io-client'
import { config } from '@/config.ts'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import { Device } from 'mediasoup-client'
import type { Producer, Transport } from 'mediasoup-client/types'
import type { components } from '@/types/dtos.ts'

export function useCallService() {
  const { peers, isVoiceOn, isVideoOn, isScreenShareOn } = storeToRefs(useCallStore())
  const callStore = useCallStore()

  let socket: Socket | null = null
  let device: Device | null = null
  const sendTransport: Transport | null = null
  const recvTransport: Transport | null = null
  const audioProducer: Producer | null = null
  const videoProducer: Producer | null = null
  const screenShareProducer: Producer | null = null

  async function connect(roomId: string) {
    callStore.resetState()

    // initialize socket connection
    socket = io(`${config.apiUrl}/call`, {
      transports: ['websocket'],
      auth: {
        token: useAuthToken().getToken(),
      },
    })

    // init device
    device = new Device()

    // join room
    const joinAck: components['schemas']['JoinRoomResponseWsDto'] = await socket.emitWithAck(
      'joinRoom',
      { roomId },
    )
    await device.load({ routerRtpCapabilities: joinAck.rtpCapabilities })
  }
}
