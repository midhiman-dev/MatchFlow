import { Order, OrderStatus, OrderItem, CartState, ServiceMode, MenuProduct } from '../domain/ordering/types';

/**
 * Creates a deterministic order reference (ID).
 * Format: MF-[USER_PREIX]-[TIMESTAMP]
 */
export const generateOrderReference = (userId: string): string => {
  const prefix = userId.substring(0, 4).toUpperCase();
  const ts = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `MF-${prefix}-${ts}-${random}`;
};

/**
 * Initialize an empty cart.
 */
export const createInitialCart = (mode: ServiceMode = 'Pickup'): CartState => ({
  items: [],
  total: 0,
  serviceMode: mode
});

/**
 * Add or update an item in the cart.
 */
export const updateCartItem = (
  cart: CartState, 
  product: MenuProduct, 
  quantity: number
): CartState => {
  const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
  let newItems = [...cart.items];

  if (quantity <= 0) {
    newItems = newItems.filter(item => item.productId !== product.id);
  } else if (existingItemIndex > -1) {
    newItems[existingItemIndex] = {
      ...newItems[existingItemIndex],
      quantity
    };
  } else {
    newItems.push({
      id: `item-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity
    });
  }

  const total = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return {
    ...cart,
    items: newItems,
    total
  };
};

/**
 * Convert a cart to an Order object.
 * Handles the offline pending sync hook via status and flag.
 */
export const placeOrder = (
  cart: CartState, 
  userId: string, 
  connectivity: 'Connected' | 'Weak' | 'Offline'
): Order => {
  const isOffline = connectivity === 'Offline';
  const timestamp = new Date().toISOString();
  const status: OrderStatus = isOffline ? 'Pending' : 'Confirmed';
  
  return {
    id: generateOrderReference(userId),
    items: [...cart.items],
    total: cart.total,
    status,
    timestamp,
    type: cart.serviceMode,
    seatInfo: cart.seatInfo,
    statusHistory: [{ status, timestamp }],
    isOfflinePending: isOffline
  };
};

/**
 * Progression model for lightweight order tracking.
 */
export const getNextStatus = (current: OrderStatus): OrderStatus => {
  switch (current) {
    case 'Pending': return 'Confirmed';
    case 'Confirmed': return 'Preparing';
    case 'Preparing': return 'Ready';
    case 'Ready': return 'Completed';
    default: return current;
  }
};

/**
 * Progress an order to its next logical state.
 */
export const progressOrder = (order: Order): Order => {
  const nextStatus = getNextStatus(order.status);
  if (nextStatus === order.status) return order;

  const timestamp = new Date().toISOString();
  return {
    ...order,
    status: nextStatus,
    statusHistory: [...order.statusHistory, { status: nextStatus, timestamp }]
  };
};
