import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users as UsersIcon, ArrowLeft, Search, Mail, Phone, Shield, User } from 'lucide-react';
import { fetchProfiles } from '../../lib/api';
import type { Profile } from '../../lib/database.types';

export default function SellerUsers() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await fetchProfiles();
      setProfiles(data);
    } catch (err) {
      console.error('Failed to load profiles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = profiles.filter((p) =>
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    (p.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const customers = filtered.filter((p) => p.role === 'customer');
  const sellers = filtered.filter((p) => p.role === 'seller');

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
            { label: 'Users', path: '/seller/users', icon: UsersIcon },
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
              Users
            </h2>
            <p className="text-sm text-[#8B8B8A]">
              {customers.length} customers • {sellers.length} sellers
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full bg-white border border-[#E5E5E5] rounded-xl pl-10 pr-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition-all"
            />
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-[#8B8B8A]">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon size={32} className="text-[#E5E5E5] mx-auto mb-3" />
              <p className="text-sm text-[#8B8B8A]">No users found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl border border-[#E5E5E5] p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${profile.role === 'seller' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                      {profile.role === 'seller' ? (
                        <Shield size={18} className="text-purple-600" />
                      ) : (
                        <User size={18} className="text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#111111] truncate">
                        {profile.full_name || 'Unnamed'}
                      </p>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-0.5 ${profile.role === 'seller' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {profile.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs text-[#8B8B8A]">
                    <p className="flex items-center gap-1.5">
                      <Mail size={12} /> {profile.email}
                    </p>
                    {profile.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone size={12} /> {profile.phone}
                      </p>
                    )}
                    <p className="text-[10px] mt-1">
                      Joined: {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
