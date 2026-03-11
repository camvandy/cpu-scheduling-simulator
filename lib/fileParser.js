/**
 * Parse process data from text file in the format:
 * Process  Burst  Priority  Arrival
 * P1       4      3         0
 * P2       8      1         1
 * ...
 */

import { createProcess } from './process';

export function parseProcessFile(text) {
  const lines = text.trim().split('\n');
  const processes = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Match lines like "P1  4  3  0" with flexible whitespace
    const match = line.match(/^P(\d+)\s+(\d+)\s+(\d+)\s+(\d+)$/i);
    if (match) {
      processes.push(
        createProcess({
          pid: parseInt(match[1], 10),
          burst: parseInt(match[2], 10),
          priority: parseInt(match[3], 10),
          arrival: parseInt(match[4], 10),
        })
      );
    }
  }

  return processes;
}
