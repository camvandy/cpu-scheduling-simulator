'use client';

const PROCESS_COLORS = [
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#3b82f6', // blue
  '#ec4899', // pink
  '#f97316', // orange
  '#14b8a6', // teal
  '#a855f7', // purple
];

function getColor(pid) {
  return PROCESS_COLORS[(pid - 1) % PROCESS_COLORS.length];
}

export default function GanttChart({ gantt }) {
  if (!gantt || gantt.length === 0) return null;

  const totalTime = Math.max(...gantt.map((g) => g.end));
  const tickInterval = totalTime <= 20 ? 1 : totalTime <= 50 ? 2 : 5;
  const ticks = [];
  for (let t = 0; t <= totalTime; t += tickInterval) {
    ticks.push(t);
  }
  if (ticks[ticks.length - 1] !== totalTime) ticks.push(totalTime);

  return (
    <div className="gantt-section">
      <h2 className="section-title">
        <span className="section-icon">📅</span>
        Gantt Chart
      </h2>
      <div className="gantt-container">
        <div className="gantt-chart">
          {gantt.map((block, idx) => {
            const left = (block.start / totalTime) * 100;
            const width = ((block.end - block.start) / totalTime) * 100;
            const color = getColor(block.pid);
            return (
              <div
                key={idx}
                className="gantt-block"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor: color,
                  animationDelay: `${idx * 50}ms`,
                }}
                title={`P${block.pid}: ${block.start} → ${block.end}`}
              >
                <span className="gantt-label">P{block.pid}</span>
              </div>
            );
          })}
        </div>
        <div className="gantt-timeline">
          {ticks.map((t) => (
            <div
              key={t}
              className="gantt-tick"
              style={{ left: `${(t / totalTime) * 100}%` }}
            >
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
