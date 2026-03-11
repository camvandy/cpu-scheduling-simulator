import './globals.css';

export const metadata = {
  title: 'CPU Scheduling Simulator',
  description: 'Interactive CPU scheduling algorithm simulator with real-time Gantt chart visualization. Supports FCFS, SRTF, Round Robin, Priority, and MLFQ algorithms.',
  keywords: ['CPU scheduling', 'operating systems', 'FCFS', 'SRTF', 'Round Robin', 'Priority scheduling', 'MLFQ', 'Gantt chart'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
