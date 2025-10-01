import React from 'react';

interface BeatGridProps {
  beats: { id: string; time: number }[];
  duration: number;
}

function BeatGrid({ beats, duration }: BeatGridProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      {beats.map((beat) => {
        const left = (beat.time / duration) * 100;
        return (
          <div key={beat.id}>
            <div
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: 0,
                width: '1px',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default BeatGrid;
