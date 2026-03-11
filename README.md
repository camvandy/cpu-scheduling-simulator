# CPU Scheduling Simulator

An interactive, professional CPU scheduling algorithm simulator built with **Next.js** and **React**. Visualize and compare 6 classic scheduling algorithms with real-time Gantt charts and performance metrics.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)

## Algorithms

| Algorithm | Type | Description |
|-----------|------|-------------|
| **FCFS** | Non-Preemptive | First Come First Served — processes execute in arrival order |
| **SRTF** | Preemptive | Shortest Remaining Time First — always runs the job closest to completion |
| **Round Robin** | Preemptive | Time-sliced scheduling with configurable quantum |
| **Priority (NP)** | Non-Preemptive | Runs highest-priority arrived process to completion |
| **Priority (P)** | Preemptive | Higher-priority arrivals interrupt running processes |
| **MLFQ** | Preemptive | Multilevel Feedback Queue with dynamic quantum (q = 2 × level) |

## Features

- **Interactive Process Editor** — Add, remove, and edit processes directly in the browser
- **File Upload** — Import process data from text files
- **Random Generator** — Quick-generate random process sets for testing
- **Gantt Chart Visualization** — Color-coded timeline blocks with hover tooltips
- **Performance Metrics** — Avg turnaround, avg waiting, CPU utilization, throughput
- **Algorithm Comparison** — Run all 6 algorithms simultaneously and compare results side-by-side
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Mode** — Premium dark UI with glassmorphism and gradient accents

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Input File Format

```
Process Burst Priority Arrival
P1      4     3        0
P2      8     1        1
P3      2     4        3
P4      6     5        10
P5      5     2        12
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 18
- **Styling**: Vanilla CSS (no Tailwind)
- **Fonts**: Inter + JetBrains Mono
- **Deployment**: Vercel-ready

## Origin

This project is a professional reimagining of a CPU scheduling assignment originally written in C for COMP-3300: Operating Systems. The core scheduling algorithms have been ported from C to JavaScript and wrapped in a modern, interactive web interface.
