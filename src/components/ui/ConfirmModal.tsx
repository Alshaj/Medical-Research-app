import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useToastStore } from '../../stores/useToastStore';
import { Button } from './Button';

export const ConfirmModalContainer: React.FC = () => {
  const { confirmModal, closeConfirmModal } = useToastStore();

  if (!confirmModal || !confirmModal.isOpen) return null;

  const handleConfirm = () => {
    confirmModal.onConfirm();
    closeConfirmModal();
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-5 animate-fade-in my-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{confirmModal.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{confirmModal.message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={closeConfirmModal}>
            {confirmModal.cancelText || 'Cancel'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 text-white"
            onClick={handleConfirm}
          >
            {confirmModal.confirmText || 'Confirm Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};
