import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';

export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorage<string[]>(STORAGE_KEYS.WISHLIST, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, [setWishlist]);

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  return { wishlist, toggleWishlist, isWishlisted };
}
