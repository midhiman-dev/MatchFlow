import { useMatchFlow } from '../context/MatchFlowContext';
import { MatchCenter } from './fan/MatchCenter';
import { Amenities } from './fan/Amenities';
import { RouteGuidance } from './fan/RouteGuidance';
import { OrderSnacks } from './fan/OrderSnacks';
import { AlertsCenter } from './fan/AlertsCenter';
import { EmergencyView } from './fan/EmergencyView';
import { FanBottomNav } from '../components/FanBottomNav';
import { FanHeader } from '../components/FanHeader';
import { ConnectivityOverlay } from '../components/ConnectivityOverlay';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../utils/cn';

export type FanTab = 'Match' | 'Amenities' | 'Route' | 'Order' | 'Alerts';

export const FanApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FanTab>('Match');
  const [prevTab, setPrevTab] = useState<FanTab>('Match');
  const { emergencyActive } = useMatchFlow();

  const tabOrder: FanTab[] = ['Match', 'Amenities', 'Route', 'Order', 'Alerts'];
  
  const handleTabChange = (newTab: FanTab) => {
    setPrevTab(activeTab);
    setActiveTab(newTab);
  };

  const direction = tabOrder.indexOf(activeTab) > tabOrder.indexOf(prevTab) ? 1 : -1;

  if (emergencyActive) {
    return <EmergencyView />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-container-low selection:bg-primary selection:text-white">
      {/* Global Shell Components */}
      <FanHeader />
      <ConnectivityOverlay />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto relative mt-20 pb-28">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={{
              enter: (direction: number) => ({
                x: direction > 0 ? '20%' : '-20%',
                opacity: 0,
                scale: 0.98
              }),
              center: {
                zIndex: 1,
                x: 0,
                opacity: 1,
                scale: 1
              },
              exit: (direction: number) => ({
                zIndex: 0,
                x: direction < 0 ? '20%' : '-20%',
                opacity: 0,
                scale: 0.98
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            className="w-full px-4"
          >
            {activeTab === 'Match' && <MatchCenter onNavigate={handleTabChange} />}
            {activeTab === 'Amenities' && <Amenities onNavigate={handleTabChange} />}
            {activeTab === 'Route' && <RouteGuidance />}
            {activeTab === 'Order' && <OrderSnacks />}
            {activeTab === 'Alerts' && <AlertsCenter />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Navigation */}
      <FanBottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};
