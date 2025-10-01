import React from 'react';

interface EnemyPaletteProps {
  enemyTypes: string[];
  selectedEnemyType: string;
  onSelectEnemyType: (type: string) => void;
}

function EnemyPalette({
  enemyTypes,
  selectedEnemyType,
  onSelectEnemyType,
}: EnemyPaletteProps) {
  const handleKeyDown = (event: React.KeyboardEvent, type: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onSelectEnemyType(type);
    }
  };

  return (
    <div>
      <h3>Enemy Palette</h3>
      {enemyTypes.map((type) => (
        <div
          key={type}
          onClick={() => onSelectEnemyType(type)}
          onKeyDown={(e) => handleKeyDown(e, type)}
          role="button"
          tabIndex={0}
          style={{
            padding: '10px',
            margin: '5px',
            border: `2px solid ${selectedEnemyType === type ? '#e74c3c' : '#3498db'}`,
            cursor: 'pointer',
          }}
        >
          {type}
        </div>
      ))}
    </div>
  );
}

export default EnemyPalette;
