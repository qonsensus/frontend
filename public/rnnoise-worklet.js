import createRNNWasmModuleSync from '/rnnoise-sync.js'

const FRAME_SIZE = 480 // samples RNNoise C API expects per frame
const SCALE = 32768 // Web Audio is [-1,1]; RNNoise C API expects [-32768,32767]
const RING_SIZE = FRAME_SIZE * 4 // ring buffer large enough to avoid overruns

// Frames of silence to keep after voice stops (prevents clipping word endings)
const VOICE_HOLD_FRAMES = 8

class RNNoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this._mod = createRNNWasmModuleSync()
    this._state = this._mod._rnnoise_create()
    this._bufPtr = this._mod._malloc(FRAME_SIZE * 4)

    // Input ring buffer: accumulate until we have FRAME_SIZE samples
    this._inRing = new Float32Array(RING_SIZE)
    this._inWrite = 0
    this._inRead = 0
    this._inCount = 0

    // Output ring buffer: hold processed samples until the output channel drains them
    this._outRing = new Float32Array(RING_SIZE)
    this._outWrite = 0
    this._outRead = 0
    this._outCount = 0

    // Reusable temp frame to avoid per-callback allocations in the audio thread
    this._tmpFrame = new Float32Array(FRAME_SIZE)

    // VAD gate: threshold 0–1, lower = more aggressive suppression
    this._vadThreshold = 0.5
    this._voiceHoldFrames = 0 // countdown to keep output open after voice stops

    // Allow the main thread to adjust the threshold at runtime
    this.port.onmessage = (e) => {
      if (e.data?.vadThreshold !== undefined) {
        this._vadThreshold = Math.max(0, Math.min(1, e.data.vadThreshold))
      }
    }
  }

  _inPush(sample) {
    this._inRing[this._inWrite] = sample
    this._inWrite = (this._inWrite + 1) % RING_SIZE
    this._inCount++
  }

  _inPop() {
    const s = this._inRing[this._inRead]
    this._inRead = (this._inRead + 1) % RING_SIZE
    this._inCount--
    return s
  }

  _outPush(sample) {
    this._outRing[this._outWrite] = sample
    this._outWrite = (this._outWrite + 1) % RING_SIZE
    this._outCount++
  }

  _outPop() {
    const s = this._outRing[this._outRead]
    this._outRead = (this._outRead + 1) % RING_SIZE
    this._outCount--
    return s
  }

  process(inputs, outputs) {
    const inputChannel = inputs[0]?.[0]
    const outputChannel = outputs[0]?.[0]
    if (!inputChannel || !outputChannel) return true

    const mod = this._mod
    const heapF32 = mod.HEAPF32
    const bufOffset = this._bufPtr >> 2
    const tmpFrame = this._tmpFrame

    // Push all incoming samples (scaled) into the input ring
    for (let i = 0; i < inputChannel.length; i++) {
      this._inPush(inputChannel[i] * SCALE)
    }

    // Process as many full FRAME_SIZE frames as are available
    while (this._inCount >= FRAME_SIZE) {
      for (let i = 0; i < FRAME_SIZE; i++) {
        tmpFrame[i] = this._inPop()
      }
      heapF32.set(tmpFrame, bufOffset)

      // Returns voice activity probability [0, 1]
      const voiceProb = mod._rnnoise_process_frame(this._state, this._bufPtr, this._bufPtr)

      const isVoice = voiceProb >= this._vadThreshold
      if (isVoice) {
        this._voiceHoldFrames = VOICE_HOLD_FRAMES
      } else if (this._voiceHoldFrames > 0) {
        this._voiceHoldFrames--
      }

      const pass = this._voiceHoldFrames > 0
      for (let i = 0; i < FRAME_SIZE; i++) {
        this._outPush(pass ? heapF32[bufOffset + i] / SCALE : 0)
      }
    }

    // Drain output ring into the output channel
    for (let i = 0; i < outputChannel.length; i++) {
      outputChannel[i] = this._outCount > 0 ? this._outPop() : 0
    }

    return true
  }
}

registerProcessor('rnnoise-processor', RNNoiseProcessor)
