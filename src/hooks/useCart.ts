import { useCallback } from 'react';
import type { CartItem, Product } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';
import { triggerHaptic } from '../utils/haptic';

export function useCart() {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(STORAGE_KEYS.CART, []);

  const addToBag = useCallback((product: Product, size: string) => {
    triggerHaptic('medium');
    const variant = product.variants?.find((candidate) => candidate.size === size && candidate.stockQuantity > 0);
    const selectedVariantId = variant?.id;
    const itemId = `${product.id}-${selectedVariantId || size}`;

    setCartItems((current) => {
      const matchIndex = current.findIndex((item) => item.id === itemId);
      if (matchIndex > -1) {
        return current.map((item, index) => index === matchIndex ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { id: itemId, product, selectedSize: size, selectedVariantId, quantity: 1 }];
    });
  }, [setCartItems]);

  const updateQty = useCallback((itemId: string, change: number) => {
    setCartItems((current) => current.map((item) => item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item));
  }, [setCartItems]);

  const removeItem = useCallback((itemId: string) => setCartItems((current) => current.filter((item) => item.id !== itemId)), [setCartItems]);
  const clearCart = useCallback(() => setCartItems([]), [setCartItems]);

  return { cartItems, addToBag, updateQty, removeItem, clearCart };
}
