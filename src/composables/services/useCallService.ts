import { storeToRefs } from 'pinia'
import { useCallStore } from '@/stores/call.ts'
import { io, type Socket } from 'socket.io-client'
import { config } from '@/config.ts'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import { Device } from 'mediasoup-client'
import type { Consumer, Producer, Transport } from 'mediasoup-client/types'
import { useDenoisedAudio } from '@/composables/useDenoisedAudio.ts'
import type { JoinRoomResponseWsDto } from '@/types/callTypes/joinRoomResponseWs.dto.ts'

export function useCallService() {
  const { peers, isVoiceOn, isVideoOn, isScreenShareOn } = storeToRefs(useCallStore())
  const callStore = useCallStore()

  const consumers = new Map<string, Consumer>()

  let socket: Socket | null = null
  let device: Device | null = null
  let sendTransport: Transport | null = null
  let recvTransport: Transport | null = null
  let audioProducer: Producer | null = null
  const videoProducer: Producer | null = null
  const screenShareProducer: Producer | null = null

  async function connect(roomId: string | undefined) {
    // region Init

    callStore.resetState()

    // initialize socket connection
    socket = io(`${config.apiUrl}/call`, {
      transports: ['websocket'],
      auth: {
        token: useAuthToken().getToken(),
      },
    })

    // set a default room ID if none is provided
    if (!roomId) {
      roomId = crypto.randomUUID()
    }

    // init device
    device = new Device()

    // join room
    const joinAck: JoinRoomResponseWsDto = await socket.emitWithAck('joinRoom', { roomId })
    await device.load({ routerRtpCapabilities: joinAck.rtpCapabilities })

    const sendOpts = await socket.emitWithAck('createTransport', { roomId: roomId })
    const recvOpts = await socket.emitWithAck('createTransport', { roomId: roomId })

    sendTransport = device.createSendTransport(sendOpts)
    recvTransport = device.createRecvTransport(recvOpts)

    // endregion

    // region Transport events

    sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      await socket!
        .emitWithAck('connectTransport', {
          roomId: roomId,
          transportId: sendTransport!.id,
          dtlsParameters,
        })
        .then(callback)
        .catch(errback)
    })

    recvTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      await socket!
        .emitWithAck('connectTransport', {
          roomId: roomId,
          transportId: recvTransport!.id,
          dtlsParameters,
        })
        .then(callback)
        .catch(errback)
    })

    sendTransport.on('produce', async ({ kind, rtpParameters, appData }, callback) => {
      const { producerId } = await socket!.emitWithAck('produce', {
        roomId: roomId,
        transportId: sendTransport!.id,
        kind,
        rtpParameters,
        appData,
      })
      callback({ id: producerId })
    })

    // Listen for new producers from other peers
    socket.on(
      'newProducer',
      async ({ producerId, socketId }: { producerId: string; socketId: string }) => {
        await consume(producerId, socketId, roomId)
      },
    )

    // Listen for peer disconnection
    socket.on('peerLeft', ({ socketId }: { socketId: string }) => {
      const peer = peers.value.get(socketId)
      if (!peer) return

      // Close consumers associated with this peer
      if (peer.audioProducerId) {
        const consumer = consumers.get(peer.audioProducerId)
        if (consumer) {
          consumer.close()
          consumers.delete(peer.audioProducerId)
        }
      }
      if (peer.videoProducerId) {
        const consumer = consumers.get(peer.videoProducerId)
        if (consumer) {
          consumer.close()
          consumers.delete(peer.videoProducerId)
        }
      }
      if (peer.screenProducerId) {
        const consumer = consumers.get(peer.screenProducerId)
        if (consumer) {
          consumer.close()
          consumers.delete(peer.screenProducerId)
        }
      }

      callStore.removePeer(peer)
    })

    socket.on(
      'producerClosed',
      ({ producerId, socketId }: { producerId: string; socketId: string }) => {
        const peer = peers.value.get(socketId)
        if (!peer) return
        const consumer = consumers.get(producerId)
        if (!consumer) return
        if (consumer.kind === 'video') {
          const source = consumer.appData.source
          if (source === 'camera') {
            callStore.removeVideoStreamFromPeer(peer.socketId)
          } else if (source === 'screen') {
            callStore.removeScreenStreamFromPeer(peer.socketId)
          }
        }
        consumer.close()
        consumers.delete(producerId)
      },
    )

    // endregion

    // region Noise cancelling

    const { stream: denoisedStream, setVadThreshold } = await useDenoisedAudio()
    setVadThreshold(0.6)
    const track = denoisedStream.getAudioTracks()[0]
    audioProducer = await sendTransport.produce({ track })

    // endregion

    // region Consume existing

    for (const { producers, socketId } of joinAck.otherPeers) {
      for (const [_, producer] of producers) {
        await consume(producer.id, socketId, roomId)
      }
    }
    callStore.addPeer({
      socketId: socket.id! + ' (YOU)',
      isLocal: true,
      audioProducerId: undefined,
      videoProducerId: undefined,
      screenProducerId: undefined,
      audioStream: denoisedStream,
      videoStream: undefined,
      screenStream: undefined,
    })
    callStore.setCallState('in-call')

    // endregion
  }

  async function consume(producerId: string, socketId: string, roomId: string) {
    if (!recvTransport || !socket || !device) return

    const params = await socket.emitWithAck('consume', {
      roomId: roomId,
      transportId: recvTransport.id,
      producerId,
      rtpCapabilities: device.recvRtpCapabilities,
    })

    const consumer = await recvTransport.consume({
      id: params.consumerId,
      producerId: params.producerId,
      kind: params.kind,
      rtpParameters: params.rtpParameters,
      appData: params.appData,
    })
    consumers.set(producerId, consumer)

    await socket.emitWithAck('resumeConsumer', {
      roomId: roomId,
      consumerId: params.consumerId,
    })

    // Get or create remote peer entry
    let peer = callStore.getPeer(socketId)
    if (!peer) {
      callStore.addPeer({
        socketId,
        isLocal: false,
      })
      peer = callStore.getPeer(socketId)!
    }

    if (consumer.kind === 'audio') {
      peer.audioProducerId = producerId
      peer.audioStream = new MediaStream()
      peer.audioStream.addTrack(consumer.track)
    } else {
      const { source } = consumer.appData
      if (source === 'camera') {
        peer.videoProducerId = producerId
        peer.videoStream = new MediaStream()
        peer.videoStream.addTrack(consumer.track)
      } else if (source === 'screen') {
        console.log('Received screen share stream from peer', socketId)
        peer.screenProducerId = producerId
        peer.screenStream = new MediaStream()
        peer.screenStream.addTrack(consumer.track)
      } else {
        console.warn(`Unknown producer source "${source}" for producer ${producerId}`)
        console.warn('Consumer:', consumer)
      }
    }
  }
}
