
import React from 'react';
import Waveform from './Waveform';

interface TimelineViewProps {
  audioBuffer: AudioBuffer | null;
  children: React.ReactNode;
}

const TimelineView: React.FC<TimelineViewProps> = ({ audioBuffer, children }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '150px' }}>
      <Waveform audioBuffer={audioBuffer} />
      {children}
    </div>
  );
};

export default TimelineView;
