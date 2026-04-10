export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Failed';
export type ServiceMode = 'Pickup' | 'InSeat';

export interface MenuProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Snacks' | 'Drinks' | 'Combos';
  imageUrl?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string; // Deterministic reference for tracking
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  timestamp: string;
  type: ServiceMode;
  seatInfo?: string; // Only for 'InSeat'
  statusHistory: { status: OrderStatus; timestamp: string }[];
  isOfflinePending?: boolean; // Offline pending sync hook
}

export interface CartState {
  items: OrderItem[];
  total: number;
  serviceMode: ServiceMode;
  seatInfo?: string;
}
