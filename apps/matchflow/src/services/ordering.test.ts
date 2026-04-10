import { 
  createInitialCart, 
  updateCartItem, 
  placeOrder, 
  progressOrder,
  generateOrderReference 
} from './orderService';
import { MENU_ITEMS } from '../constants/menu';
import { MenuProduct } from '../domain/ordering/types';

function runOrderingTests() {
  console.log('--- Ordering Domain Logic Tests ---');
  const mockProduct: MenuProduct = MENU_ITEMS[0]; // Masala Chai, 40

  let allPassed = true;

  // 1. Cart Management
  console.log('\n[TEST] Cart Management');
  const cart1 = createInitialCart();
  const cart1Pass = cart1.items.length === 0 && cart1.total === 0;
  console.log(`  Initial Cart: ${cart1Pass ? 'PASS' : 'FAIL'}`);

  const cart2 = updateCartItem(cart1, mockProduct, 2);
  const cart2Pass = cart2.items.length === 1 && cart2.items[0].quantity === 2 && cart2.total === 80;
  console.log(`  Add Item: ${cart2Pass ? 'PASS' : 'FAIL'}`);

  const cart3 = updateCartItem(cart2, mockProduct, 5);
  const cart3Pass = cart3.items[0].quantity === 5 && cart3.total === 200;
  console.log(`  Update Quantity: ${cart3Pass ? 'PASS' : 'FAIL'}`);

  const cart4 = updateCartItem(cart3, mockProduct, 0);
  const cart4Pass = cart4.items.length === 0 && cart4.total === 0;
  console.log(`  Remove Item: ${cart4Pass ? 'PASS' : 'FAIL'}`);

  const cartPass = cart1Pass && cart2Pass && cart3Pass && cart4Pass;

  // 2. Order Placement
  console.log('\n[TEST] Order Placement');
  let cart5 = createInitialCart('InSeat');
  cart5.seatInfo = 'A12';
  cart5 = updateCartItem(cart5, mockProduct, 1);
  
  const order1 = placeOrder(cart5, 'user123', 'Connected');
  const order1Pass = order1.status === 'Confirmed' && order1.type === 'InSeat' && order1.seatInfo === 'A12' && !order1.isOfflinePending;
  console.log(`  Place Online Order: ${order1Pass ? 'PASS' : 'FAIL'}`);

  const order2 = placeOrder(cart5, 'user123', 'Offline');
  const order2Pass = order2.status === 'Pending' && order2.isOfflinePending === true;
  console.log(`  Place Offline Order: ${order2Pass ? 'PASS' : 'FAIL'}`);

  const placementPass = order1Pass && order2Pass;

  // 3. Order Progression
  console.log('\n[TEST] Order Progression');
  let order3 = order1;
  const steps = ['Preparing', 'Ready', 'Completed'];
  let progressionPass = true;

  steps.forEach(expectedStatus => {
    order3 = progressOrder(order3);
    console.log(`  Progressing to ${expectedStatus}: ${order3.status === expectedStatus ? 'PASS' : 'FAIL'}`);
    if (order3.status !== expectedStatus) progressionPass = false;
  });

  const finalOrder = progressOrder(order3);
  const repeatPass = finalOrder.status === 'Completed' && finalOrder.statusHistory.length === 4;
  console.log(`  Terminal State (No Repeat): ${repeatPass ? 'PASS' : 'FAIL'}`);

  progressionPass = progressionPass && repeatPass;

  // 4. Reference Generation
  console.log('\n[TEST] Reference Generation');
  const ref = generateOrderReference('fan-99');
  const refPass = /^MF-FAN--\d{6}-\d{3}$/.test(ref);
  console.log(`  Reference ${ref} valid: ${refPass ? 'PASS' : 'FAIL'}`);

  allPassed = cartPass && placementPass && progressionPass && refPass;

  if (allPassed) {
    console.log('\nALL ORDERING TESTS PASSED');
  } else {
    console.error('\nSOME ORDERING TESTS FAILED');
    process.exit(1);
  }
}

runOrderingTests();
