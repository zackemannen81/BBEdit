import React from 'react';
import { EnemyData } from '../types';

interface EnemyProps {
  enemy: EnemyData;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

function Enemy({ enemy, onSelect, isSelected }: EnemyProps) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${enemy.time}px`,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    backgroundColor: isSelected ? '#f1c40f' : '#c0392b',
    borderRadius: '50%',
    textAlign: 'center',
    color: 'white',
    fontSize: '12px',
    lineHeight: '20px',
    cursor: 'pointer',
    border: isSelected ? '2px solid white' : 'none',
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onSelect(enemy.id);
    }
  };

  return (
    <div
      className="enemy"
      style={style}
      onClick={() => onSelect(enemy.id)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      {enemy.type.substring(0, 1)}
    </div>
  );
}

export default Enemy;
