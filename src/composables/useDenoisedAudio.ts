export interface DenoisedAudio {
  stream: MediaStream
  /** Tune suppression aggressiveness. Range 0–1, default 0.5.
   *  Lower = more aggressive (kills more noise, may cut quiet speech).
   *  Higher = less aggressive (lets more through). */
  setVadThreshold: (threshold: number) => void
}

export async function useDenoisedAudio(): Promise<DenoisedAudio> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  })

  const audioContext = new AudioContext()

  // 1. Load worklet
  await audioContext.audioWorklet.addModule('/rnnoise-worklet.js')

  // 2. Create source
  const source = audioContext.createMediaStreamSource(stream)

  // 3. Create RNNoise node
  const rnnoiseNode = new AudioWorkletNode(audioContext, 'rnnoise-processor')

  // 4. Destination
  const destination = audioContext.createMediaStreamDestination()

  // 5. Connect graph
  source.connect(rnnoiseNode).connect(destination)

  return {
    stream: destination.stream,
    setVadThreshold: (threshold: number) => {
      rnnoiseNode.port.postMessage({ vadThreshold: threshold })
    },
  }
}
