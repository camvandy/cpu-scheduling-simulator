'use client';

import { useState } from 'react';
import { createProcess } from '@/lib/process';
import { ALGORITHMS } from '@/lib/scheduler';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import ProcessTable from '@/components/ProcessTable';
import ResultsTable from '@/components/ResultsTable';
import GanttChart from '@/components/GanttChart';
import StatsPanel from '@/components/StatsPanel';

const DEFAULT_PROCESSES = [
  createProcess({ pid: 1, arrival: 0, burst: 4, priority: 3 }),
  createProcess({ pid: 2, arrival: 1, burst: 8, priority: 1 }),
  createProcess({ pid: 3, arrival: 3, burst: 2, priority: 4 }),
];

export default function Home() {
  const [selectedAlgo, setSelectedAlgo] = useState('fifo');
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES);
  const [quantum, setQuantum] = useState(2);
  const [result, setResult] = useState(null);
  const [compareResults, setCompareResults] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const runSimulation = () => {
    const algo = ALGORITHMS[selectedAlgo];
    if (!algo) return;

    const res = algo.needsQuantum ? algo.fn(processes, quantum) : algo.fn(processes);
    setResult(res);
    setCompareResults(null);
    setIsComparing(false);
  };

  const runComparison = () => {
    const results = {};
    for (const [key, algo] of Object.entries(ALGORITHMS)) {
      results[key] = algo.needsQuantum ? algo.fn(processes, quantum) : algo.fn(processes);
    }
    setCompareResults(results);
    setResult(null);
    setIsComparing(true);
  };

  const reset = () => {
    setResult(null);
    setCompareResults(null);
    setIsComparing(false);
  };

  return (
    <main className="app">
      <header className="hero">
        <div className="hero-glow" />
        <h1 className="hero-title">
          <span className="hero-icon">🖥️</span> CPU Scheduling Simulator
        </h1>
        <p className="hero-subtitle">
          Interactive visualization of 6 classic CPU scheduling algorithms
        </p>
      </header>

      <div className="container">
        <AlgorithmSelector
          selected={selectedAlgo}
          onSelect={(key) => { setSelectedAlgo(key); reset(); }}
          quantum={quantum}
          onQuantumChange={setQuantum}
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
                    return (
                      <tr key={key} className="comparison-row">
                        <td><span className="algo-badge">{algo.short}</span></td>
                        <td>{res.stats.avgTurnaround}</td>
                        <td>{res.stats.avgWaiting}</td>
                        <td>{res.stats.cpuUtilization}%</td>
                        <td>{res.stats.throughput}</td>
                        <td>{res.stats.totalExecution}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Show individual Gantt charts for each */}
            <div className="comparison-gantt-grid">
              {Object.entries(compareResults).map(([key, res]) => (
                <div key={key} className="comparison-gantt-item">
                  <h3 className="comparison-gantt-title">{ALGORITHMS[key].short}</h3>
                  <GanttChart gantt={res.gantt} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>CPU Scheduling Simulator — Built with Next.js</p>
        <p className="footer-sub">
          Ported from a C implementation • 6 Algorithms • Real-time Visualization
        </p>
      </footer>
    </main>
  );
}
