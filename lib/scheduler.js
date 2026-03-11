/**
 * CPU Scheduling Engine
 * Ports all 6 algorithms from cpuScheduling.c to JavaScript.
 * Each function accepts an array of process objects and returns:
 *   { processes, gantt, stats }
 */

import { cloneProcesses } from './process';

/* ─── FIFO / First Come First Served ─────────────────────────────── */

export function fifo(inputProcesses) {
  const procs = cloneProcesses(inputProcesses);
  const gantt = [];

  // Sort by arrival time (stable)
  procs.sort((a, b) => a.arrival - b.arrival || a.pid - b.pid);

  let time = 0;
  for (const p of procs) {
    if (time < p.arrival) time = p.arrival;
    p.start = time;
    time += p.burst;
    p.finish = time;
    p.turnaround = p.finish - p.arrival;
    p.waiting = p.turnaround - p.burst;
    gantt.push({ pid: p.pid, start: p.start, end: p.finish });
  }

  return buildResult(procs, gantt);
}

/* ─── Shortest Remaining Time First (SRTF) ───────────────────────── */

export function srtf(inputProcesses) {
  const procs = cloneProcesses(inputProcesses);
  const gantt = [];
  const n = procs.length;

  let completed = 0;
  let time = 0;
  let currentGanttPid = -1;
  let currentGanttStart = 0;

  while (completed < n) {
    // Find process with shortest remaining time that has arrived
    let minIdx = -1;
    let minRemaining = Infinity;

    for (let i = 0; i < n; i++) {
      if (procs[i].remaining > 0 && procs[i].arrival <= time && procs[i].remaining < minRemaining) {
        minRemaining = procs[i].remaining;
        minIdx = i;
      }
    }

    if (minIdx === -1) {
      // No process available — push idle block and advance
      if (currentGanttPid !== -1) {
        gantt.push({ pid: currentGanttPid, start: currentGanttStart, end: time });
        currentGanttPid = -1;
      }
      time++;
      continue;
    }

    // Track Gantt chart transitions
    if (procs[minIdx].pid !== currentGanttPid) {
      if (currentGanttPid !== -1) {
        gantt.push({ pid: currentGanttPid, start: currentGanttStart, end: time });
      }
      currentGanttPid = procs[minIdx].pid;
      currentGanttStart = time;
    }

    if (procs[minIdx].start === -1) procs[minIdx].start = time;

    procs[minIdx].remaining--;
    time++;

    if (procs[minIdx].remaining === 0) {
      completed++;
      procs[minIdx].finish = time;
      procs[minIdx].turnaround = procs[minIdx].finish - procs[minIdx].arrival;
      procs[minIdx].waiting = procs[minIdx].turnaround - procs[minIdx].burst;
      if (procs[minIdx].waiting < 0) procs[minIdx].waiting = 0;

      gantt.push({ pid: currentGanttPid, start: currentGanttStart, end: time });
      currentGanttPid = -1;
    }
  }

  if (currentGanttPid !== -1) {
    gantt.push({ pid: currentGanttPid, start: currentGanttStart, end: time });
  }

  return buildResult(procs, gantt);
}

/* ─── Round Robin ─────────────────────────────────────────────────── */

export function roundRobin(inputProcesses, quantum = 2) {
  const procs = cloneProcesses(inputProcesses);
  const gantt = [];
  const n = procs.length;

  if (n === 0 || quantum <= 0) return buildResult(procs, gantt);

  const queue = [];
  const inQueue = new Array(n).fill(false);
  let completed = 0;
  let time = 0;

  // Sort by arrival to seed the queue
  const sortedIndices = procs.map((_, i) => i).sort((a, b) => procs[a].arrival - procs[b].arrival || procs[a].pid - procs[b].pid);

  // Enqueue initially arrived processes
  const enqueueArrivals = (upToTime) => {
    for (const i of sortedIndices) {
      if (!inQueue[i] && procs[i].arrival <= upToTime && procs[i].remaining > 0) {
        queue.push(i);
        inQueue[i] = true;
      }
    }
  };

  enqueueArrivals(time);

  while (completed < n) {
    if (queue.length === 0) {
      time++;
      enqueueArrivals(time);
      continue;
    }

    const idx = queue.shift();

    if (procs[idx].start === -1) procs[idx].start = time;

    const execTime = Math.min(procs[idx].remaining, quantum);
    gantt.push({ pid: procs[idx].pid, start: time, end: time + execTime });

    procs[idx].remaining -= execTime;
    time += execTime;

    // Enqueue newly arrived processes BEFORE re-enqueuing current
    enqueueArrivals(time);

    if (procs[idx].remaining === 0) {
      completed++;
      procs[idx].finish = time;
      procs[idx].turnaround = procs[idx].finish - procs[idx].arrival;
      procs[idx].waiting = procs[idx].turnaround - procs[idx].burst;
      inQueue[idx] = false;
    } else {
      // Re-enqueue at end
      queue.push(idx);
    }
  }

  return buildResult(procs, gantt);
}

