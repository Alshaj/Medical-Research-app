import React from 'react';
import { Stethoscope, FilePlus, List, Download, Wifi, WifiOff, FileSpreadsheet } from 'lucide-react';
import { useRecordStore } from '../../stores/useRecordStore';
import { usePWAStore } from '../../stores/usePWAStore';
import { exportRecordsToExcel } from '../../services/excelExporter';
import { db } from '../../db/database';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, setEditingRecord } = useRecordStore();
  const { isOnline, deferredPrompt, isInstallable, clearInstallPrompt } = usePWAStore();

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
      clearInstallPrompt();
    }
  };

  const handleQuickExport = async () => {
    const allRecords = await db.records.toArray();
    exportRecordsToExcel(allRecords);
  };

  return (
    <header className="bg-teal-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('list')}>
            <div className="w-10 h-10 rounded-xl bg-teal-700 border border-teal-600 flex items-center justify-center shadow-inner">
              <Stethoscope className="w-6 h-6 text-teal-100" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">MedResearch</h1>
              <p className="text-[11px] text-teal-200 font-medium">Offline Clinical PWA</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-teal-900/60 p-1 rounded-xl border border-teal-700/50">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'list'
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-teal-100 hover:text-white hover:bg-teal-800/60'
              }`}
            >
              <List className="w-4 h-4" /> Patient Records
            </button>
            <button
              onClick={() => {
                setEditingRecord(null);
                setActiveTab('new');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'new'
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-teal-100 hover:text-white hover:bg-teal-800/60'
              }`}
            >
              <FilePlus className="w-4 h-4" /> New Patient
            </button>
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Offline Status Badge */}
            <div
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border font-medium ${
                isOnline
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/60'
                  : 'bg-amber-950/40 text-amber-300 border-amber-700/60'
              }`}
              title={isOnline ? 'Offline-Ready (Data stays local in IndexedDB)' : 'Device is offline - Fully functional!'}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isOnline ? 'Offline-Ready' : 'Offline Mode'}</span>
            </div>

            {/* Install PWA Button if prompt captured */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition flex items-center gap-1.5 animate-pulse"
              >
                <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Install App</span><span className="sm:hidden">Install</span>
              </button>
            )}

            {/* Quick Export Button */}
            <button
              onClick={handleQuickExport}
              className="bg-teal-700 hover:bg-teal-600 text-teal-100 text-xs font-medium px-3 py-1.5 rounded-lg border border-teal-600 transition flex items-center gap-1.5"
              title="Export all records to Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          </div>
        </div>

        {/* Touch-Friendly Mobile Navigation Tabs */}
        <div className="flex md:hidden border-t border-teal-700/50 py-2 justify-around text-xs">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all font-semibold ${
              activeTab === 'list' ? 'bg-white text-teal-900 shadow-sm' : 'text-teal-100 hover:bg-teal-700/50'
            }`}
          >
            <List className="w-4 h-4" /> Patient Records
          </button>
          <button
            onClick={() => {
              setEditingRecord(null);
              setActiveTab('new');
            }}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all font-semibold ${
              activeTab === 'new' ? 'bg-white text-teal-900 shadow-sm' : 'text-teal-100 hover:bg-teal-700/50'
            }`}
          >
            <FilePlus className="w-4 h-4" /> Add Patient
          </button>
        </div>
      </div>
    </header>
  );
};
