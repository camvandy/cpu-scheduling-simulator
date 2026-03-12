'use client';

import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLeaving(true), 2600);
    const remove = setTimeout(() => onDone?.(), 3000);
    return () => { clearTimeout(timer); clearTimeout(remove); };
  }, [onDone]);

  const icons = { success: '✅', info: 'ℹ️', error: '❌', warning: '⚠️' };

  return (
    <div className={`toast toast-${type} ${leaving ? 'toast-leave' : ''}`}>
      <span className="toast-icon">{icons[type] || icons.info}</span>
      <span className="toast-msg">{message}</span>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onDone={() => removeToast(t.id)} />
      ))}
    </div>
  );
}
