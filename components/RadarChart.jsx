'use client';

import { useState, useMemo } from 'react';
import { ALGORITHMS } from '@/lib/scheduler';

const ALGO_COLORS = {
  fifo:       '#3b82f6',
  srtf:       '#f97316',
  rr:         '#10b981',
  priorityNP: '#ef4444',
  priorityP:  '#eab308',
  mlfq:       '#8b5cf6',
};

const METRICS = [
  { key: 'avgTurnaround', label: 'Avg Turnaround', invert: true },
  { key: 'avgWaiting',    label: 'Avg Waiting',    invert: true },
  { key: 'cpuUtilization', label: 'CPU Util',      invert: false },
  { key: 'throughput',     label: 'Throughput',     invert: false },
  { key: 'totalExecution', label: 'Total Time',    invert: true },
];

function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function RadarChart({ compareResults }) {
  const [hoveredAlgo, setHoveredAlgo] = useState(null);

  // Compute normalised 0–1 scores for each algorithm on each metric
  const { normalised, algoKeys } = useMemo(() => {
    if (!compareResults) return { normalised: {}, algoKeys: [] };

    const keys = Object.keys(compareResults);
    const ranges = {};

    METRICS.forEach((m) => {
      const vals = keys.map((k) => compareResults[k].stats[m.key]);
      ranges[m.key] = { min: Math.min(...vals), max: Math.max(...vals) };
    });

    const norm = {};
    keys.forEach((k) => {
      norm[k] = METRICS.map((m) => {
        const { min, max } = ranges[m.key];
        if (max === min) return 1;
        const raw = (compareResults[k].stats[m.key] - min) / (max - min);
        // Invert metrics where lower is better
        return m.invert ? 1 - raw : raw;
      });
    });

    return { normalised: norm, algoKeys: keys };
  }, [compareResults]);

  if (!compareResults) return null;

  const cx = 150, cy = 150, maxR = 110;
  const angleStep = 360 / METRICS.length;

  // Build concentric rings
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Build axis lines and labels
  const axes = METRICS.map((m, i) => {
    const angle = i * angleStep;
    const outer = polarToXY(cx, cy, maxR, angle);
    const labelPos = polarToXY(cx, cy, maxR + 18, angle);
    return { ...m, angle, outer, labelPos };
  });

  // Build polygon paths
  const polygons = algoKeys.map((k) => {
    const scores = normalised[k];
    const points = scores.map((s, i) => {
      const val = Math.max(s, 0.05); // min size so it's visible
      const { x, y } = polarToXY(cx, cy, maxR * val, i * angleStep);
      return `${x},${y}`;
    });
    return { key: k, points: points.join(' '), color: ALGO_COLORS[k] || '#888' };
  });

  return (
    <div className="radar-chart-section">
      <h2 className="section-title">
        <span className="section-icon"></span>
        Performance Radar
      </h2>
      <div className="radar-card glass-card">
        <svg viewBox="0 0 300 300" className="radar-svg">
          {/* Concentric rings */}
          {rings.map((r, i) => (
            <polygon
              key={i}
              className="radar-ring"
              points={METRICS.map((_, mi) => {
                const { x, y } = polarToXY(cx, cy, maxR * r, mi * angleStep);
                return `${x},${y}`;
              }).join(' ')}
            />
          ))}

          {/* Axis lines */}
          {axes.map((a, i) => (
            <line key={i} x1={cx} y1={cy} x2={a.outer.x} y2={a.outer.y} className="radar-axis" />
          ))}

          {/* Data polygons */}
          {polygons.map((p) => (
            <polygon
              key={p.key}
              points={p.points}
              className={`radar-polygon ${hoveredAlgo && hoveredAlgo !== p.key ? 'radar-dim' : ''}`}
              style={{
                fill: p.color,
                stroke: p.color,
                fillOpacity: hoveredAlgo === p.key ? 0.35 : 0.15,
                strokeOpacity: hoveredAlgo === p.key ? 1 : 0.6,
              }}
            />
          ))}

          {/* Data points */}
          {polygons.map((p) => {
            const scores = normalised[p.key];
            return scores.map((s, i) => {
              const val = Math.max(s, 0.05);
              const { x, y } = polarToXY(cx, cy, maxR * val, i * angleStep);
              return (
                <circle
                  key={`${p.key}-${i}`}
                  cx={x} cy={y} r={hoveredAlgo === p.key ? 4 : 2.5}
                  fill={p.color}
                  className={`radar-dot ${hoveredAlgo && hoveredAlgo !== p.key ? 'radar-dim' : ''}`}
                />
              );
            });
          })}

          {/* Axis labels */}
          {axes.map((a, i) => (
            <text
              key={i}
              x={a.labelPos.x}
              y={a.labelPos.y}
              className="radar-label"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {a.label}
            </text>
          ))}
        </svg>

        {/* Legend */}
        <div className="radar-legend">
          {algoKeys.map((k) => (
            <button
              key={k}
              className={`radar-legend-item ${hoveredAlgo === k ? 'radar-legend-active' : ''}`}
              onMouseEnter={() => setHoveredAlgo(k)}
              onMouseLeave={() => setHoveredAlgo(null)}
              onClick={() => setHoveredAlgo(hoveredAlgo === k ? null : k)}
            >
              <span className="radar-legend-dot" style={{ background: ALGO_COLORS[k] }} />
              <span>{ALGORITHMS[k]?.short || k}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
