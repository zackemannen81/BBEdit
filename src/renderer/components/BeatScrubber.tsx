import React from 'react';

interface BeatScrubberProps {
  position: number; // Position in pixels
}

function BeatScrubber({ position }: BeatScrubberProps) {
  return (
    <div
      className="beat-scrubber"
      style={{
        position: 'absolute',
        left: `${position}px`,
        top: 0,
        width: '2px',
        height: '100%',
        backgroundColor: '#e74c3c',
        zIndex: 10,
        cursor: 'pointer',
      }}
    />
  );
}

export default BeatScrubber;
