import { MenuProduct } from '../domain/ordering/types';

export const MENU_ITEMS: MenuProduct[] = [
  {
    id: 'p1',
    name: 'Masala Chai',
    description: 'Authentic Indian spiced tea with ginger and cardamom.',
    price: 40,
    category: 'Drinks',
  },
  {
    id: 'p2',
    name: 'Samosa (2pcs)',
    description: 'Crispy pastry filled with spiced potatoes and peas.',
    price: 60,
    category: 'Snacks',
  },
  {
    id: 'p3',
    name: 'Butter Popcorn',
    description: 'Freshly popped corn with premium butter.',
    price: 120,
    category: 'Snacks',
  },
  {
    id: 'p4',
    name: 'Cold Drink (500ml)',
    description: 'Refreshing carbonated beverage (Coke/Pepsi).',
    price: 80,
    category: 'Drinks',
  },
  {
    id: 'p5',
    name: 'Vada Pav (2pcs)',
    description: 'Spicy potato fritter in a bun with dry garlic chutney.',
    price: 90,
    category: 'Snacks',
  },
  {
    id: 'p6',
    name: 'Match Day Combo',
    description: '2 Samosas, 1 Butter Popcorn, and 2 Masala Chais.',
    price: 250,
    category: 'Combos',
  }
];

export const ORDER_STATUS_PROGRESSION: Record<string, string> = {
  'Pending': 'Confirmed',
  'Confirmed': 'Preparing',
  'Preparing': 'Ready',
  'Ready': 'Completed'
};
