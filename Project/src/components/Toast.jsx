import React from 'react';

export default function Toast({ toasts = [], onRemove = () => {} }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div id="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type || 'info'} animate-slide-in`}
          onClick={() => onRemove(t.id)}
        >
          <span className="toast-icon">
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span className="toast-msg">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
