<div align="center">

# 🖥️ CPU Scheduling Simulator

**Interactive visualization of 6 classic CPU scheduling algorithms**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-22d3ee?style=for-the-badge)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)

A professional, interactive web application for simulating and comparing CPU scheduling algorithms. Built with Next.js and React, featuring real-time Gantt chart visualizations, editable process tables, and side-by-side algorithm comparison.

</div>

---

## 📸 Screenshots

### Algorithm Selection & Process Editor
<div align="center">
<img src="docs/screenshots/hero.png?v=2026" alt="CPU Scheduling Simulator — Algorithm selection and process editor" width="800"/>
</div>

> Select from 6 scheduling algorithms, configure process data interactively, or upload from a file.

### Simulation Results & Gantt Chart
<div align="center">
<img src="docs/screenshots/results.png?v=2026" alt="FCFS results with performance metrics, Gantt chart, and scheduling table" width="800"/>
</div>

> View performance metrics, visualize execution on a color-coded Gantt chart, and inspect per-process scheduling details.

### Algorithm Comparison Mode
<div align="center">
<img src="docs/screenshots/comparison.png?v=2026" alt="Side-by-side comparison of all 6 scheduling algorithms" width="800"/>
</div>

> Run all 6 algorithms simultaneously and compare turnaround time, waiting time, CPU utilization, and throughput in a single view.

---

## ⚡ Features

| Feature | Description |
|---------|-------------|
| 🎛️ **6 Scheduling Algorithms** | FCFS, SRTF, Round Robin, Priority (P & NP), MLFQ |
| 📊 **Gantt Chart Visualization** | Color-coded timeline blocks with hover tooltips and legend |
| 📈 **Performance Metrics** | Avg turnaround, avg waiting, CPU utilization, throughput |
| ⚡ **Algorithm Comparison** | Run all algorithms simultaneously, compare side-by-side |
| ✏️ **Interactive Process Editor** | Add, remove, and edit processes directly in the browser |
| 📁 **File Upload** | Import process data from text files |
| 🎲 **Random Generator** | Quick-generate random process sets for testing |
| 🌙 **Dark Mode UI** | Premium glassmorphism design with gradient accents |
| 📱 **Responsive** | Optimized for desktop, tablet, and mobile |

---

## 🧮 Algorithms

| Algorithm | Key | Type | How It Works |
|-----------|-----|------|-------------|
| **First Come First Served** | `FCFS` | Non-Preemptive | Processes execute strictly in arrival order |
| **Shortest Remaining Time First** | `SRTF` | Preemptive | Always runs the job closest to completion |
| **Round Robin** | `RR` | Preemptive | Time-sliced with a configurable quantum |
| **Priority (Non-Preemptive)** | `Pri-NP` | Non-Preemptive | Runs highest-priority process to completion before switching |
| **Priority (Preemptive)** | `Pri-P` | Preemptive | Higher-priority arrivals interrupt running processes |
| **Multilevel Feedback Queue** | `MLFQ` | Preemptive | Processes move between queues; quantum doubles per level (`q = 2 × level`) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/camvandy/cpu-scheduling-simulator.git
cd cpu-scheduling-simulator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📄 Input File Format

You can upload a `.txt` file with the following format:

```
Process Burst Priority Arrival
P1      4     3        0
P2      8     1        1
P3      2     4        3
P4      6     5        10
P5      5     2        12
```

> The header row is optional. Each subsequent line defines a process with its burst time, priority, and arrival time.

---

## 🏗️ Project Structure

```
cpu-scheduling-simulator/
├── app/
│   ├── globals.css        # Design system — dark mode, glassmorphism, animations
│   ├── layout.js          # Root layout with SEO metadata & fonts
│   └── page.js            # Main application page
├── components/
│   ├── AlgorithmSelector.jsx   # Algorithm picker with card UI
│   ├── GanttChart.jsx          # Gantt chart timeline visualization
│   ├── ProcessTable.jsx        # Editable process data table
│   ├── ResultsTable.jsx        # Per-process scheduling results
│   └── StatsPanel.jsx          # Aggregate performance metrics
├── lib/
│   ├── fileParser.js      # Input file parser
│   ├── process.js         # Process factory & clone utility
│   └── scheduler.js       # All 6 scheduling algorithm implementations
├── public/
│   └── sample-input.txt   # Example process data
└── docs/
    └── screenshots/       # README images
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **UI** | [React 18](https://react.dev/) |
| **Styling** | Vanilla CSS (no Tailwind) |
| **Typography** | [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) |
| **Deployment** | Vercel-ready |

---

## 📖 Origin

This project is a professional reimagining of a CPU scheduling assignment originally written in C for **COMP-3330: Operating Systems**. The core scheduling algorithms have been ported from C to JavaScript and wrapped in a modern, interactive web interface with real-time visualization.

---

<div align="center">

**Built with ☕ and Next.js**

</div>
