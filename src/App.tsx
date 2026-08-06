import React, { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { useRecordStore } from './stores/useRecordStore';
import { PatientForm } from './features/patientForm/PatientForm';
import { RecordList } from './features/recordList/RecordList';
import { seedInitialDataIfEmpty } from './db/seedData';

export const App: React.FC = () => {
  const { activeTab } = useRecordStore();

  useEffect(() => {
    // Seed initial sample medical data on first application load if IndexedDB is empty
    seedInitialDataIfEmpty().catch((err) => console.error('Failed to seed initial data:', err));
  }, []);

  return (
    <Layout>
      {activeTab === 'list' && <RecordList />}
      {activeTab === 'new' && <PatientForm />}
    </Layout>
  );
};

export default App;
