import React from 'react';
import { EnemyData, EnemyConfig } from '../types';

interface PropertyEditorProps {
  selectedEnemy: EnemyData;
  onUpdateEnemy: (updatedEnemy: EnemyData) => void;
  enemyConfig: EnemyConfig | undefined;
}

function PropertyEditor({
  selectedEnemy,
  onUpdateEnemy,
  enemyConfig,
}: PropertyEditorProps) {
  const handlePropertyChange = (property: string, value: any) => {
    const updatedEnemy = { ...selectedEnemy, [property]: value };
    onUpdateEnemy(updatedEnemy);
  };

  if (!enemyConfig) {
    return <div>No enemy configuration found.</div>;
  }

  return (
    <div>
      <h3>Property Editor</h3>
      {Object.entries(enemyConfig.properties).map(([prop, type]) => (
        <div key={prop}>
          <label htmlFor={prop}>{prop}:</label>
          <input
            id={prop}
            type={type || 'text'}
            value={(selectedEnemy as any)[prop] || ''}
            onChange={(e) =>
              handlePropertyChange(
                prop,
                type === 'number' ? parseFloat(e.target.value) : e.target.value,
              )
            }
          />
        </div>
      ))}
    </div>
  );
}

export default PropertyEditor;
