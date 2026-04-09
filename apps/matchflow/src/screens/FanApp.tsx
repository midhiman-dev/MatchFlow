
import React, { useState } from 'react';
import { useMatchFlow } from '../context/MatchFlowContext';
import { MatchCenter } from './fan/MatchCenter';
import { Amenities } from './fan/Amenities';
import { RouteGuidance } from './fan/RouteGuidance';
import { OrderSnacks } from './fan/OrderSnacks';
import { AlertsCenter } from './fan/AlertsCenter';
import { EmergencyView } from './fan/EmergencyView';
import { FanBottomNav } from '../components/FanBottomNav';
import { FanHeader } from '../components/FanHeader';
import { AnimatePresence, motion } from 'motion/react';

export type FanTab = 'Match' | 'Amenities' | 'Route' | 'Order' | 'Alerts';

export const FanApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FanTab>('Match');
  const { emergencyActive } = useMatchFlow();

  if (emergencyActive) {
    return <EmergencyView />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-container-low pb-24">
      <FanHeader />
      
      <main className="flex-1 overflow-y-auto px-4 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'Match' && <MatchCenter onNavigate={setActiveTab} />}
            {activeTab === 'Amenities' && <Amenities onNavigate={setActiveTab} />}
            {activeTab === 'Route' && <RouteGuidance />}
            {activeTab === 'Order' && <OrderSnacks />}
            {activeTab === 'Alerts' && <AlertsCenter />}
          </motion.div>
        </AnimatePresence>
      </main>

      <FanBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
