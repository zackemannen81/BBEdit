import React, { useState } from 'react';
import AudioEngine from './audio/AudioEngine';
import Waveform from './components/Waveform';
import './App.css';

const audioEngine = new AudioEngine();

export default function App() {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const buffer = await audioEngine.loadAudioFile(file);
      setAudioBuffer(buffer);
    }
  };

  return (
    <div>
      <h1>Beat Blaster Level Editor</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <Waveform audioBuffer={audioBuffer} />
    </div>
  );
}