/* ─── Priority Scheduling (Non-Preemptive) ────────────────────────── */

export function priorityNonPreemptive(inputProcesses) {
  const procs = cloneProcesses(inputProcesses);
  const gantt = [];
  const n = procs.length;

  let completed = 0;
  let time = 0;

  while (completed < n) {
    // Find highest-priority arrived process (lower number = higher priority)
    let bestIdx = -1;
    for (let i = 0; i < n; i++) {
      if (procs[i].remaining > 0 && procs[i].arrival <= time) {
        if (bestIdx === -1) {
          bestIdx = i;
        } else if (procs[i].priority < procs[bestIdx].priority) {
          bestIdx = i;
        } else if (procs[i].priority === procs[bestIdx].priority && procs[i].arrival < procs[bestIdx].arrival) {
          bestIdx = i;
        }
      }
    }

    if (bestIdx === -1) {
      time++;
      continue;
    }

    procs[bestIdx].start = time;
    time += procs[bestIdx].burst;
    procs[bestIdx].finish = time;
    procs[bestIdx].remaining = 0;
    procs[bestIdx].turnaround = procs[bestIdx].finish - procs[bestIdx].arrival;
    procs[bestIdx].waiting = procs[bestIdx].turnaround - procs[bestIdx].burst;
    completed++;

    gantt.push({ pid: procs[bestIdx].pid, start: procs[bestIdx].start, end: procs[bestIdx].finish });
  }

  return buildResult(procs, gantt);
}

/* ─── Priority Scheduling (Preemptive) ────────────────────────────── */

export function priorityPreemptive(inputProcesses) {
  const procs = cloneProcesses(inputProcesses);
  const gantt = [];
  const n = procs.length;

  // Initialize start times
  for (const p of procs) p.start = -1;

  let completed = 0;
  let time = 0;
  let currentGanttPid = -1;
  let currentGanttStart = 0;

  while (completed < n) {
    let bestIdx = -1;

    for (let i = 0; i < n; i++) {
      if (procs[i].remaining > 0 && procs[i].arrival <= time) {
        if (bestIdx === -1 || procs[i].priority < procs[bestIdx].priority) {
          bestIdx = i;
        }
      }
    }

    if (bestIdx === -1) {
      if (currentGanttPid !== -1) {
        gantt.push({ pid: currentGanttPid, start: currentGanttStart, end: time });
        currentGanttPid = -1;
      }
      time++;
      continue;
    }

    if (procs[bestIdx].pid !== currentGanttPid) {
      if (currentGanttPid !== -1) {
        gantt.push({ pid: currentGanttPid, start: currentGanttStart, end: time });
      }
      currentGanttPid = procs[bestIdx].pid;
      currentGanttStart = time;
    }

    if (procs[bestIdx].start === -1) procs[bestIdx].start = time;

    procs[bestIdx].remaining--;
    time++;

    if (procs[bestIdx].remaining === 0) {
      completed++;
      procs[bestIdx].finish = time;
      procs[bestIdx].turnaround = procs[bestIdx].finish - procs[bestIdx].arrival;
      procs[bestIdx].waiting = procs[bestIdx].turnaround - procs[bestIdx].burst;

      gantt.push({ pid: currentGanttPid, start: currentGanttStart, end: time });
      currentGanttPid = -1;
    }
  }

  if (currentGanttPid !== -1) {
    gantt.push({ pid: currentGanttPid, start: currentGanttStart, end: time });
  }

  return buildResult(procs, gantt);
}

/* ─── Multilevel Feedback Queue (MLFQ) ────────────────────────────── */

