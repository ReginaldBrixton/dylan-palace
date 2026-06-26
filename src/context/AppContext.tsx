import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Product, CheckoutDetails } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useOrders } from '../hooks/useOrders';
import { countCartUnits } from '../utils/format';
import { triggerHaptic } from '../utils/haptic';

interface AppContextValue {
  cartItems: ReturnType<typeof useCart>['cartItems'];
  addToBag: ReturnType<typeof useCart>['addToBag'];
  updateQty: ReturnType<typeof useCart>['updateQty'];
  removeItem: ReturnType<typeof useCart>['removeItem'];
  clearCart: ReturnType<typeof useCart>['clearCart'];
  totalCartUnits: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  pastOrders: ReturnType<typeof useOrders>['pastOrders'];
  addOrder: ReturnType<typeof useOrders>['addOrder'];

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;

  lastOrder: CheckoutDetails | null;
  lastOrderId: string | undefined;
  handleOrderComplete: (details: CheckoutDetails) => void;

  handleAddtoBag: (product: Product, size: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<CheckoutDetails | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | undefined>(undefined);

  const { cartItems, addToBag, updateQty, removeItem, clearCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { pastOrders, addOrder } = useOrders();

  const totalCartUnits = useMemo(() => countCartUnits(cartItems), [cartItems]);

  const openCart = useCallback(() => setIsCartOpen(true), []);

  const handleAddtoBag = useCallback((product: Product, size: string) => {
    addToBag(product, size);
    setTimeout(() => setIsCartOpen(true), 450);
  }, [addToBag]);

  const handleOrderComplete = useCallback((details: CheckoutDetails) => {
    triggerHaptic('heavy');
    setLastOrder(details);
    const order = addOrder(details, cartItems);
    setLastOrderId(order.id);
    clearCart();
  }, [addOrder, cartItems, clearCart]);

  const value: AppContextValue = {
    cartItems,
    addToBag,
    updateQty,
    removeItem,
    clearCart,
    totalCartUnits,
    wishlist,
    toggleWishlist,
    pastOrders,
    addOrder,
    isCartOpen,
    setIsCartOpen,
    openCart,
    lastOrder,
    lastOrderId,
    handleOrderComplete,
    handleAddtoBag,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
