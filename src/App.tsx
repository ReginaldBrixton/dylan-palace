import React, { useState, useEffect } from 'react';
import { Screen, Product, CartItem, Order } from './types';
import { PRODUCTS } from './data';
import Splash from './components/Splash';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import ProductListScreen from './components/ProductListScreen';
import ProductDetailScreen from './components/ProductDetailScreen';
import CartDrawer from './components/CartDrawer';
import CheckoutScreen from './components/CheckoutScreen';
import SuccessScreen from './components/SuccessScreen';
import ProfileScreen from './components/ProfileScreen';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [category, setCategory] = useState<'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS'>('SHIRTS');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("dp_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("dp_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pastOrders, setPastOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("dp_orders");
      if (saved && JSON.parse(saved).length > 0) {
        return JSON.parse(saved);
      }

      // Default high-fashion seed order
      const seedOrder1: Order = {
        id: "DP-83021",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000 * 1.5).toISOString(), // 36 hours ago
        items: [
          {
            id: "p_ss1",
            product: PRODUCTS[0],
            selectedSize: "M",
            quantity: 1
          },
          {
            id: "p_ss2",
            product: PRODUCTS[1],
            selectedSize: "L",
            quantity: 2
          }
        ],
        totalAmount: PRODUCTS[0].price + PRODUCTS[1].price * 2,
        status: 'SHIPPED',
        details: {
          fullName: "Reginald Brixton",
          email: "reginaldbrixton@gmail.com",
          address: "12 Palace Boulevard",
          city: "Accra"
        }
      };

      const seedOrder2: Order = {
        id: "DP-79284",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5).toISOString(), // 5 days ago
        items: [
          {
            id: "p_ss3",
            product: PRODUCTS[2],
            selectedSize: "S",
            quantity: 1
          }
        ],
        totalAmount: PRODUCTS[2].price,
        status: 'DELIVERED',
        details: {
          fullName: "Reginald Brixton",
          email: "reginaldbrixton@gmail.com",
          address: "12 Palace Boulevard",
          city: "Accra"
        }
      };

      return [seedOrder1, seedOrder2];
    } catch {
      return [];
    }
  });

  const [lastOrder, setLastOrder] = useState<Order['details'] & { totalAmount: number, paymentMethod: string } | null>(null);

  // Sync cart data to local storage for realistic persistence
  useEffect(() => {
    try {
      localStorage.setItem("dp_cart", JSON.stringify(cartItems));
      localStorage.setItem("dp_wishlist", JSON.stringify(wishlist));
      localStorage.setItem("dp_orders", JSON.stringify(pastOrders));
    } catch (e) {
      // Ignored
    }
  }, [cartItems, wishlist, pastOrders]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddtoBag = (product: Product, size: string) => {
    if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback

    const itemId = `${product.id}-${size}`;
    setCartItems((prevItems) => {
      const matchIndex = prevItems.findIndex((item) => item.id === itemId);
      if (matchIndex > -1) {
        const copy = [...prevItems];
        copy[matchIndex] = {
          ...copy[matchIndex],
          quantity: copy[matchIndex].quantity + 1
        };
        return copy;
      } else {
        return [...prevItems, { id: itemId, product, selectedSize: size, quantity: 1 }];
      }
    });

    // Automatically slide up the cart modal for immediate tactical depth feedback
    setTimeout(() => {
      setIsCartOpen(true);
    }, 450);
  };

  const handleUpdateQty = (itemId: string, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleOrderComplete = (details: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    paymentMethod: 'MOMO' | 'DELIVERY';
    totalAmount: number;
  }) => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Haptic feedback on checkout complete

    setLastOrder(details);

    // Save to past orders
    const newOrder: Order = {
      id: Math.floor(100000 + Math.random() * 90000).toString(),
      date: new Date().toISOString(),
      items: [...cartItems],
      totalAmount: details.totalAmount,
      status: 'PROCESSING',
      details: {
        fullName: details.fullName,
        email: details.email,
        address: details.address,
        city: details.city
      }
    };

    setPastOrders(prev => [newOrder, ...prev]);
    setCartItems([]); // Clear bag after securing purchase
    setScreen('success');
  };

  const totalCartUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // When splash is done
  const handleSplashDone = () => {
    setScreen('home');
  };

  if (screen === 'splash') {
    return <Splash onComplete={handleSplashDone} />;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F9F9F8] text-[#111111] antialiased">

      {/* Standardized App Top Header Bar */}
      <Header
        currentScreen={screen}
        onNavigate={(target) => {
          setScreen(target);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        cartCount={totalCartUnits}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main View Port Frame (Sticky Safe gutters padding bottom and top) */}
      <main className={`flex-grow pb-[80px] ${screen === 'home' ? 'pt-0' : 'pt-[52px]'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            {screen === 'home' && (
              <HomeScreen
                onNavigate={(tgt) => {
                  setScreen(tgt);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                onSelectCategory={setCategory}
              />
            )}

            {screen === 'plp' && (
              <ProductListScreen
                currentCategory={category}
                onSelectCategory={setCategory}
                onSelectProduct={handleSelectProduct}
                onNavigate={(tgt) => {
                  setScreen(tgt);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              />
            )}

            {screen === 'pdp' && (
              <ProductDetailScreen
                product={selectedProduct}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onAddtoBag={handleAddtoBag}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {screen === 'checkout' && (
              <CheckoutScreen
                cartItems={cartItems}
                onOrderComplete={handleOrderComplete}
                onNavigate={(tgt) => {
                  setScreen(tgt);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              />
            )}

            {screen === 'success' && (
              <SuccessScreen
                orderDetails={lastOrder as any}
                onContinueShopping={() => {
                  setScreen('home');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              />
            )}

            {screen === 'profile' && (
              <ProfileScreen
                pastOrders={pastOrders}
                wishlist={wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[]}
                onSelectProduct={handleSelectProduct}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent slide-up modal bottom sheet summary drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setScreen('checkout');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
      />

      {/* Standardized Bottom category fast access nav shelf */}
      {screen !== 'success' && screen !== 'checkout' && (
        <BottomNav
          currentScreen={screen}
          currentCategory={category}
          onSelectCategory={setCategory}
          onNavigate={(target) => {
            setScreen(target);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        />
      )}

    </div>
  );
}
