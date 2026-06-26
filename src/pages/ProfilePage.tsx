import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { getCachedProducts } from '../lib/product-cache';
import OrderCard from './profile/components/OrderCard';
import WishlistTab from './profile/components/WishlistTab';

export default function ProfileScreen() {
  const { pastOrders, wishlist: wishlistIds } = useApp();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    getCachedProducts().then(setAllProducts).catch(() => { });
  }, []);

  const wishlist = wishlistIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[];
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'WISHLIST'>('ORDERS');

  return (
    <div id="profile-screen" className="w-full flex flex-col pb-32 animate-fade-in bg-transparent min-h-screen pt-2">

      {/* Tabs list */}
      <div className="flex border-b border-[#E5E5E5] px-4 pt-1 shrink-0 mt-0">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`flex-1 pb-3 text-[11px] font-bold uppercase tracking-widest text-[#111111] border-b-2 transition-colors ${activeTab === 'ORDERS' ? 'border-[#111111] opacity-100' : 'border-transparent opacity-40'}`}
        >
          ORDERS
        </button>
        <button
          onClick={() => setActiveTab('WISHLIST')}
          className={`flex-1 pb-3 text-[11px] font-bold uppercase tracking-widest text-[#111111] border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'WISHLIST' ? 'border-[#111111] opacity-100' : 'border-transparent opacity-40'}`}
        >
          WISHLIST {wishlist.length > 0 && `(${wishlist.length})`}
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'ORDERS' && (
          <>
            {pastOrders.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Package size={24} className="text-[#E5E5E5] mb-3" />
                <p className="text-[13px] text-[#555555]">No past orders found.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {pastOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'WISHLIST' && (
          <WishlistTab wishlist={wishlist} />
        )}
      </div>
    </div>
  );
}
