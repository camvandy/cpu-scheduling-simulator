'use client';

import { createProcess } from '@/lib/process';
import { parseProcessFile } from '@/lib/fileParser';
import { ALGORITHMS } from '@/lib/scheduler';

export default function ProcessTable({ processes, onChange, selectedAlgorithm }) {
  const needsPriority = ALGORITHMS[selectedAlgorithm]?.needsPriority;

  const updateProcess = (index, field, value) => {
    const updated = [...processes];
    updated[index] = { ...updated[index], [field]: parseInt(value) || 0 };
    if (field === 'burst') updated[index].remaining = updated[index].burst;
    onChange(updated);
  };

  const addProcess = () => {
    const nextPid = processes.length > 0 ? Math.max(...processes.map((p) => p.pid)) + 1 : 1;
    onChange([...processes, createProcess({ pid: nextPid, arrival: 0, burst: 1, priority: 0 })]);
  };

  const removeProcess = (index) => {
    if (processes.length <= 1) return;
    onChange(processes.filter((_, i) => i !== index));
  };

  const generateRandom = () => {
    const count = Math.floor(Math.random() * 4) + 4; // 4–7 processes
    const procs = [];
    for (let i = 0; i < count; i++) {
      procs.push(
        createProcess({
          pid: i + 1,
          arrival: Math.floor(Math.random() * 12),
          burst: Math.floor(Math.random() * 9) + 1,
          priority: Math.floor(Math.random() * 5) + 1,
        })
      );
    }
    onChange(procs);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const parsed = parseProcessFile(event.target.result);
      if (parsed.length > 0) onChange(parsed);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const loadSample = async () => {
    try {
      const res = await fetch('/sample-input.txt');
      const text = await res.text();
      const parsed = parseProcessFile(text);
      if (parsed.length > 0) onChange(parsed);
    } catch (err) {
      console.error('Failed to load sample data', err);
    }
  };

  return (
    <div className="process-table-section">
      <h2 className="section-title">
        <span className="section-icon">📋</span>
        Process Data
      </h2>

      <div className="table-actions">
        <button className="btn btn-primary" onClick={addProcess}>+ Add Process</button>
        <button className="btn btn-secondary" onClick={generateRandom}>🎲 Random</button>
        <button className="btn btn-secondary" onClick={loadSample}>📄 Sample Data</button>
        <label className="btn btn-secondary file-upload-label">
          📁 Upload File
          <input type="file" accept=".txt,.csv" onChange={handleFileUpload} hidden />
        </label>
      </div>

      <div className="table-container">
        <table className="process-table">
          <thead>
            <tr>
              <th>PID</th>
              <th>Arrival Time</th>
              <th>Burst Time</th>
              {needsPriority && <th>Priority</th>}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p, idx) => (
              <tr key={idx} className="process-row">
                <td>
                  <div className="pid-badge">P{p.pid}</div>
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={p.arrival}
                    onChange={(e) => updateProcess(idx, 'arrival', e.target.value)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={p.burst}
                    onChange={(e) => updateProcess(idx, 'burst', e.target.value)}
                    className="table-input"
                  />
                </td>
                {needsPriority && (
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={p.priority}
                      onChange={(e) => updateProcess(idx, 'priority', e.target.value)}
                      className="table-input"
                    />
                  </td>
                )}
                <td>
                  <button
                    className="btn-remove"
                    onClick={() => removeProcess(idx)}
                    title="Remove process"
                    disabled={processes.length <= 1}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
