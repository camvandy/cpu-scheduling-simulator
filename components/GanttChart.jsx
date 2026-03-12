'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import useInView from '@/hooks/useInView';

const PROCESS_COLORS = [
  '#3b82f6', '#f97316', '#10b981', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#eab308', '#14b8a6', '#6366f1',
];

function getColor(pid) {
  return PROCESS_COLORS[(pid - 1) % PROCESS_COLORS.length];
}

export default function GanttChart({ gantt, compact = false }) {
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [cursorPos, setCursorPos] = useState(-1); // -1 = not playing
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const [speed, setSpeed] = useState(1);
  const [sectionRef, isInView] = useInView({ threshold: 0, rootMargin: '100px' });

  if (!gantt || gantt.length === 0) return null;

  const totalTime = Math.max(...gantt.map((g) => g.end));
  const tickInterval = totalTime <= 20 ? 1 : totalTime <= 50 ? 2 : 5;
  const ticks = [];
  for (let t = 0; t <= totalTime; t += tickInterval) {
    ticks.push(t);
  }
  if (ticks[ticks.length - 1] !== totalTime) ticks.push(totalTime);

  const durationMs = (totalTime * 600) / speed; // ms for full animation

  const startPlayback = () => {
    if (playing) {
      // stop
      setPlaying(false);
      setCursorPos(-1);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    setPlaying(true);
    setCursorPos(0);
    startRef.current = performance.now();

    const animate = (time) => {
      const elapsed = time - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const currentTime = progress * totalTime;
      setCursorPos(currentTime);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPlaying(false);
        setCursorPos(-1);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={`gantt-section ${isInView ? 'revealed' : 'hidden-section'}`} ref={sectionRef}>
      {!compact && (
        <div className="gantt-header-bar">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            <span className="section-icon">📅</span>
            Gantt Chart
          </h2>
          <div className="gantt-controls">
            <button className={`btn gantt-play-btn ${playing ? 'playing' : ''}`} onClick={startPlayback}>
              {playing ? '⏹' : '▶'} {playing ? 'Stop' : 'Play'}
            </button>
            <div className="speed-selector">
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  className={`speed-btn ${speed === s ? 'active' : ''}`}
                  onClick={() => setSpeed(s)}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="gantt-container">
        <div className="gantt-chart">
          {ticks.map((t) => (
            <div
              key={`grid-${t}`}
              className="gantt-grid-line"
              style={{ left: `${(t / totalTime) * 100}%` }}
            />
          ))}

          {gantt.map((block, idx) => {
            const left = (block.start / totalTime) * 100;
            const width = ((block.end - block.start) / totalTime) * 100;
            const color = getColor(block.pid);
            const duration = block.end - block.start;
            // During playback, only show blocks that have started
            const isVisible = cursorPos < 0 || block.start <= cursorPos;
            // Partially reveal: clip width if cursor is mid-block
            const clipPercent = cursorPos >= 0 && cursorPos < block.end && cursorPos >= block.start
              ? ((cursorPos - block.start) / (block.end - block.start)) * 100
              : 100;

            return (
              <div
                key={idx}
                className={`gantt-block ${!isVisible ? 'gantt-block-hidden' : ''}`}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  '--block-color': color,
                  animationDelay: cursorPos < 0 ? `${idx * 50}ms` : '0ms',
                  clipPath: cursorPos >= 0 ? `inset(0 ${100 - clipPercent}% 0 0)` : undefined,
                }}
                onMouseEnter={() => setHoveredBlock(idx)}
                onMouseLeave={() => setHoveredBlock(null)}
              >
                <span className="gantt-label">P{block.pid}</span>
                {hoveredBlock === idx && cursorPos < 0 && (
                  <div className="gantt-tooltip">
                    P{block.pid} • {block.start}→{block.end} ({duration} {duration === 1 ? 'unit' : 'units'})
                  </div>
                )}
              </div>
            );
          })}

          {/* Playback cursor */}
          {cursorPos >= 0 && (
            <div
              className="gantt-cursor"
              style={{ left: `${(cursorPos / totalTime) * 100}%` }}
            />
          )}
        </div>
        <div className="gantt-timeline">
          {ticks.map((t) => (
            <div key={t} className="gantt-tick" style={{ left: `${(t / totalTime) * 100}%` }}>
              <div className="tick-line" />
              <span className="tick-label">{t}</span>
            </div>
          ))}
        </div>

        <div className="gantt-legend">
          {[...new Set(gantt.map((g) => g.pid))].sort((a, b) => a - b).map((pid) => (
            <div key={pid} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: getColor(pid) }} />
              <span>P{pid}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
