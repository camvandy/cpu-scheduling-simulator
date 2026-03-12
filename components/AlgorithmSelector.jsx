'use client';

import { useCallback, useRef } from 'react';
import { ALGORITHMS } from '@/lib/scheduler';
import useInView from '@/hooks/useInView';

const algorithmKeys = Object.keys(ALGORITHMS);

const ALGO_META = {
  fifo:       { icon: '⏩', accent: '#22d3ee', type: 'Non-Preemptive' },
  srtf:       { icon: '⚡', accent: '#a78bfa', type: 'Preemptive' },
  rr:         { icon: '🔄', accent: '#60a5fa', type: 'Preemptive' },
  priorityNP: { icon: '🏷️', accent: '#34d399', type: 'Non-Preemptive' },
  priorityP:  { icon: '🎯', accent: '#fbbf24', type: 'Preemptive' },
  mlfq:       { icon: '📶', accent: '#f472b6', type: 'Adaptive' },
};

function TiltCard({ children, className, style, onClick, isActive, onKeyDown }) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${isActive ? 0 : -2}px)`;
    
    // Move spotlight
    const spot = card.querySelector('.card-spotlight');
    if (spot) {
      spot.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08) 0%, transparent 60%)`;
      spot.style.opacity = '1';
    }
  }, [isActive]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
    const spot = card.querySelector('.card-spotlight');
    if (spot) spot.style.opacity = '0';
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      style={style}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-spotlight" />
      {children}
    </div>
  );
}

export default function AlgorithmSelector({ selected, onSelect, quantum, onQuantumChange, onLearn }) {
  const [sectionRef, isInView] = useInView({ threshold: 0, rootMargin: '100px' });

  return (
    <div className="algorithm-selector" ref={sectionRef}>
      <h2 className="section-title">
        <span className="section-icon">⚙️</span>
        Select Algorithm
      </h2>
      <div className="algorithm-grid">
        {algorithmKeys.map((key, i) => {
          const algo = ALGORITHMS[key];
          const meta = ALGO_META[key] || {};
          const isActive = selected === key;
          const accent = meta.accent || '#22d3ee';
          return (
            <TiltCard
              key={key}
              className={`algorithm-card ${isActive ? 'active' : ''} ${isInView ? 'revealed' : 'hidden-card'}`}
              isActive={isActive}
              onClick={() => onSelect(key)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(key); }}
              style={{
                '--card-accent': accent,
                '--card-active-bg': `${accent}0f`,
                '--card-glow': `${accent}1a`,
                '--card-tag-bg': `${accent}18`,
                '--stagger': `${i * 30}ms`,
              }}
            >
              <div className="algo-card-header">
                <div className="algo-card-left">
                  <span className="algo-short">{algo.short}</span>
                  <span className="algo-type-badge">{meta.type}</span>
                </div>
                {isActive && <span className="algo-check">✓</span>}
              </div>
              <div className="algo-name">{meta.icon} {algo.name}</div>
              <div className="algo-desc">{algo.description}</div>
              <button
                className="algo-learn-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onLearn(key);
                }}
              >
                📖 Learn more
              </button>
            </TiltCard>
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
