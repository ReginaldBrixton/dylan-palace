import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import BrandLogo from '../../components/brand/BrandLogo';
import { useSellerAuth } from '../../context/SellerAuthContext';

export default function SellerLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useSellerAuth();
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/seller';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, passcode);
      navigate(from, { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[var(--color-ink)] text-white lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <section className="relative hidden overflow-hidden border-r border-white/10 p-12 lg:flex lg:flex-col lg:justify-between">
        <BrandLogo variant="wordmark" tone="light" className="h-8 w-auto" />
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Commerce operations</p>
          <h1 className="mt-5 font-serif text-6xl font-bold leading-[0.95] tracking-[-0.05em]">Run the store from one focused workspace.</h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/58">Manage products, imagery, inventory, orders and customers with seller-authorized access.</p>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-white/45"><ShieldCheck size={16} /> Protected by Supabase Auth and seller roles</div>
      </section>

      <section className="flex min-h-screen items-center px-5 py-10 sm:px-10 lg:px-14">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
          <button type="button" onClick={() => navigate('/')} className="mb-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/50 hover:text-white"><ArrowLeft size={15} /> Back to store</button>
          <BrandLogo variant="monogram" tone="light" className="mb-8 size-14 lg:hidden" />
          <h2 className="font-serif text-4xl font-bold tracking-[-0.04em]">Admin sign in</h2>
          <p className="mt-3 text-sm leading-6 text-white/55">Use the email and passcode assigned to a seller account. The passcode is never stored in the application bundle.</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="seller-email" className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Admin email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" aria-hidden="true" />
                <input id="seller-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-14 w-full rounded-[var(--radius-sm)] border border-white/15 bg-white/7 pl-12 pr-4 text-base text-white outline-none placeholder:text-white/25 focus:border-white/50" placeholder="admin@example.com" />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="seller-passcode" className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Passcode</label>
              <div className="relative">
                <LockKeyhole size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" aria-hidden="true" />
                <input id="seller-passcode" type={showPasscode ? 'text' : 'password'} autoComplete="current-password" required value={passcode} onChange={(event) => setPasscode(event.target.value)} className="h-14 w-full rounded-[var(--radius-sm)] border border-white/15 bg-white/7 pl-12 pr-12 text-base text-white outline-none placeholder:text-white/25 focus:border-white/50" placeholder="Enter your passcode" />
                <button type="button" onClick={() => setShowPasscode((value) => !value)} className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-white/50 hover:text-white" aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}>{showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            {error ? <p role="alert" className="rounded-[var(--radius-sm)] border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

            <button type="submit" disabled={loading} className="mt-2 h-14 rounded-[var(--radius-sm)] bg-white text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-55">{loading ? 'Verifying access…' : 'Sign in securely'}</button>
          </form>
        </motion.div>
      </section>
    </main>
  );
}
