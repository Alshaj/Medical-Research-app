import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, ToastType } from '../../stores/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: { id: string; type: ToastType; message: string };
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const variants: Record<ToastType, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
    success: {
      bg: 'bg-emerald-900/95 text-white',
      border: 'border-emerald-700',
      text: 'text-emerald-100',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-900/95 text-white',
      border: 'border-rose-700',
      text: 'text-rose-100',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-900/95 text-white',
      border: 'border-amber-700',
      text: 'text-amber-100',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    },
    info: {
      bg: 'bg-teal-900/95 text-white',
      border: 'border-teal-700',
      text: 'text-teal-100',
      icon: <Info className="w-5 h-5 text-teal-400 shrink-0" />,
    },
  };

  const style = variants[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border ${style.bg} ${style.border} shadow-xl backdrop-blur transition-all duration-300 transform translate-y-0 animate-fade-in`}
    >
      <div className="flex items-center gap-3">
        {style.icon}
        <p className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition shrink-0 ml-2"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
