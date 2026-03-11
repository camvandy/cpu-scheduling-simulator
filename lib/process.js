/**
 * Process factory — mirrors the cpuProcess struct from the original C code.
 */

export function createProcess({ pid, arrival, burst, priority = 0 }) {
  return {
    pid,
    arrival,
    burst,
    priority,
    // Computed by scheduling algorithms
    start: -1,
    finish: 0,
    turnaround: 0,
    waiting: 0,
    remaining: burst,
    queueLevel: 1,
    timeQuantum: 2,
  };
}

/**
 * Deep-clone an array of processes so algorithms don't mutate the original input.
 */
export function cloneProcesses(processes) {
  return processes.map((p) => ({ ...p, remaining: p.burst, start: -1, finish: 0, turnaround: 0, waiting: 0, queueLevel: 1, timeQuantum: 2 }));
}
