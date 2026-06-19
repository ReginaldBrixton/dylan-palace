import React, { useState } from 'react';
import { Order, Product } from '../types';
import { Package, Heart, ChevronRight } from 'lucide-react';

interface ProfileScreenProps {
  pastOrders: Order[];
  wishlist: Product[];
  onSelectProduct: (p: Product) => void;
}

export default function ProfileScreen({ pastOrders, wishlist, onSelectProduct }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'WISHLIST'>('ORDERS');

  return (
    <div id="profile-screen" className="w-full flex flex-col pb-32 animate-fade-in bg-transparent min-h-screen pt-2">
      
      {/* Tabs */}
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
              <div className="flex flex-col gap-3">
                {pastOrders.map((order) => (
                  <div key={order.id} className="border border-[#E5E5E5] p-4 text-left">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] text-[#8B8B8A] font-bold uppercase tracking-widest mb-0.5">ID: {order.id}</p>
                        <p className="text-[12px] text-[#111111]">{new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-[14px] font-bold text-[#111111]">GH₵{order.totalAmount.toFixed(2)}</p>
                        <span className="inline-block mt-0.5 text-[#8B8B8A] text-[9px] font-bold uppercase tracking-widest">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-[#E5E5E5] pt-3 text-[#555555]">
                      <ul className="flex flex-col gap-1.5">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center text-[11px]">
                            <span className="truncate pr-4">{item.quantity}x {item.product.name} ({item.selectedSize})</span>
                            <span className="flex-shrink-0">GH₵{(item.product.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'WISHLIST' && (
          <>
            {wishlist.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Heart size={24} className="text-[#E5E5E5] mb-3" />
                <p className="text-[13px] text-[#555555]">Your wishlist is empty.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
                {wishlist.map((product) => (
                  <div key={product.id} className="flex items-center py-3 gap-3 cursor-pointer group hover:bg-[#F9F9F8]" onClick={() => onSelectProduct(product)}>
                    <div className="w-16 h-20 bg-[#eeeeed] shrink-0">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold text-[#8B8B8A] uppercase tracking-wider mb-0.5">{product.brand || product.category}</p>
                      <h4 className="text-[12px] font-bold text-[#111111] truncate">{product.name}</h4>
                      <p className="font-serif text-[13px] font-bold text-[#111111] mt-1">GH₵{product.price.toFixed(2)}</p>
                    </div>
                    <ChevronRight size={16} className="text-[#E5E5E5] group-hover:text-[#111111] shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
