import React, { useState, useRef, useEffect } from 'react';
import Waveform from './Waveform';
import Enemy from './Enemy';
import BeatGrid from './BeatGrid';
import { EnemyData } from '../types';

interface TimelineViewProps {
  audioBuffer: AudioBuffer | null;
  children: React.ReactNode;
  enemies: EnemyData[];
  onScrubberMove: (position: number) => void;
  onAddEnemy: (time: number) => void;
  zoom: number;
  pan: number;
  onPan: (pan: number) => void;
  selectedEnemyId: string | null;
  onSelectEnemy: (id: string) => void;
  beats: number[];
}

function TimelineView({
  audioBuffer,
  children,
  enemies,
  onScrubberMove,
  onAddEnemy,
  zoom,
  pan,
  onPan,
  selectedEnemyId,
  onSelectEnemy,
  beats,
}: TimelineViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lastPanX = useRef(0);

  const updateScrubberPosition = (event: React.MouseEvent<HTMLDivElement>) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      onScrubberMove(x);
    }
  };

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.parentElement.scrollLeft = pan;
    }
  }, [pan]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button === 1) {
      // Middle mouse button
      setIsPanning(true);
      lastPanX.current = event.clientX;
      event.preventDefault();
      return;
    }

    // If the click is on the scrubber handle, don't add an enemy
    if ((event.target as HTMLElement).closest('.beat-scrubber')) {
      setIsDragging(true);
      updateScrubberPosition(event);
      return;
    }

    // If the click is on an enemy, don't add a new one
    if ((event.target as HTMLElement).closest('.enemy')) {
      return;
    }

    if (timelineRef.current && audioBuffer) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const { duration } = audioBuffer;
      let time = (x / rect.width) * duration;

      // Snapping logic
      const snapThreshold = 0.1; // seconds
      let nearestBeat = -1;
      let smallestDistance = Infinity;

      beats.forEach((beatTime) => {
        const distance = Math.abs(beatTime - time);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          nearestBeat = beatTime;
        }
      });

      if (nearestBeat !== -1 && smallestDistance < snapThreshold) {
        time = nearestBeat;
      }

      onAddEnemy(time);
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      setIsPanning(false);
      event.preventDefault();
    }
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      const deltaX = event.clientX - lastPanX.current;
      onPan(pan - deltaX);
      lastPanX.current = event.clientX;
      event.preventDefault();
      return;
    }

    if (isDragging) {
      updateScrubberPosition(event);
    }
  };

  const calculateLeftPosition = (time: number) => {
    if (!audioBuffer || !timelineRef.current) return '0px';
    const { duration } = audioBuffer;
    const timelineWidth = timelineRef.current.offsetWidth;
    return `${(time / duration) * timelineWidth}px`;
  };

  return (
    <div
      style={{ overflowX: 'scroll' }}
      onContextMenu={(e) => e.preventDefault()}
      role="group"
    >
      <div
        ref={timelineRef}
        style={{
          position: 'relative',
          width: `${100 * zoom}%`,
          height: '150px',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the container
        onMouseMove={handleMouseMove}
      >
        <Waveform audioBuffer={audioBuffer} zoom={zoom} />
        {audioBuffer && (
          <BeatGrid beats={beats} duration={audioBuffer.duration} />
        )}
        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            style={{
              position: 'absolute',
              left: calculateLeftPosition(enemy.time),
              top: 0,
              height: '100%',
            }}
          >
            <Enemy
              enemy={enemy}
              onSelect={onSelectEnemy}
              isSelected={selectedEnemyId === enemy.id}
            />
          </div>
        ))}
        {children}
      </div>
    </div>
  );
}

export default TimelineView;
