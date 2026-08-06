import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ConfirmModalData {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

interface ToastStoreState {
  toasts: ToastItem[];
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;

  confirmModal: ConfirmModalData | null;
  openConfirmModal: (data: Omit<ConfirmModalData, 'isOpen'>) => void;
  closeConfirmModal: () => void;
}

export const useToastStore = create<ToastStoreState>((set, get) => ({
  toasts: [],

  addToast: (type, message) => {
    const id = `toast-${Date.now()}-${Math.random().toString().slice(-4)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 3500);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  confirmModal: null,

  openConfirmModal: (data) => {
    set({
      confirmModal: {
        ...data,
        isOpen: true,
      },
    });
  },

  closeConfirmModal: () => {
    set({ confirmModal: null });
  },
}));
