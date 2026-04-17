/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import { MatchFlowProvider, useMatchFlow } from './context/MatchFlowContext';
import { FanApp } from './screens/FanApp';
import { OpsApp } from './screens/OpsApp';
import { StewardApp } from './screens/StewardApp';
import { RoleSwitcher } from './components/RoleSwitcher';

// Initialize Google Services for the application layer
import './lib/firebase';
import './lib/gemini';

function AppContent() {
  const { role } = useMatchFlow();

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

