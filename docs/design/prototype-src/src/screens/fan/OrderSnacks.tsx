
import React, { useState } from 'react';
import { useMatchFlow } from '../../context/MatchFlowContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Minus, CheckCircle2, Timer, Info, CreditCard } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MENU_ITEMS = [
  { id: 'm1', name: 'Cricket Burger', price: 14.50, description: 'Double prime beef patty, spicy stadium sauce, and crisp lettuce.', image: 'https://picsum.photos/seed/burger/400/300', bestseller: true },
  { id: 'm2', name: 'Samosa (2pcs)', price: 6.00, description: 'Authentic spiced potato and pea filling with tangy mint chutney.', image: 'https://picsum.photos/seed/samosa/400/300' },
  { id: 'm3', name: 'Masala Chai', price: 4.50, description: 'Brewed with fresh ginger, cardamom, and premium Assam tea leaves.', image: 'https://picsum.photos/seed/tea/400/300' },
  { id: 'm4', name: 'Mineral Water', price: 3.50, description: '750ml chilled spring water for maximum stadium hydration.', image: 'https://picsum.photos/seed/water/400/300' },
];

export const OrderSnacks: React.FC = () => {
  const { placeOrder, orders, connectivity } = useMatchFlow();
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (id: string) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart(prev => {
    const next = { ...prev };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  });

  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const item = MENU_ITEMS.find(m => m.id === id)!;
    return { ...item, quantity: Number(quantity) };
  });

  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);

  const handlePlaceOrder = () => {
    placeOrder({
      items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      total,
      type: 'Pickup'
    });
    setOrderPlaced(true);
    setCart({});
    setTimeout(() => {
      setOrderPlaced(false);
      setShowCheckout(false);
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/20"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Order Confirmed!</h2>
          <p className="text-on-surface-variant mt-2">
            {connectivity === 'Offline' 
              ? "Your order is saved and will sync when you reconnect."
              : "Head to Bay 4 in 10 minutes for pickup."}
          </p>
        </div>
        <div className="bg-surface-container p-4 rounded-xl w-full max-w-xs">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Order ID</p>
          <p className="font-mono font-bold text-primary">#MF-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
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
          <span className="text-sm">Seat 42B</span>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MENU_ITEMS.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col group border border-outline-variant/10">
            <div className="h-48 overflow-hidden relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              {item.bestseller && (
                <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">Bestseller</div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-headline font-bold text-lg text-primary">{item.name}</h3>
                <span className="font-headline font-bold text-secondary">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{item.description}</p>
              
              <div className="mt-auto flex items-center gap-2">
                {cart[item.id] ? (
                  <div className="flex items-center justify-between w-full bg-surface-container rounded-xl p-1">
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-primary hover:bg-white rounded-lg transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-primary">{cart[item.id]}</span>
                    <button onClick={() => addToCart(item.id)} className="p-2 text-primary hover:bg-white rounded-lg transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => addToCart(item.id)}
                    className="w-full py-3 px-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Bar */}
      <AnimatePresence>
        {total > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-24 left-4 right-4 z-50"
          >
            <button 
              onClick={() => setShowCheckout(true)}
              className="w-full bg-primary text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between group overflow-hidden relative"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-white/20 p-2 rounded-lg">
                  <ShoppingCart size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold opacity-70 uppercase tracking-widest">View Cart</p>
                  <p className="font-bold">{cartItems.length} items selected</p>
                </div>
              </div>
              <div className="text-right relative z-10">
                <p className="text-2xl font-headline font-extrabold">${total.toFixed(2)}</p>
              </div>
              <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-white/10 skew-x-[-20deg] translate-x-10 group-hover:translate-x-0 transition-transform duration-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-[70] p-8 max-h-[80vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-surface-container-highest rounded-full mx-auto mb-8" />
              <h2 className="text-3xl font-headline font-extrabold text-primary mb-6">Checkout</h2>
              
              <div className="space-y-4 mb-8">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-surface-container rounded-lg flex items-center justify-center font-bold text-primary">{item.quantity}x</span>
                      <span className="font-bold text-primary">{item.name}</span>
                    </div>
                    <span className="font-bold text-on-surface-variant">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
                  </div>
                ))}
                <div className="h-px bg-outline-variant/20 my-4" />
                <div className="flex justify-between items-center text-xl font-headline font-extrabold">
                  <span>Total</span>
                  <span className="text-secondary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-surface-container rounded-2xl p-4 flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg text-primary">
                    <CreditCard size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface-variant uppercase">Payment Method</p>
                    <p className="font-bold">Apple Pay •••• 4242</p>
                  </div>
                  <button className="text-primary font-bold text-xs uppercase">Change</button>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-headline font-bold text-xl shadow-xl shadow-primary/20 active:scale-95 transition-transform"
                >
                  Confirm & Pay
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
