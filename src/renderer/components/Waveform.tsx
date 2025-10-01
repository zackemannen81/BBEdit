import React, { useRef, useEffect } from 'react';

interface WaveformProps {
  audioBuffer: AudioBuffer | null;
  zoom: number;
}

function Waveform({ audioBuffer, zoom }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    buffer: AudioBuffer,
  ) => {
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);

    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    context.fillStyle = '#3498db';
    context.beginPath();

    for (let i = 0; i < width; i += 1) {
      let min = 1.0;
      let max = -1.0;

      for (let j = 0; j < step; j += 1) {
        const datum = data[i * step + j];
        if (datum < min) {
          min = datum;
        }
        if (datum > max) {
          max = datum;
        }
      }

      context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }

    context.fill();
  };

  useEffect(() => {
    if (audioBuffer && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * zoom;
      const context = canvas.getContext('2d');
      if (context) {
        draw(canvas, context, audioBuffer);
      }
    }
  }, [audioBuffer, zoom]);

  return (
    <div style={{ width: '100%', height: '150px', backgroundColor: '#2c3e50' }}>
      <canvas ref={canvasRef} height="150" style={{ width: '100%' }} />
    </div>
  );
}

export default Waveform;
