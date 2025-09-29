
class AudioEngine {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new AudioContext();
  }

  async loadAudioFile(file: File): Promise<AudioBuffer> {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }
}

export default AudioEngine;
