'use client';

export default function ResultsTable({ processes }) {
  if (!processes || processes.length === 0) return null;

  return (
    <div className="results-section">
      <h2 className="section-title">
        <span className="section-icon">📊</span>
        Scheduling Results
      </h2>
      <div className="table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>Process</th>
              <th>Arrival</th>
              <th>Burst</th>
              <th>Priority</th>
              <th>Start</th>
              <th>Completion</th>
              <th>Turnaround</th>
              <th>Waiting</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p, idx) => (
              <tr key={p.pid} className="result-row" style={{ animationDelay: `${idx * 60}ms` }}>
                <td><span className="pid-badge">P{p.pid}</span></td>
                <td>{p.arrival}</td>
                <td>{p.burst}</td>
                <td>{p.priority}</td>
                <td>{p.start}</td>
                <td className="highlight-cell">{p.finish}</td>
                <td className="highlight-cell">{p.turnaround}</td>
                <td className="highlight-cell">{p.waiting}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
