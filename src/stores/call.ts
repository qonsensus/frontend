import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

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

export type CallState = 'none' | 'in-call'

export const useCallStore = defineStore('CallStore', () => {
  const callState = ref<CallState>('none')
  const peers = ref<Map<string, Peer>>(new Map())
  const isVoiceOn = ref(true)
  const isVideoOn = ref(false)
  const isScreenShareOn = ref(false)

  function setCallState(state: CallState) {
    callState.value = state
  }

  function getPeer(socketId: string): Peer | undefined {
    return peers.value.get(socketId)
  }

  function addPeer(peer: Peer) {
    peers.value.set(peer.socketId, peer)
  }

  function removePeer(peer: Peer) {
    peers.value.delete(peer.socketId)
  }

  function muteVoice() {
    isVoiceOn.value = false
  }

  function unmuteVoice() {
    isVoiceOn.value = true
  }

  function enableVideo() {
    isVideoOn.value = true
  }

  function disableVideo() {
    isVideoOn.value = false
  }

  function enableScreenShare() {
    isScreenShareOn.value = true
  }

  function disableScreenShare() {
    isScreenShareOn.value = false
  }

  function getLocalPeer(): Peer | undefined {
    return Array.from(peers.value.values()).find((peer) => peer.isLocal)
  }

  function setLocalVideoStream(stream: MediaStream) {
    const localPeer = getLocalPeer()
    if (localPeer) {
      localPeer.videoStream = stream
    }
  }

  function setLocalScreenStream(stream: MediaStream) {
    const localPeer = getLocalPeer()
    if (localPeer) {
      localPeer.screenStream = stream
    }
  }

  function removeLocalVideoStream() {
    const localPeer = getLocalPeer()
    if (localPeer && localPeer.videoStream) {
      localPeer.videoStream.getTracks().forEach((track) => track.stop())
      localPeer.videoStream = undefined
    }
  }

  function removeLocalScreenStream() {
    const localPeer = getLocalPeer()
    if (localPeer && localPeer.screenStream) {
      localPeer.screenStream.getTracks().forEach((track) => track.stop())
      localPeer.screenStream = undefined
    }
  }

  function resetState() {
    callState.value = 'none'
    peers.value.clear()
    isVoiceOn.value = true
    isVideoOn.value = false
    isScreenShareOn.value = false
  }

  function toggleVoice() {
    isVoiceOn.value = !isVoiceOn.value
  }

  function toggleVideo() {
    isVideoOn.value = !isVideoOn.value
  }

  function toggleScreenShare() {
    isScreenShareOn.value = !isScreenShareOn.value
  }

  return {
    callState: readonly(callState),
    peers: readonly(peers),
    isVoiceOn: readonly(isVoiceOn),
    isVideoOn: readonly(isVideoOn),
    isScreenShareOn: readonly(isScreenShareOn),
    setCallState,
    getPeer,
    addPeer,
    removePeer,
    muteVoice,
    unmuteVoice,
    enableVideo,
    disableVideo,
    enableScreenShare,
    disableScreenShare,
    setLocalVideoStream,
    setLocalScreenStream,
    removeLocalVideoStream,
    removeLocalScreenStream,
    resetState,
    toggleVoice,
    toggleVideo,
    toggleScreenShare,
  }
})
