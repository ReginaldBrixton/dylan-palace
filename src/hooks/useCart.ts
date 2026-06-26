import { useCallback } from 'react';
import { CartItem, Product } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';
import { triggerHaptic } from '../utils/haptic';

export function useCart() {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(STORAGE_KEYS.CART, []);

  const addToBag = useCallback((product: Product, size: string) => {
    triggerHaptic('medium');
    const itemId = `${product.id}-${size}`;
    setCartItems(prev => {
      const matchIndex = prev.findIndex(item => item.id === itemId);
      if (matchIndex > -1) {
        const copy = [...prev];
        copy[matchIndex] = { ...copy[matchIndex], quantity: copy[matchIndex].quantity + 1 };
        return copy;
      }
      return [...prev, { id: itemId, product, selectedSize: size, quantity: 1 }];
    });
  }, [setCartItems]);

  const updateQty = useCallback((itemId: string, change: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  }, [setCartItems]);

  const removeItem = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, [setCartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, [setCartItems]);

  return { cartItems, addToBag, updateQty, removeItem, clearCart };
}
