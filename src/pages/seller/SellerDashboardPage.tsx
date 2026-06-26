import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { useSellerAuth } from '../../context/SellerAuthContext';
import { fetchDashboardStats, fetchRecentOrders } from '../../lib/api';
import type { Order } from '../../lib/database.types';
import { CURRENCY } from '../../constants';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalUsers: number;
}

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { signOut } = useSellerAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [s, orders] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentOrders(5),
      ]);
      setStats(s);
      setRecentOrders(orders);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSignOut = () => {
    signOut();
    navigate('/home');
  };

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts ?? '—', icon: Package, color: 'text-blue-600' },
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: 'text-green-600' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? '—', icon: Clock, color: 'text-orange-600' },
    { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users, color: 'text-purple-600' },
  ];

  const navItems = [
    { label: 'Dashboard', path: '/seller', icon: LayoutDashboard },
    { label: 'Products', path: '/seller/products', icon: Package },
    { label: 'Orders', path: '/seller/orders', icon: ShoppingBag },
    { label: 'Users', path: '/seller/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#111111] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-[#333]">
          <h1 className="font-serif text-xl font-bold uppercase tracking-tighter">Dylan's Palace</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#8B8B8A] mt-0.5">Seller Portal</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => (
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

        <div className="p-4 border-t border-[#333]">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-[#8B8B8A] truncate">Seller</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#ccc] hover:bg-[#1a1a1a] hover:text-white transition-all cursor-pointer w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold text-[#111111] uppercase tracking-tighter mb-1">
              Dashboard
            </h2>
            <p className="text-sm text-[#8B8B8A]">Welcome back, Seller</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white rounded-xl p-5 border border-[#E5E5E5]"
              >
                <div className="flex items-center justify-between mb-3">
                  <card.icon size={20} className={card.color} />
                </div>
                <p className="text-2xl font-bold text-[#111111]">{card.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#8B8B8A] mt-1">{card.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5]">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#111111]">Recent Orders</h3>
              <button
                onClick={() => navigate('/seller/orders')}
                className="flex items-center gap-1 text-xs text-[#8B8B8A] hover:text-[#111111] transition-colors"
              >
                View All <ArrowRight size={12} />
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-[#8B8B8A]">Loading...</div>
            ) : recentOrders.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#8B8B8A]">No orders yet.</div>
            ) : (
              <div className="divide-y divide-[#E5E5E5]">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 hover:bg-[#F9F9F8] transition-colors">
                    <div>
                      <p className="text-sm font-bold text-[#111111]">{order.order_number}</p>
                      <p className="text-xs text-[#8B8B8A]">{order.full_name} • {order.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                        }`}>
                        {order.status}
                      </span>
                      <p className="text-sm font-bold text-[#111111]">{CURRENCY}{order.total_amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
