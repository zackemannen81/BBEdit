import React, { useState } from 'react';
import AudioEngine from './audio/AudioEngine';
import TimelineView from './components/TimelineView';
import BeatScrubber from './components/BeatScrubber';
import './App.css';

const audioEngine = new AudioEngine();

export default function App() {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [scrubberPosition, setScrubberPosition] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const buffer = await audioEngine.loadAudioFile(file);
      setAudioBuffer(buffer);
    }
  };

  // TODO: Implement dragging logic for the scrubber

  return (
    <div>
      <h1>Beat Blaster Level Editor</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <TimelineView audioBuffer={audioBuffer}>
        <BeatScrubber position={scrubberPosition} />
      </TimelineView>
    </div>
  );
}
