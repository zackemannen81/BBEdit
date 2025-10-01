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

  static detectBeats(buffer: AudioBuffer): number[] {
    const data = buffer.getChannelData(0);
    const { sampleRate } = buffer;
    const beats: number[] = [];
    const chunkSize = 1024;
    const energyHistory: number[] = [];
    const historySize = 100; // Number of chunks to average over

    for (let i = 0; i < data.length; i += chunkSize) {
      let energy = 0;
      for (let j = 0; j < chunkSize; j += 1) {
        const sample = data[i + j] || 0;
        energy += sample * sample;
      }

      if (energyHistory.length > historySize) {
        energyHistory.shift();
      }
      energyHistory.push(energy);

      const averageEnergy =
        energyHistory.reduce((a, b) => a + b, 0) / energyHistory.length;
      const energyThreshold = averageEnergy * 1.5; // Sensitivity

      if (energy > energyThreshold) {
        const time = i / sampleRate;
        // Avoid detecting multiple beats too close together
        if (beats.length === 0 || time - beats[beats.length - 1] > 0.2) {
          beats.push(time);
        }
      }
    }

    return beats;
  }
}

export default AudioEngine;
