
import React from 'react';
import { FanTab } from '../screens/FanApp';
import { useMatchFlow } from '../context/MatchFlowContext';
import { Trophy, Store, Navigation, ShoppingCart, Bell } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FanBottomNavProps {
  activeTab: FanTab;
  onTabChange: (tab: FanTab) => void;
}

export const FanBottomNav: React.FC<FanBottomNavProps> = ({ activeTab, onTabChange }) => {
  const { alerts } = useMatchFlow();
  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  const tabs: { id: FanTab, label: string, icon: any, badge?: number }[] = [
    { id: 'Match', label: 'Match', icon: Trophy },
    { id: 'Amenities', label: 'Amenities', icon: Store },
    { id: 'Route', label: 'Route', icon: Navigation },
    { id: 'Order', label: 'Order', icon: ShoppingCart },
    { id: 'Alerts', label: 'Alerts', icon: Bell, badge: unreadAlerts },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-2xl border-t border-white/20 px-4 pb-8 pt-2 flex justify-around items-center shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
      {tabs.map(({ id, label, icon: Icon, badge }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={cn(
            "flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all relative",
            activeTab === id ? "bg-primary text-white scale-105" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 bg-secondary text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
              {badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};
