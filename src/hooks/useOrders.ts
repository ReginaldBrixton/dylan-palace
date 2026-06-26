import { useCallback } from 'react';
import { Order } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, SEED_ORDERS } from '../constants';
import { triggerHaptic } from '../utils/haptic';
import { generateOrderId } from '../utils/format';
import { CartItem, CheckoutDetails } from '../types';

export function useOrders() {
  const [pastOrders, setPastOrders] = useLocalStorage<Order[]>(STORAGE_KEYS.ORDERS, []);

  const addOrder = useCallback((details: CheckoutDetails, cartItems: CartItem[]) => {
    triggerHaptic('heavy');

    const newOrder: Order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      items: [...cartItems],
      totalAmount: details.totalAmount,
      status: 'PROCESSING',
      details: {
        fullName: details.fullName,
        email: details.email,
        address: details.address,
        city: details.city,
      },
    };

    setPastOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, [setPastOrders]);

  const getSeedOrders = useCallback((): Order[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (saved && JSON.parse(saved).length > 0) {
      return JSON.parse(saved);
    }
    return SEED_ORDERS() as Order[];
  }, []);

  return { pastOrders, addOrder, getSeedOrders };
}
