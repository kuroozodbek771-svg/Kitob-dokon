import React from 'react';
import { useBookStore } from '../../context/BookStoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBookStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-stone-900 text-white p-3.5 rounded-xl shadow-xl flex items-center justify-between gap-3 border border-stone-800 animate-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
              <span className="text-xs font-medium text-stone-100 truncate">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white p-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
