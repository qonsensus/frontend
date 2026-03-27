import { io } from 'socket.io-client'
import { config } from '@/config.ts'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import { type RtpCapabilities } from 'mediasoup-client/types'
import { Device } from 'mediasoup-client'

interface JoinRoomAck {
  rtpCapabilities: RtpCapabilities
  existingProducers: { producerId: string; socketId: string }[]
}

export async function useMediasoupSocket(roomId: string) {
  const socket = io(`${config.apiUrl}/mediasoup`, {
    transports: ['websocket'],
    auth: {
      token: useAuthToken().getToken(),
    },
  })
  const device = new Device()

  const ack: JoinRoomAck = await socket.emitWithAck('joinRoom', { roomId })
  await device.load({ routerRtpCapabilities: ack.rtpCapabilities })

  const sentOpts = await socket.emitWithAck('createWebRtcTransport', { roomId })
  const recvOpts = await socket.emitWithAck('createWebRtcTransport', { roomId })

  const sendTransport = device.createSendTransport(sentOpts)
  const recvTransport = device.createRecvTransport(recvOpts)

  sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
    await socket
      .emitWithAck('connectTransport', { roomId, transportId: sendTransport.id, dtlsParameters })
      .then(callback)
      .catch(errback)
  })

  recvTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
    await socket
      .emitWithAck('connectTransport', { roomId, transportId: recvTransport.id, dtlsParameters })
      .then(callback)
      .catch(errback)
  })

  sendTransport.on('produce', async ({ kind, rtpParameters }, callback) => {
    const { producerId } = await socket.emitWithAck('produce', {
      roomId,
      transportId: sendTransport.id,
      kind,
      rtpParameters,
    })
    callback({ id: producerId })
  })

  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  await sendTransport.produce({ track: stream.getVideoTracks()[0] })
  await sendTransport.produce({ track: stream.getAudioTracks()[0] })

  async function consume(producerId: string, videoEl: HTMLVideoElement) {
    const params = await socket.emitWithAck('consume', {
      roomId,
      transportId: recvTransport.id,
      producerId,
      rtpCapabilities: device.recvRtpCapabilities,
    })
    const consumer = await recvTransport.consume(params)
    videoEl.srcObject = new MediaStream([consumer.track])
    await socket.emitWithAck('resumeConsumer', { roomId, consumerId: params.consumerId })
  }

  // Consume existing producers when joining
  for (const { producerId, socketId } of ack.existingProducers) {
    // You would need to create video elements for each existing producer and call consume() here
    console.log(
      `Existing producer ${producerId} from socket ${socketId} - call consume() with appropriate video element`,
    )
  }

  return {
    socket,
    device,
    sendTransport,
    recvTransport,
    consume,
  }
}
