import React, { useState, useEffect } from 'react';
import AudioEngine from './audio/AudioEngine';
import TimelineView from './components/TimelineView';
import BeatScrubber from './components/BeatScrubber';
import EnemyPalette from './components/EnemyPalette';
import PropertyEditor from './components/PropertyEditor';
import { EnemyData } from './types';
import enemyConfigData from '../config/enemies.json';
import './App.css';

const audioEngine = new AudioEngine();

interface EnemyConfig {
  name: string;
  properties: Record<string, string>;
}

export default function App() {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [scrubberPosition, setScrubberPosition] = useState(0);
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const [history, setHistory] = useState<EnemyData[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedEnemyType, setSelectedEnemyType] = useState('Grunt');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(0);
  const [selectedEnemyId, setSelectedEnemyId] = useState<string | null>(null);
  const [beats, setBeats] = useState<number[]>([]);
  const [enemyConfig] = useState<EnemyConfig[]>(enemyConfigData);

  useEffect(() => {
    // Add new state to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(enemies);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [enemies, history, historyIndex]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const buffer = await audioEngine.loadAudioFile(file);
      setAudioBuffer(buffer);
      const detectedBeats = audioEngine.detectBeats(buffer);
      setBeats(detectedBeats);
      setEnemies([]);
      setHistory([[]]);
      setHistoryIndex(0);
    }
  };

  const handleAddEnemy = (time: number) => {
    const newEnemy: EnemyData = {
      id: `${Date.now()}`,
      type: selectedEnemyType,
      time,
    };
    setEnemies([...enemies, newEnemy]);
  };

  const handleUpdateEnemy = (updatedEnemy: EnemyData) => {
    setEnemies(
      enemies.map((enemy) =>
        enemy.id === updatedEnemy.id ? updatedEnemy : enemy,
      ),
    );
  };

  const handleSave = () => {
    const levelData = { enemies, beats };
    const json = JSON.stringify(levelData, null, 2);
    // In a real app, you would save this to a file
  };

  const handleLoad = () => {
    const levelData = JSON.parse(
      '{\n      "enemies": [\n        {\n          "id": "1678886400000",\n          "type": "Grunt",\n          "time": 5\n        },\n        {\n          "id": "1678886401000",\n          "type": "Shooter",\n          "time": 10\n        }\n      ],\n      "beats": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]\n    }',
    );
    setEnemies(levelData.enemies);
    setBeats(levelData.beats);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setEnemies(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setEnemies(history[newIndex]);
    }
  };

  const handlePlaytest = () => {
    const levelData = { enemies, beats };
    window.electron.playLevel(levelData);
  };

  const selectedEnemy = enemies.find((enemy) => enemy.id === selectedEnemyId);

  return (
    <div>
      <h1>Beat Blaster Level Editor</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button type="button" onClick={handleSave}>
        Save Level
      </button>
      <button type="button" onClick={handleLoad}>
        Load Level
      </button>
      <button type="button" onClick={handleUndo} disabled={historyIndex === 0}>
        Undo
      </button>
      <button
        type="button"
        onClick={handleRedo}
        disabled={historyIndex === history.length - 1}
      >
        Redo
      </button>
      <button type="button" onClick={handlePlaytest}>
        Playtest
      </button>
      <button type="button" onClick={() => setZoom(zoom * 1.2)}>
        Zoom In
      </button>
      <button type="button" onClick={() => setZoom(zoom / 1.2)}>
        Zoom Out
      </button>
      <EnemyPalette
        enemyTypes={enemyConfig.map((e) => e.name)}
        selectedEnemyType={selectedEnemyType}
        onSelectEnemyType={setSelectedEnemyType}
      />
      <TimelineView
        audioBuffer={audioBuffer}
        onScrubberMove={setScrubberPosition}
        enemies={enemies}
        onAddEnemy={handleAddEnemy}
        zoom={zoom}
        pan={pan}
        onPan={setPan}
        selectedEnemyId={selectedEnemyId}
        onSelectEnemy={setSelectedEnemyId}
        beats={beats}
      >
        <BeatScrubber position={scrubberPosition} />
      </TimelineView>
      {selectedEnemy && (
        <PropertyEditor
          selectedEnemy={selectedEnemy}
          onUpdateEnemy={handleUpdateEnemy}
          enemyConfig={enemyConfig.find((e) => e.name === selectedEnemy.type)}
        />
      )}
    </div>
  );
}
