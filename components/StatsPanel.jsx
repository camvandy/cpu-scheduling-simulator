'use client';

export default function StatsPanel({ stats }) {
  if (!stats) return null;

  const cards = [
    { label: 'Avg Turnaround', value: stats.avgTurnaround, unit: 'units', icon: '🔄', color: 'cyan' },
    { label: 'Avg Waiting', value: stats.avgWaiting, unit: 'units', icon: '⏳', color: 'purple' },
    { label: 'Total Execution', value: stats.totalExecution, unit: 'units', icon: '⏱️', color: 'blue' },
    { label: 'CPU Utilization', value: stats.cpuUtilization, unit: '%', icon: '📊', color: 'green' },
    { label: 'Throughput', value: stats.throughput, unit: 'proc/unit', icon: '🚀', color: 'orange' },
  ];

  return (
    <div className="stats-panel">
      <h2 className="section-title">
        <span className="section-icon">📈</span>
        Performance Metrics
      </h2>
      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.label} className={`stat-card stat-${card.color}`}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-unit">{card.unit}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
