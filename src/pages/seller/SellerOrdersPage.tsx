import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  ArrowLeft,
  Search,
  X,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
} from 'lucide-react';
import { fetchOrders, fetchOrderItems, updateOrderStatus } from '../../lib/api';
import type { Order, OrderItem, OrderStatus } from '../../lib/database.types';
import { CURRENCY } from '../../constants';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const statusConfig: Record<OrderStatus, { icon: React.ElementType; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-orange-700', bg: 'bg-orange-100' },
  confirmed: { icon: Package, color: 'text-blue-700', bg: 'bg-blue-100' },
  shipped: { icon: Truck, color: 'text-purple-700', bg: 'bg-purple-100' },
  delivered: { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-100' },
  cancelled: { icon: XCircle, color: 'text-red-700', bg: 'bg-red-100' },
};

export default function SellerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.full_name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    setItemsLoading(true);
    try {
      const items = await fetchOrderItems(order.id);
      setOrderItems(items);
    } catch (err) {
      console.error('Failed to load order items:', err);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    setUpdating(true);
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#111111] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-[#333]">
          <h1 className="font-serif text-xl font-bold uppercase tracking-tighter">Dylan's Palace</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#8B8B8A] mt-0.5">Seller Portal</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {[
            { label: 'Dashboard', path: '/seller', icon: ArrowLeft },
            { label: 'Orders', path: '/seller/orders', icon: ShoppingBag },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#ccc] hover:bg-[#1a1a1a] hover:text-white transition-all cursor-pointer"
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#111111] uppercase tracking-tighter mb-1">
              Orders
            </h2>
            <p className="text-sm text-[#8B8B8A]">{orders.length} total orders</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order number, name, email..."
                className="w-full bg-white border border-[#E5E5E5] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#111111] transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#111111] transition-colors cursor-pointer"
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="text-center py-12 text-sm text-[#8B8B8A]">Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={32} className="text-[#E5E5E5] mx-auto mb-3" />
              <p className="text-sm text-[#8B8B8A]">No orders found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E5E5]">
                      <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-[#8B8B8A]">Order</th>
                      <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-[#8B8B8A]">Customer</th>
                      <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-[#8B8B8A]">Status</th>
                      <th className="text-right p-4 text-[10px] font-bold uppercase tracking-wider text-[#8B8B8A]">Total</th>
                      <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-[#8B8B8A]">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {filtered.map((order) => {
                      const cfg = statusConfig[order.status];
                      return (
                        <tr
                          key={order.id}
                          onClick={() => handleViewOrder(order)}
                          className="hover:bg-[#F9F9F8] transition-colors cursor-pointer"
                        >
                          <td className="p-4">
                            <p className="text-sm font-bold text-[#111111]">{order.order_number}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-[#111111]">{order.full_name}</p>
                            <p className="text-xs text-[#8B8B8A]">{order.email}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                              <cfg.icon size={10} />
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-sm font-bold text-[#111111]">{CURRENCY}{order.total_amount.toFixed(2)}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-xs text-[#8B8B8A]">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5] sticky top-0 bg-white z-10">
                <div>
                  <h3 className="font-bold text-base text-[#111111]">{selectedOrder.order_number}</h3>
                  <p className="text-xs text-[#8B8B8A]">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-[#8B8B8A] hover:text-[#111111] cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-5">
                {/* Status Update */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">Update Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {STATUS_OPTIONS.map((s) => {
                      const cfg = statusConfig[s];
                      return (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                          disabled={updating}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 ${
                            selectedOrder.status === s
                              ? `${cfg.bg} ${cfg.color} ring-2 ring-current`
                              : 'bg-[#F5F5F4] text-[#8B8B8A] hover:bg-[#E5E5E5]'
                          }`}
                        >
                          <cfg.icon size={10} />
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-[#F9F9F8] rounded-xl p-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A] mb-3">Customer</h4>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <p className="text-[#111111] font-medium">{selectedOrder.full_name}</p>
                    <p className="text-[#8B8B8A]">{selectedOrder.email}</p>
                    <p className="text-[#8B8B8A]">{selectedOrder.phone}</p>
                    <p className="text-[#8B8B8A]">{selectedOrder.address}, {selectedOrder.city} {selectedOrder.zip || ''}</p>
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-[#F9F9F8] rounded-xl p-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A] mb-3">Payment</h4>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <p className="text-[#111111]">
                      <span className="font-medium">Method:</span> {selectedOrder.payment_method}
                    </p>
                    {selectedOrder.momo_network && (
                      <p className="text-[#8B8B8A]">
                        <span className="font-medium">Network:</span> {selectedOrder.momo_network} ({selectedOrder.momo_number})
                      </p>
                    )}
                    {selectedOrder.tracking_number && (
                      <p className="text-[#8B8B8A]">
                        <span className="font-medium">Tracking:</span> {selectedOrder.tracking_number}
                      </p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A] mb-3">Items</h4>
                  {itemsLoading ? (
                    <p className="text-sm text-[#8B8B8A]">Loading items...</p>
                  ) : orderItems.length === 0 ? (
                    <p className="text-sm text-[#8B8B8A]">No items found.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.product_image && (
                            <img src={item.product_image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#111111]">{item.product_name}</p>
                            <p className="text-xs text-[#8B8B8A]">
                              {item.size && `Size: ${item.size} • `}Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-[#111111]">
                            {CURRENCY}{(item.unit_price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="border-t border-[#E5E5E5] pt-4 flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B8B8A]">Subtotal</span>
                    <span className="text-[#111111]">{CURRENCY}{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B8B8A]">Shipping</span>
                    <span className="text-[#111111]">{CURRENCY}{selectedOrder.shipping_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-[#E5E5E5]">
                    <span className="text-[#111111]">Total</span>
                    <span className="text-[#111111]">{CURRENCY}{selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
