import React from 'react';
import { useMatchFlow } from '../../context/MatchFlowContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, Package, MapPin, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

export const OrderTracking: React.FC = () => {
  const { orders, connectivity, pendingSyncOrders } = useMatchFlow();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant mb-6">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-2xl font-headline font-bold text-primary">No orders yet</h2>
        <p className="text-on-surface-variant mt-2 max-w-xs">
          When you place an order, you'll see its real-time status here.
        </p>
      </div>
    );
  }

  const activeOrder = orders[0]; // Assuming we track the latest order

  const getStatusStep = (status: OrderStatus) => {
    const steps: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'];
    return steps.indexOf(status);
  };

  const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string; desc: string }> = {
    'Pending': { label: 'Pending Sync', icon: Clock, color: 'text-amber-500', desc: 'Waiting for network connection to confirm order.' },
    'Confirmed': { label: 'Confirmed', icon: CheckCircle2, color: 'text-emerald-500', desc: 'The vendor has received your order.' },
    'Preparing': { label: 'Preparing', icon: Package, color: 'text-primary', desc: 'Your snacks are being prepared now.' },
    'Ready': { label: 'Ready for Pickup', icon: MapPin, color: 'text-secondary', desc: 'Heading to Bay 4? Your order is waiting!' },
    'Completed': { label: 'Picked Up', icon: CheckCircle2, color: 'text-on-surface-variant', desc: 'Enjoy your match!' },
    'Failed': { label: 'Order Failed', icon: AlertCircle, color: 'text-error', desc: 'Something went wrong. Please check with the vendor.' },
  };

  const currentStatus = activeOrder.status;
  const config = statusConfig[currentStatus] || statusConfig['Pending'];
  const currentStep = getStatusStep(currentStatus);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-headline font-extrabold text-primary">Order Status</h2>
        <div className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          ID: {activeOrder.id}
        </div>
      </div>

      {/* Hero Status Card */}
      <motion.div 
        key={currentStatus}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 shadow-sm border border-outline-variant/10 text-center space-y-4"
      >
        <div className={`w-20 h-20 mx-auto rounded-full bg-surface-container flex items-center justify-center ${config.color} shadow-inner`}>
          <config.icon size={40} />
        </div>
        <div>
          <h3 className={`text-2xl font-headline font-bold ${config.color}`}>{config.label}</h3>
          <p className="text-on-surface-variant mt-1">{config.desc}</p>
        </div>
        
        {activeOrder.isOfflinePending && connectivity === 'Offline' && (
          <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-3 text-left">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-amber-800">
              You're currently offline. The order will be sent automatically when you reconnect.
            </p>
          </div>
        )}
      </motion.div>

      {/* Progress Steps */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/10">
        <div className="space-y-8 relative">
          {/* Vertical Line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-surface-container-highest" />
          <div 
            className="absolute left-[15px] top-2 w-0.5 bg-primary transition-all duration-1000" 
            style={{ height: `${(currentStep / 4) * 100}%` }}
          />

          {[
            { id: 'Pending', label: 'Order Sent' },
            { id: 'Confirmed', label: 'Order Confirmed' },
            { id: 'Preparing', label: 'Preparing Items' },
            { id: 'Ready', label: 'Ready for Collection' }
          ].map((step, index) => {
            const isCompleted = currentStep > index;
            const isCurrent = currentStep === index;
            const isUpcoming = currentStep < index;

            return (
              <div key={step.id} className="flex items-center gap-4 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                  isCompleted ? 'bg-primary border-primary text-white' : 
                  isCurrent ? 'bg-white border-primary text-primary shadow-lg shadow-primary/20' : 
                  'bg-white border-surface-container-highest text-on-surface-variant'
                }`}>
                  {isCompleted ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <div className="flex-1">
                  <p className={`font-bold transition-colors ${isUpcoming ? 'text-on-surface-variant/40' : 'text-primary'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs font-semibold text-on-surface-variant mt-0.5"
                    >
                      {activeOrder.type === 'InSeat' ? 'Delivering to Seat ' + activeOrder.seatInfo : 'Collect at Express Bay 4'}
                    </motion.p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary Recap */}
      <div className="bg-surface-container rounded-3xl p-6 space-y-4">
        <h4 className="font-headline font-bold text-primary flex items-center gap-2">
          <Package size={18} />
          Order Summary
        </h4>
        <div className="space-y-3">
          {activeOrder.items.map(item => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant font-medium">{item.quantity}x {item.name}</span>
              <span className="text-primary font-bold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="h-px bg-outline-variant/10 my-1" />
          <div className="flex justify-between items-center font-bold text-primary">
            <span>Total Amount</span>
            <span>${activeOrder.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {activeOrder.status === 'Completed' && (
        <button className="w-full bg-primary text-white py-4 rounded-2xl font-headline font-bold flex items-center justify-center gap-2 group">
          Order Another
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};
