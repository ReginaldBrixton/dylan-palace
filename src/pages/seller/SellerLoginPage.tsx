import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, ArrowLeft } from 'lucide-react';
import { useSellerAuth } from '../../context/SellerAuthContext';

export default function SellerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithPin } = useSellerAuth();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const from = (location.state as any)?.from?.pathname || '/seller';

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length > 0) {
      const newPin = ['', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newPin[i] = pasted[i];
      }
      setPin(newPin);
      inputRefs.current[Math.min(pasted.length, 3)]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pinCode = pin.join('');
    if (pinCode.length !== 4) {
      setError('Enter all 4 digits');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signInWithPin(pinCode);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid PIN');
      setPin(['', '', '', '']);
      inputRefs.current[0]?.focus();
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
          onClick={() => navigate('/')}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#8B8B8A] flex items-center gap-1.5">
              <Lock size={12} /> Enter PIN
            </label>
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                  className="w-14 h-14 bg-[#1a1a1a] text-white text-center text-2xl font-bold rounded-lg border border-[#333] focus:border-white focus:outline-none transition-colors"
                />
              ))}
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading || pin.join('').length !== 4}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-white text-[#111111] py-3.5 rounded-lg font-semibold text-sm uppercase tracking-widest hover:bg-[#e0e0e0] transition-colors disabled:opacity-30 cursor-pointer"
          >
            {loading ? 'Verifying...' : 'Unlock'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
