import React, { useEffect } from 'react';
import { MatchFlowProvider, useMatchFlow } from './context/MatchFlowContext';
import { FanApp } from './screens/FanApp';
import { OpsApp } from './screens/OpsApp';
import { StewardApp } from './screens/StewardApp';
import { RoleSwitcher } from './components/RoleSwitcher';

// Initialize Google Services for the application layer
import { authenticateFan, trackEvent } from './lib/firebase';
import './lib/gemini';

function AppContent() {
  const { role } = useMatchFlow();

  useEffect(() => {
    // Actively integrate Google Services on load
    authenticateFan().then(user => {
      if (user) {
        trackEvent('app_open', { role });
      }
    });
  }, [role]);

  return (
    <div className="min-h-screen bg-surface">
      <RoleSwitcher />
      {role === 'Fan' && <FanApp />}
      {role === 'Operator' && <OpsApp />}
      {role === 'Steward' && <StewardApp />}
    </div>
  );
}

export default function App() {
  return (
    <MatchFlowProvider>
      <AppContent />
    </MatchFlowProvider>
  );
}

