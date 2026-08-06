import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { usePWAStore } from '../../stores/usePWAStore';
import { RecordDetailModal } from '../../features/recordList/RecordDetailModal';
import { useRecordStore } from '../../stores/useRecordStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { setIsOnline, setDeferredPrompt } = usePWAStore();
  const { viewingRecord, setViewingRecord } = useRecordStore();

  useEffect(() => {
    // Listen to online/offline network status events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen to PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {children}
      </main>

      <RecordDetailModal record={viewingRecord} onClose={() => setViewingRecord(null)} />
    </div>
  );
};
