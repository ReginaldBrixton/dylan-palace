import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useSellerAuth } from '../../context/SellerAuthContext';

export default function SellerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useSellerAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/seller';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-1.5 text-[#8B8B8A] hover:text-white transition-colors mb-8 text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back to Store
        </button>

        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-white uppercase tracking-tighter mb-1">
            Seller Portal
          </h1>
          <p className="text-sm text-[#8B8B8A]">Dylan's Palace Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seller@dylanpalace.com"
                className="w-full bg-[#1a1a1a] text-white text-sm pl-10 pr-4 py-3 rounded-lg border border-[#333] focus:border-[#555] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A]">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#1a1a1a] text-white text-sm pl-10 pr-10 py-3 rounded-lg border border-[#333] focus:border-[#555] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B8A] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-white text-[#111111] py-3.5 rounded-lg font-semibold text-sm uppercase tracking-widest hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
