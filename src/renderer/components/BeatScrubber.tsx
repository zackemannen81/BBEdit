
import React from 'react';

interface BeatScrubberProps {
  position: number; // Position in pixels
}

const BeatScrubber: React.FC<BeatScrubberProps> = ({ position }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${position}px`,
        top: 0,
        width: '2px',
        height: '100%',
        backgroundColor: '#e74c3c',
        zIndex: 10,
      }}
    />
  );
};

export default BeatScrubber;
