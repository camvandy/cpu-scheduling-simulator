'use client';

import { useState } from 'react';
import { ALGORITHMS } from '@/lib/scheduler';

const ALGO_DETAILS = {
  fifo: {
    howItWorks: 'Processes are placed in a queue in the order they arrive. The CPU executes each process to completion before moving to the next one — no interruptions allowed.',
    strengths: [
      'Simplest to implement and understand',
      'No starvation — every process eventually runs',
      'Fair in the order of arrival',
      'Low scheduling overhead',
    ],
    weaknesses: [
      'Convoy effect — short processes wait behind long ones',
      'Poor average waiting time compared to SJF/SRTF',
      'Not suitable for interactive or time-sharing systems',
    ],
    useCases: 'Batch processing systems where simplicity is paramount, and all jobs are roughly similar in length.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
  },
  srtf: {
    howItWorks: 'At every time unit, the scheduler checks which arrived process has the shortest remaining burst time and runs it. If a new process arrives with a shorter remaining time, the current process is preempted.',
    strengths: [
      'Optimal average waiting time among all scheduling algorithms',
      'Very responsive to short processes',
      'Minimizes average turnaround time',
    ],
    weaknesses: [
      'High context-switching overhead',
      'Starvation risk for long-burst processes',
      'Requires knowledge (or prediction) of burst times',
    ],
    useCases: 'Systems where minimizing average response time is critical, like interactive computing environments.',
    timeComplexity: 'O(n² × t)',
    spaceComplexity: 'O(n)',
  },
  rr: {
    howItWorks: 'Each process is assigned a fixed time quantum. The scheduler cycles through the ready queue, giving each process one quantum of CPU time before moving to the next. If a process isn\'t finished, it\'s placed at the back of the queue.',
    strengths: [
      'Fair — every process gets equal CPU time',
      'Excellent response time for interactive systems',
      'No starvation',
      'Predictable behavior',
    ],
    weaknesses: [
      'Performance highly dependent on quantum size',
      'Too-small quantum → high context switching overhead',
      'Too-large quantum → degrades to FCFS behavior',
    ],
    useCases: 'Time-sharing systems, interactive computing, and operating systems where fairness and responsiveness matter most.',
    timeComplexity: 'O(n × ⌈B/q⌉)',
    spaceComplexity: 'O(n)',
  },
  priorityNP: {
    howItWorks: 'When the CPU is free, the scheduler selects the arrived process with the highest priority (lowest priority number). The selected process runs to completion without interruption.',
    strengths: [
      'Important processes get priority CPU access',
      'Simple to implement with a priority queue',
      'Good for systems with clear task importance hierarchy',
    ],
    weaknesses: [
      'Starvation — low-priority processes may never execute',
      'Priority inversion problems possible',
      'Requires a mechanism to set priorities fairly',
    ],
    useCases: 'Real-time systems, operating systems where certain system tasks must always take precedence over user tasks.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
  },
  priorityP: {
    howItWorks: 'Similar to non-preemptive priority, but if a higher-priority process arrives while a lower-priority process is running, the CPU immediately switches to the higher-priority process.',
    strengths: [
      'Very responsive to high-priority tasks',
      'Better average waiting time for important processes',
      'Real-time deadline guarantees when priorities are set correctly',
    ],
    weaknesses: [
      'Even more prone to starvation than non-preemptive',
      'High context-switching overhead',
      'Priority inversion can cause subtle bugs',
    ],
    useCases: 'Hard real-time systems (medical devices, avionics) and soft real-time systems (video streaming, gaming).',
    timeComplexity: 'O(n² × t)',
    spaceComplexity: 'O(n)',
  },
  mlfq: {
    howItWorks: 'Processes start in the highest-priority queue (level 1, quantum = 2). If a process uses its full quantum without finishing, it moves to the next lower queue where the quantum doubles (q = 2 × level). Higher-level queues are always served first.',
    strengths: [
      'Automatically adapts to process behavior',
      'Short processes finish quickly in high-priority queues',
      'CPU-bound processes get larger time slices at lower priority',
      'No prior burst-time knowledge required',
    ],
    weaknesses: [
      'Complex to implement correctly',
      'Starvation possible without aging mechanism',
      'Tuning queue parameters (quantum, number of levels) is challenging',
    ],
    useCases: 'General-purpose operating systems (Linux, macOS, Windows). The most practical scheduling algorithm used in real operating systems.',
    timeComplexity: 'O(n × levels)',
    spaceComplexity: 'O(n × levels)',
  },
};

export default function LearnModal({ algoKey, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const algo = ALGORITHMS[algoKey];
  const details = ALGO_DETAILS[algoKey];

  if (!algo || !details) return null;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'analysis', label: 'Analysis' },
    { key: 'complexity', label: 'Complexity' },
  ];

  return (
    <div className="learn-overlay" onClick={onClose}>
      <div className="learn-modal" onClick={(e) => e.stopPropagation()}>
        <div className="learn-modal-header">
          <h3 className="learn-modal-title">
            📖 {algo.name}
          </h3>
          <button className="learn-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="learn-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`learn-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="learn-content" key={activeTab}>
          {activeTab === 'overview' && (
            <>
              <h4>How It Works</h4>
              <p>{details.howItWorks}</p>
              <h4>Real-World Use Cases</h4>
              <p>{details.useCases}</p>
            </>
          )}

          {activeTab === 'analysis' && (
            <>
              <h4>Strengths</h4>
              <ul>
                {details.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
              <h4>Weaknesses</h4>
              <ul>
                {details.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </>
          )}

          {activeTab === 'complexity' && (
            <>
              <h4>Algorithm Complexity</h4>
              <div className="learn-complexity">
                <div className="learn-complexity-item">
                  <div className="learn-complexity-label">Time</div>
                  <div className="learn-complexity-value">{details.timeComplexity}</div>
                </div>
                <div className="learn-complexity-item">
                  <div className="learn-complexity-label">Space</div>
                  <div className="learn-complexity-value">{details.spaceComplexity}</div>
                </div>
              </div>
              <p style={{ marginTop: '1rem' }}>
                Where <em>n</em> = number of processes, <em>t</em> = total time units, 
                <em>B</em> = max burst time, and <em>q</em> = time quantum.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
