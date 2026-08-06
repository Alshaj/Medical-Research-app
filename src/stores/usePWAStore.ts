import { create } from 'zustand';

interface PWAState {
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  deferredPrompt: any | null;
  setDeferredPrompt: (prompt: any) => void;
  isInstallable: boolean;
  setIsInstallable: (installable: boolean) => void;
  clearInstallPrompt: () => void;
}

export const usePWAStore = create<PWAState>((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  setIsOnline: (online) => set({ isOnline: online }),
  deferredPrompt: null,
  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt, isInstallable: !!prompt }),
  isInstallable: false,
  setIsInstallable: (installable) => set({ isInstallable: installable }),
  clearInstallPrompt: () => set({ deferredPrompt: null, isInstallable: false })
}));
