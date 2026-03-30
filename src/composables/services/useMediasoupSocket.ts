import { io, type Socket } from 'socket.io-client'
import { config } from '@/config.ts'
import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import {
  type Consumer,
  type Producer,
  type RtpCapabilities,
  type Transport,
} from 'mediasoup-client/types'
import { Device } from 'mediasoup-client'
import { onUnmounted, type Ref, type InjectionKey, watch } from 'vue'
import { useDenoisedAudio } from '@/composables/useDenoisedAudio.ts'
import { useCallStore } from '@/stores/call.ts'
import { storeToRefs } from 'pinia'

interface JoinRoomAck {
  rtpCapabilities: RtpCapabilities
  existingProducers: { producerId: string; socketId: string; kind: string }[]
}

export interface Peer {
  socketId: string
  isLocal: boolean
  audioProducerId?: string
  videoProducerId?: string
  screenProducerId?: string
  audioStream?: MediaStream
  videoStream?: MediaStream
  screenStream?: MediaStream
}

export type MediasoupSocket = ReturnType<typeof useMediasoupSocket>
export const mediasoupKey: InjectionKey<MediasoupSocket> = Symbol('mediasoup')

export function useMediasoupSocket(roomId: Ref<string> | string) {
  const resolvedRoomId = typeof roomId === 'string' ? roomId : roomId.value

  // Reactive state
  const { peers, isVoiceOn, isVideoOn, isScreenShareOn } = storeToRefs(useCallStore())
  const callStore = useCallStore()

  // Internal state (non-reactive)
  let socket: Socket | null = null
  let device: Device | null = null
  let sendTransport: Transport | null = null
  let recvTransport: Transport | null = null
  let audioProducer: Producer | null = null
  let videoProducer: Producer | null = null
  let screenShareProducer: Producer | null = null
  const consumers = new Map<string, Consumer>()

  async function connect() {
    callStore.resetState()
    socket = io(`${config.apiUrl}/mediasoup`, {
      transports: ['websocket'],
      auth: {
        token: useAuthToken().getToken(),
      },
    })

    device = new Device()

    const joinAck: JoinRoomAck = await socket.emitWithAck('joinRoom', { roomId: resolvedRoomId })
    await device.load({ routerRtpCapabilities: joinAck.rtpCapabilities })

    const sendOpts = await socket.emitWithAck('createTransport', { roomId: resolvedRoomId })
    const recvOpts = await socket.emitWithAck('createTransport', { roomId: resolvedRoomId })

    sendTransport = device.createSendTransport(sendOpts)
    recvTransport = device.createRecvTransport(recvOpts)

    sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      await socket!
        .emitWithAck('connectTransport', {
          roomId: resolvedRoomId,
          transportId: sendTransport!.id,
          dtlsParameters,
        })
        .then(callback)
        .catch(errback)
    })

    recvTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      await socket!
        .emitWithAck('connectTransport', {
          roomId: resolvedRoomId,
          transportId: recvTransport!.id,
          dtlsParameters,
        })
        .then(callback)
        .catch(errback)
    })

    sendTransport.on('produce', async ({ kind, rtpParameters, appData }, callback) => {
      const { producerId } = await socket!.emitWithAck('produce', {
        roomId: resolvedRoomId,
        transportId: sendTransport!.id,
        kind,
        rtpParameters,
        appData,
      })
      callback({ id: producerId })
    })

    const { stream: denoisedStream, setVadThreshold } = await useDenoisedAudio()
    setVadThreshold(0.6)
    const track = denoisedStream.getAudioTracks()[0]
    audioProducer = await sendTransport.produce({ track })

    // Listen for new producers from other peers
    socket.on(
      'newProducer',
      async ({ producerId, socketId }: { producerId: string; socketId: string }) => {
        await consume(producerId, socketId)
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

    // Consume existing producers
    for (const { producerId, socketId } of joinAck.existingProducers) {
      await consume(producerId, socketId)
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
  }

  async function consume(producerId: string, socketId: string) {
    if (!recvTransport || !socket || !device) return

    const params = await socket.emitWithAck('consume', {
      roomId: resolvedRoomId,
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
      roomId: resolvedRoomId,
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
        peer.screenProducerId = producerId
        peer.screenStream = new MediaStream()
        peer.screenStream.addTrack(consumer.track)
      } else {
        console.warn(`Unknown producer source "${source}" for producer ${producerId}`)
        console.warn('Consumer:', consumer)
      }
    }
  }

  // region Voice

  watch(isVoiceOn, (newVal) => {
    if (newVal) void unmute()
    else void mute()
  })

  async function mute() {
    console.log('mute')
    if (!audioProducer) return
    audioProducer.pause()
    console.log(audioProducer)
  }

  async function unmute() {
    console.log('unmute')
    if (!audioProducer) return
    audioProducer.resume()
    console.log(audioProducer)
  }

  // endregion

  // region Video

  watch(isVideoOn, (newVal) => {
    if (newVal) void startVideo()
    else void stopVideo()
  })

  async function startVideo() {
    if (!sendTransport) return
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: { aspectRatio: { ideal: 16 / 9 } },
    })
    callStore.setLocalVideoStream(videoStream)
    const vp9Codec = device!.recvRtpCapabilities.codecs?.find(
      (c) => c.mimeType.toLowerCase() === 'video/vp9',
    )
    videoProducer = await sendTransport.produce({
      track: videoStream.getVideoTracks()[0],
      ...(vp9Codec ? { codec: vp9Codec } : {}),
      appData: {
        source: 'camera',
      },
    })
  }

  async function stopVideo() {
    if (!videoProducer) return
    videoProducer.close()
    videoProducer = null
    callStore.removeLocalVideoStream()
  }

  // endregion

  // region Screen Share

  watch(isScreenShareOn, (newVal) => {
    if (newVal) void startScreenShare()
    else void stopScreenShare()
  })

  async function startScreenShare() {
    if (!sendTransport) return
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 },
        frameRate: { ideal: 60, max: 60 },
      },
    })
    const screenTrack = screenStream.getVideoTracks()[0]
    if (!screenTrack) {
      screenStream.getTracks().forEach((t) => t.stop())
      return
    }
    callStore.setLocalScreenStream(screenStream)
    const vp9Codec = device!.recvRtpCapabilities.codecs?.find(
      (c) => c.mimeType.toLowerCase() === 'video/vp9',
    )
    if (!vp9Codec) throw new Error('VP9 codec not supported by the mediasoup router')
    screenShareProducer = await sendTransport.produce({
      track: screenTrack,
      codec: vp9Codec,
      encodings: [
        {
          maxBitrate: 5_000_000, // 5 Mbps ceiling
          maxFramerate: 60,
          scaleResolutionDownBy: 1, // explicit 1:1 — mediasoup won't scale further; the 1080p cap is applied at capture
          priority: 'high',
          networkPriority: 'high',
        },
      ],
      codecOptions: {
        videoGoogleStartBitrate: 2000, // start at 2 Mbps instead of the default ~300 kbps
        videoGoogleMaxBitrate: 5000, // kbps
        videoGoogleMinBitrate: 1000, // kbps — prevents the bitrate dropping too low
      },
    })
    // Handle the user clicking the browser's native "Stop sharing" button
    screenTrack.addEventListener('ended', () => {
      stopScreenShare()
    })
  }

  async function stopScreenShare() {
    if (!screenShareProducer) return
    screenShareProducer.close()
    screenShareProducer = null
    callStore.removeLocalScreenStream()
  }

  // endregion

  function disconnect() {
    // Close all consumers
    for (const consumer of consumers.values()) {
      consumer.close()
    }
    consumers.clear()

    // Close producers
    audioProducer?.close()
    audioProducer = null
    videoProducer?.close()
    videoProducer = null
    screenShareProducer?.close()
    screenShareProducer = null

    // Stop local media tracks
    callStore.removeLocalScreenStream()
    callStore.removeLocalVideoStream()

    // Close transports
    sendTransport?.close()
    sendTransport = null
    recvTransport?.close()
    recvTransport = null

    // Disconnect socket
    socket?.disconnect()
    socket = null
    device = null

    callStore.resetState()
  }

  // Auto-cleanup when the component using this composable is unmounted
  onUnmounted(() => {
    disconnect()
  })

  return {
    connect,
    disconnect,
  }
}
