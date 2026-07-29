import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-card border shadow-lg backdrop-blur-xl transition-all duration-300 ${
            toast.type === 'error'
              ? 'bg-error-container/90 text-on-error border-error'
              : toast.type === 'info'
              ? 'bg-secondary-container/90 text-on-secondary-container border-secondary'
              : 'bg-surface-container-high/95 text-primary border-primary'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">
              {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle'}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-on-surface-variant hover:text-on-surface ml-2"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
