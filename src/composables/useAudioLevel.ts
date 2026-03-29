import { ref, watch, onUnmounted, type Ref } from 'vue'

/**
 * Monitors the volume of a MediaStream and exposes a reactive `isTalking` ref
 * that becomes `true` when the RMS audio level exceeds the given threshold.
 *
 * @param threshold   - RMS value (0–1) above which the peer is considered "talking". Default: 0.01
 * @param smoothing   - AnalyserNode smoothingTimeConstant (0–1). Default: 0.8
 */
export function useAudioLevel(threshold = 0.01, smoothing = 0.8) {
  const isTalking = ref(false)

  let audioContext: AudioContext | null = null
  let analyser: AnalyserNode | null = null
  let source: MediaStreamAudioSourceNode | null = null
  let rafId: number | null = null
  let dataArray: Float32Array<ArrayBuffer> | null = null

  function start(mediaStream: MediaStream) {
    stop()

    if (mediaStream.getAudioTracks().length === 0) return

    audioContext = new AudioContext()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
    analyser.smoothingTimeConstant = smoothing

    source = audioContext.createMediaStreamSource(mediaStream)
    source.connect(analyser)

    dataArray = new Float32Array(analyser.fftSize)

    function tick() {
      if (!analyser || !dataArray) return

      analyser.getFloatTimeDomainData(dataArray)

      // Compute RMS (root mean square) volume
      let sumOfSquares = 0
      const buf = dataArray
      for (let i = 0; i < buf.length; i++) {
        sumOfSquares += (buf[i] as number) * (buf[i] as number)
      }
      const rms = Math.sqrt(sumOfSquares / buf.length)

      isTalking.value = rms > threshold
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    source?.disconnect()
    source = null
    analyser = null
    audioContext?.close()
    audioContext = null
    dataArray = null
    isTalking.value = false
  }

  onUnmounted(stop)

  return { isTalking, start }
}