export function mlfq(inputProcesses) {
  const procs = cloneProcesses(inputProcesses);
  const gantt = [];
  const n = procs.length;
  const maxLevel = 10;

  // Initialize
  for (const p of procs) {
    p.timeQuantum = 2;
    p.queueLevel = 1;
    p.remaining = p.burst;
    p.waiting = 0;
    p.start = -1;
    p.turnaround = 0;
    p.finish = 0;
  }

  let completed = 0;
  let time = 0;

  while (completed < n) {
    let moved = false;

    for (let i = 0; i < n; i++) {
      if (procs[i].remaining <= 0 || procs[i].arrival > time) continue;

      // Check if a higher-priority process exists
      let higherExists = false;
      for (let j = 0; j < n; j++) {
        if (procs[j].remaining > 0 && procs[j].arrival <= time && procs[j].queueLevel < procs[i].queueLevel) {
          higherExists = true;
          break;
        }
      }

      if (procs[i].start === -1) procs[i].start = time;
      if (higherExists) continue;

      if (procs[i].remaining > procs[i].timeQuantum) {
        gantt.push({ pid: procs[i].pid, start: time, end: time + procs[i].timeQuantum });
        procs[i].remaining -= procs[i].timeQuantum;
        time += procs[i].timeQuantum;

        if (procs[i].queueLevel <= maxLevel) {
          procs[i].queueLevel++;
          procs[i].timeQuantum = 2 * procs[i].queueLevel;
        }
      } else {
        gantt.push({ pid: procs[i].pid, start: time, end: time + procs[i].remaining });
        time += procs[i].remaining;
        procs[i].remaining = 0;
        procs[i].finish = time;
        completed++;
      }

      moved = true;
    }

    if (!moved) time++;
  }

  // Calculate turnaround and waiting
  for (const p of procs) {
    p.turnaround = p.finish - p.arrival;
    p.waiting = p.turnaround - p.burst;
  }

  return buildResult(procs, gantt);
}

/* ─── Shared helpers ──────────────────────────────────────────────── */

function buildResult(procs, gantt) {
  const n = procs.length;
  if (n === 0) return { processes: [], gantt: [], stats: { avgTurnaround: 0, avgWaiting: 0, totalExecution: 0, cpuUtilization: 0, throughput: 0 } };

  const totalExecution = Math.max(...procs.map((p) => p.finish));
  const totalBurst = procs.reduce((sum, p) => sum + p.burst, 0);
  const avgTurnaround = procs.reduce((sum, p) => sum + p.turnaround, 0) / n;
  const avgWaiting = procs.reduce((sum, p) => sum + p.waiting, 0) / n;
  const cpuUtilization = totalExecution > 0 ? (totalBurst / totalExecution) * 100 : 0;
  const throughput = totalExecution > 0 ? n / totalExecution : 0;

  // Sort results by PID for display
  const sorted = [...procs].sort((a, b) => a.pid - b.pid);

  return {
    processes: sorted,
    gantt,
    stats: {
      avgTurnaround: Math.round(avgTurnaround * 100) / 100,
      avgWaiting: Math.round(avgWaiting * 100) / 100,
      totalExecution,
      cpuUtilization: Math.round(cpuUtilization * 100) / 100,
      throughput: Math.round(throughput * 100) / 100,
    },
  };
}

/* ─── Algorithm registry ──────────────────────────────────────────── */

export const ALGORITHMS = {
  fifo: { name: 'First Come First Served', short: 'FCFS', fn: fifo, needsQuantum: false, needsPriority: false, description: 'Processes are executed in order of arrival. Simple and fair, but can cause convoy effect.' },
  srtf: { name: 'Shortest Remaining Time First', short: 'SRTF', fn: srtf, needsQuantum: false, needsPriority: false, description: 'Preemptive version of SJF. Always runs the process closest to completion.' },
  rr: { name: 'Round Robin', short: 'RR', fn: roundRobin, needsQuantum: true, needsPriority: false, description: 'Each process gets a fixed time slice (quantum). Fair and responsive for interactive systems.' },
  priorityNP: { name: 'Priority (Non-Preemptive)', short: 'Pri-NP', fn: priorityNonPreemptive, needsQuantum: false, needsPriority: true, description: 'Runs the highest-priority arrived process to completion before switching.' },
  priorityP: { name: 'Priority (Preemptive)', short: 'Pri-P', fn: priorityPreemptive, needsQuantum: false, needsPriority: true, description: 'Higher-priority arrivals can interrupt running processes immediately.' },
  mlfq: { name: 'Multilevel Feedback Queue', short: 'MLFQ', fn: mlfq, needsQuantum: false, needsPriority: false, description: 'Processes move between queues based on behavior. Quantum doubles per level (q = 2 × level).' },
};
