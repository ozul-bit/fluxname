import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-5 right-5 z-[2000] flex flex-col gap-2.5">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            bg-slate-800 border border-slate-700 px-6 py-4 rounded-xl flex items-center gap-3
            shadow-xl animate-slide-in
            ${toast.type === 'success' ? 'border-l-4 border-l-emerald-500' : ''}
            ${toast.type === 'error' ? 'border-l-4 border-l-red-500' : ''}
            ${toast.type === 'warning' ? 'border-l-4 border-l-amber-500' : ''}
          `}
        >
          <span>
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '⚠️'}
          </span>
          <span className="text-slate-100">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
