'use client';

import { useState, useMemo, useCallback } from 'react';
import { createProcess } from '@/lib/process';
import { ALGORITHMS } from '@/lib/scheduler';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import ProcessTable from '@/components/ProcessTable';
import ResultsTable from '@/components/ResultsTable';
import GanttChart from '@/components/GanttChart';
import StatsPanel from '@/components/StatsPanel';
import LearnModal from '@/components/LearnModal';
import RadarChart from '@/components/RadarChart';
import ThemeToggle from '@/components/ThemeToggle';
import { ToastContainer } from '@/components/Toast';

const DEFAULT_PROCESSES = [
  createProcess({ pid: 1, arrival: 0, burst: 4, priority: 3 }),
  createProcess({ pid: 2, arrival: 1, burst: 8, priority: 1 }),
  createProcess({ pid: 3, arrival: 3, burst: 2, priority: 4 }),
];

let toastId = 0;

export default function Home() {
  const [selectedAlgo, setSelectedAlgo] = useState('fifo');
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES);
  const [quantum, setQuantum] = useState(2);
  const [result, setResult] = useState(null);
  const [compareResults, setCompareResults] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [learnAlgo, setLearnAlgo] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const runSimulation = () => {
    const algo = ALGORITHMS[selectedAlgo];
    if (!algo) return;
    const res = algo.needsQuantum ? algo.fn(processes, quantum) : algo.fn(processes);
    setResult(res);
    setCompareResults(null);
    setIsComparing(false);
    addToast(`${algo.short} simulation complete`, 'success');
  };

  const runComparison = () => {
    const results = {};
    for (const [key, algo] of Object.entries(ALGORITHMS)) {
      results[key] = algo.needsQuantum ? algo.fn(processes, quantum) : algo.fn(processes);
    }
    setCompareResults(results);
    setResult(null);
    setIsComparing(true);
    addToast('All 6 algorithms compared', 'info');
  };

  const reset = () => {
    setResult(null);
    setCompareResults(null);
    setIsComparing(false);
  };

  // Find best values for comparison highlighting
  const bestMetrics = useMemo(() => {
    if (!compareResults) return null;
    const entries = Object.entries(compareResults);
    return {
      avgTurnaround: Math.min(...entries.map(([, r]) => r.stats.avgTurnaround)),
      avgWaiting: Math.min(...entries.map(([, r]) => r.stats.avgWaiting)),
      cpuUtilization: Math.max(...entries.map(([, r]) => r.stats.cpuUtilization)),
      throughput: Math.max(...entries.map(([, r]) => r.stats.throughput)),
      totalExecution: Math.min(...entries.map(([, r]) => r.stats.totalExecution)),
    };
  }, [compareResults]);

  return (
    <>
      {/* Animated background orbs */}
      <div className="bg-mesh">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <main className="app">
        <ThemeToggle />
        <header className="hero">
          <h1 className="hero-title">
            <span className="hero-icon">🖥️</span> CPU Scheduling Simulator
          </h1>
          <p className="hero-subtitle">
            Interactive visualization of 6 classic CPU scheduling algorithms
          </p>
          <div className="hero-badges">
            <span className="hero-badge">⚡ Real-time Gantt Charts</span>
            <span className="hero-badge">📊 Side-by-side Comparison</span>
            <span className="hero-badge">🎯 Performance Metrics</span>
            <span className="hero-badge">📚 Interactive Learning</span>
          </div>
        </header>

        <div className="container">
          <AlgorithmSelector
            selected={selectedAlgo}
            onSelect={(key) => { setSelectedAlgo(key); reset(); }}
            quantum={quantum}
            onQuantumChange={setQuantum}
            onLearn={setLearnAlgo}
          />

          <ProcessTable
            processes={processes}
            onChange={(p) => { setProcesses(p); reset(); }}
            selectedAlgorithm={selectedAlgo}
          />

          <div className="action-bar">
            <button className="btn btn-run" onClick={runSimulation}>
              ▶ Run {ALGORITHMS[selectedAlgo]?.short}
            </button>
            <button className="btn btn-compare" onClick={runComparison}>
              ⚡ Compare All Algorithms
            </button>
          </div>

          {/* Single algorithm result */}
          {result && (
            <div className="results-container fade-in">
              <StatsPanel stats={result.stats} />
              <GanttChart gantt={result.gantt} />
              <ResultsTable processes={result.processes} />
            </div>
          )}

          {/* Comparison mode */}
          {isComparing && compareResults && (
            <div className="comparison-container fade-in">
              <h2 className="section-title">
                <span className="section-icon">⚡</span>
                Algorithm Comparison
              </h2>

              <div className="comparison-table-wrap">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Algorithm</th>
                      <th>Avg Turnaround</th>
                      <th>Avg Waiting</th>
                      <th>CPU Utilization</th>
                      <th>Throughput</th>
                      <th>Total Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(compareResults).map(([key, res]) => {
                      const algo = ALGORITHMS[key];
                      const s = res.stats;
                      return (
                        <tr key={key} className="comparison-row">
                          <td><span className="algo-badge">{algo.short}</span></td>
                          <td className={s.avgTurnaround === bestMetrics.avgTurnaround ? 'metric-cell best-value' : 'metric-cell'}>
                            {s.avgTurnaround}
                          </td>
                          <td className={s.avgWaiting === bestMetrics.avgWaiting ? 'metric-cell best-value' : 'metric-cell'}>
                            {s.avgWaiting}
                          </td>
                          <td className={s.cpuUtilization === bestMetrics.cpuUtilization ? 'metric-cell best-value' : 'metric-cell'}>
                            {s.cpuUtilization}%
                          </td>
                          <td className={s.throughput === bestMetrics.throughput ? 'metric-cell best-value' : 'metric-cell'}>
                            {s.throughput}
                          </td>
                          <td className={s.totalExecution === bestMetrics.totalExecution ? 'metric-cell best-value' : 'metric-cell'}>
                            {s.totalExecution}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Individual Gantt charts */}
              <div className="comparison-gantt-grid">
                {Object.entries(compareResults).map(([key, res]) => (
                  <div key={key} className="comparison-gantt-item">
                    <h3 className="comparison-gantt-title">{ALGORITHMS[key].short}</h3>
                    <GanttChart gantt={res.gantt} compact />
                  </div>
                ))}
              </div>

              {/* Collapsible Radar Chart */}
              <details className="radar-collapsible">
                <summary className="radar-toggle">
                  <span className="radar-toggle-icon">📡</span>
                  Performance Radar
                  <span className="radar-chevron" />
                </summary>
                <div className="radar-collapsible-body">
                  <RadarChart compareResults={compareResults} />
                </div>
              </details>

              {/* Collapsible Winner Summary */}
              <details className="radar-collapsible">
                <summary className="radar-toggle">
                  <span className="radar-toggle-icon">🏆</span>
                  Best Algorithm Summary
                  <span className="radar-chevron" />
                </summary>
                <div className="radar-collapsible-body">
                  <div className="winner-grid">
                    {[
                      { label: 'Fastest Turnaround', key: 'avgTurnaround', best: 'min' },
                      { label: 'Lowest Waiting', key: 'avgWaiting', best: 'min' },
                      { label: 'CPU Utilization', key: 'cpuUtilization', best: 'max' },
                      { label: 'Throughput', key: 'throughput', best: 'max' },
                      { label: 'Fastest Execution', key: 'totalExecution', best: 'min' },
                    ].map((metric) => {
                      const entries = Object.entries(compareResults);
                      const winner = entries.reduce((best, [key, res]) => {
                        const val = res.stats[metric.key];
                        if (!best || (metric.best === 'min' ? val < best.val : val > best.val)) {
                          return { key, val };
                        }
                        return best;
                      }, null);
                      return (
                        <div key={metric.key} className="winner-card">
                          <span className="winner-label">{metric.label}</span>
                          <span className="winner-algo">
                            <span className="algo-badge">{ALGORITHMS[winner.key]?.short}</span>
                          </span>
                          <span className="winner-value">{winner.val}{metric.key === 'cpuUtilization' ? '%' : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>

        <footer className="app-footer">
          <div className="footer-main">
            <span className="footer-dot" />
            <span>CPU Scheduling Simulator</span>
          </div>
          <p className="footer-sub">
            6 Algorithms • Real-time Visualization • Built with Next.js
          </p>
        </footer>
      </main>

      {/* Learn Modal */}
      {learnAlgo && (
        <LearnModal algoKey={learnAlgo} onClose={() => setLearnAlgo(null)} />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
