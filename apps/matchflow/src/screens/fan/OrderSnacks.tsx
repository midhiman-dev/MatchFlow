
import React, { useState } from 'react';
import { useMatchFlow } from '../../context/MatchFlowContext';
import { MENU_ITEMS } from '../../constants/menu';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Minus, CheckCircle2, Timer, Info, CreditCard, ChevronRight, UserCircle, MapPin } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ServiceMode, MenuProduct } from '../../types';
import { OrderTracking } from './OrderTracking';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const OrderSnacks: React.FC = () => {
  const { 
    cart, 
    orders, 
    connectivity, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    setServiceMode, 
    submitOrder 
  } = useMatchFlow();
  
  const [view, setView] = useState<'menu' | 'checkout' | 'tracking'>(orders.length > 0 ? 'tracking' : 'menu');
  const [seatInput, setSeatInput] = useState(cart.seatInfo || '');

  const total = cart.total;
  const cartItems = cart.items;

  const handleCheckout = () => {
    setView('checkout');
  };

  const handlePlaceOrder = () => {
    if (cart.serviceMode === 'InSeat' && !seatInput) {
      alert("Please enter your seat number for delivery.");
      return;
    }
    submitOrder();
    setView('tracking');
  };

  if (view === 'tracking') {
    return <OrderTracking />;
  }

  return (
    <div className="space-y-6 pb-8">
      {view === 'menu' && (
        <>
          {/* Promo Banner */}
          <section className="relative overflow-hidden bg-secondary-container rounded-2xl p-6 flex items-center justify-between shadow-lg">
            <div className="relative z-10">
              <p className="text-on-secondary-container font-headline font-bold text-lg leading-tight">Skip the line - pickup at Bay 4</p>
              <p className="text-on-secondary-container/80 text-sm font-semibold mt-1">Ready in approximately 10 mins</p>
            </div>
            <div className="relative z-10 bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 text-white">
              <Timer size={28} />
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </section>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline font-extrabold text-primary">Stadium Menu</h2>
            <div className="flex items-center gap-2 text-primary font-bold bg-primary/5 px-3 py-1 rounded-lg">
              <Info size={14} />
              <span className="text-sm">Quick Service</span>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 gap-4">
            {MENU_ITEMS.map((item) => {
              const cartItem = cart.items.find(i => i.productId === item.id);
              const quantity = cartItem?.quantity || 0;
              
              return (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm flex items-center p-3 border border-outline-variant/10 gap-4 group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container shrink-0">
                    <img 
                      src={`https://picsum.photos/seed/${item.id}/200`} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-primary truncate">{item.name}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-1 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-headline font-bold text-secondary">${item.price.toFixed(2)}</span>
                      
                      <div className="flex items-center gap-1">
                        {quantity > 0 ? (
                          <div className="flex items-center gap-3 bg-surface-container rounded-lg px-2 py-1">
                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-primary">
                              <Minus size={14} />
                            </button>
                            <span className="font-bold text-sm min-w-[1ch] text-center">{quantity}</span>
                            <button onClick={() => addToCart(item)} className="p-1 text-primary">
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => addToCart(item)}
                            className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Bar */}
          <AnimatePresence>
            {total > 0 && (
              <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="fixed bottom-24 left-4 right-4 z-40"
              >
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between group overflow-hidden relative"
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-white/20 p-2 rounded-lg text-white">
                      <ShoppingCart size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Review Cart</p>
                      <p className="font-bold">{cart.items.length} items • ${total.toFixed(2)}</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-white/10 skew-x-[-20deg] translate-x-10 group-hover:translate-x-0 transition-transform duration-500" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {view === 'checkout' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => setView('menu')} className="p-2 bg-surface-container rounded-xl text-primary">
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <h2 className="text-2xl font-headline font-extrabold text-primary">Checkout</h2>
          </div>

          {/* Service Mode Selection */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'Pickup', label: 'Self Pickup', icon: MapPin, desc: 'Express Bay 4' },
              { id: 'InSeat', label: 'In-Seat', icon: UserCircle, desc: 'Direct delivery' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setServiceMode(mode.id as ServiceMode, mode.id === 'Pickup' ? undefined : seatInput)}
                className={cn(
                  "p-4 rounded-2xl text-left border-2 transition-all",
                  cart.serviceMode === mode.id 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-outline-variant/10 bg-white"
                )}
              >
                <mode.icon size={24} className={cart.serviceMode === mode.id ? "text-primary" : "text-on-surface-variant"} />
                <p className="font-bold mt-2 text-primary">{mode.label}</p>
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-tighter">{mode.desc}</p>
              </button>
            ))}
          </div>

          {cart.serviceMode === 'InSeat' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-white rounded-2xl p-4 border border-outline-variant/10"
            >
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Enter Seat Number</label>
              <input 
                type="text" 
                placeholder="e.g. B-42"
                value={seatInput}
                onChange={(e) => {
                  setSeatInput(e.target.value);
                  setServiceMode('InSeat', e.target.value);
                }}
                className="w-full bg-surface-container px-4 py-3 rounded-xl font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>
          )}

          {/* Cart Recap */}
          <div className="bg-white rounded-2xl p-5 border border-outline-variant/10 space-y-4">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Order Summary</h4>
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-bold text-primary">{item.quantity}x {item.name}</span>
                  <span className="font-bold text-on-surface-variant">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="h-px bg-outline-variant/10 my-1" />
              <div className="flex justify-between items-center text-lg font-headline font-extrabold text-primary">
                <span>Total</span>
                <span className="text-secondary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold text-on-surface-variant">
                {connectivity === 'Offline' 
                  ? "Offline Mode: Order will sync on reconnect" 
                  : "Instant confirmation via Express Gateway"}
              </p>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={cart.serviceMode === 'InSeat' && !seatInput}
              className="w-full bg-primary text-white py-5 rounded-3xl font-headline font-bold text-xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              Place Order • ${total.toFixed(2)}
            </button>
            <p className="text-center text-[10px] text-on-surface-variant font-medium px-8 opacity-60">
              By placing the order, you agree to our stadium service terms. Mock payment simulated for demo purposes.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
