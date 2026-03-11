'use client';

import { ALGORITHMS } from '@/lib/scheduler';

const algorithmKeys = Object.keys(ALGORITHMS);

export default function AlgorithmSelector({ selected, onSelect, quantum, onQuantumChange }) {
  return (
    <div className="algorithm-selector">
      <h2 className="section-title">
        <span className="section-icon">⚙️</span>
        Select Algorithm
      </h2>
      <div className="algorithm-grid">
        {algorithmKeys.map((key) => {
          const algo = ALGORITHMS[key];
          const isActive = selected === key;
          return (
            <button
              key={key}
              className={`algorithm-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelect(key)}
            >
              <div className="algo-card-header">
                <span className="algo-short">{algo.short}</span>
                {isActive && <span className="algo-check">✓</span>}
              </div>
              <div className="algo-name">{algo.name}</div>
              <div className="algo-desc">{algo.description}</div>
            </button>
          );
        })}
      </div>

      {ALGORITHMS[selected]?.needsQuantum && (
        <div className="quantum-input">
          <label htmlFor="quantum">Time Quantum</label>
          <input
            id="quantum"
            type="number"
            min="1"
            value={quantum}
            onChange={(e) => onQuantumChange(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
      )}
    </div>
  );
}
