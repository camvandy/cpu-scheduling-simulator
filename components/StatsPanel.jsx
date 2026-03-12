'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import useInView from '@/hooks/useInView';

/* ── Digit Roller ─────────────────────────────────────── */

function DigitRoller({ digit, delay = 0 }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  // non-numeric chars (like .)
  if (isNaN(parseInt(digit))) {
    return <span className="digit-static">{digit}</span>;
  }

  const num = parseInt(digit);
  return (
    <span className="digit-roller">
      <span
        className="digit-reel"
        style={{
          transform: show ? `translateY(-${num * 10}%)` : 'translateY(0%)',
          transitionDelay: `${delay}ms`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d} className="digit-item">{d}</span>
        ))}
      </span>
    </span>
  );
}

function RollingNumber({ value }) {
  const str = String(value);
  return (
    <span className="rolling-number">
      {str.split('').map((ch, i) => (
        <DigitRoller key={`${i}-${ch}`} digit={ch} delay={i * 30} />
      ))}
    </span>
  );
}

/* ── Utilization Ring ─────────────────────────────────── */

function UtilizationRing({ value, color = '#34d399' }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="stat-ring-container">
      <svg className="stat-ring" viewBox="0 0 72 72">
        <circle className="stat-ring-bg" cx="36" cy="36" r={radius} />
        <circle
          className="stat-ring-progress"
          cx="36" cy="36" r={radius}
          stroke={color}
          style={{
            '--ring-dasharray': circumference,
            '--ring-dashoffset': offset,
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <span className="stat-ring-value" style={{ color }}>
        <RollingNumber value={value} />%
      </span>
    </div>
  );
}

/* ── Stats Panel ──────────────────────────────────────── */

export default function StatsPanel({ stats }) {
  const [sectionRef, isInView] = useInView({ threshold: 0, rootMargin: '100px' });

  if (!stats) return null;

  const cards = [
    { label: 'Avg Turnaround', value: stats.avgTurnaround, unit: 'time units', icon: '🔄', color: 'cyan' },
    { label: 'Avg Waiting',    value: stats.avgWaiting,    unit: 'time units', icon: '⏳', color: 'purple' },
    { label: 'Total Execution', value: stats.totalExecution, unit: 'time units', icon: '⏱️', color: 'blue' },
    { label: 'Throughput',     value: stats.throughput,     unit: 'proc/unit',  icon: '🚀', color: 'orange' },
  ];

  return (
    <div className={`stats-panel ${isInView ? 'revealed' : 'hidden-section'}`} ref={sectionRef}>
      <h2 className="section-title">
        <span className="section-icon">📈</span>
        Performance Metrics
      </h2>
      <div className="stats-grid">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`stat-card stat-${card.color}`}
            style={{ '--stagger': `${i * 30}ms` }}
          >
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-value">
              {isInView ? <RollingNumber value={card.value} /> : 0}
            </div>
            <div className="stat-unit">{card.unit}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}

        <div className="stat-card stat-green" style={{ '--stagger': `${cards.length * 30}ms` }}>
          <div className="stat-icon">📊</div>
          {isInView
            ? <UtilizationRing value={stats.cpuUtilization} color="#34d399" />
            : <UtilizationRing value={0} color="#34d399" />
          }
          <div className="stat-label">CPU Utilization</div>
        </div>
      </div>
    </div>
  );
}
