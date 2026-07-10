import React from 'react';
import { CheckCircle2, Clock3 } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const orderNumber = (location.state as { orderNumber?: string } | null)?.orderNumber || params.get('order');
  const paymentMethod = (location.state as { paymentMethod?: string } | null)?.paymentMethod;

  if (!orderNumber) {
    return <div className="store-container grid min-h-[65vh] place-items-center text-center"><div><h1 className="font-serif text-4xl font-bold">No order confirmation found</h1><p className="mt-3 text-sm text-[var(--color-ink-soft)]">Return to the store and check your bag before trying again.</p><button onClick={() => navigate('/')} className="mt-7 h-12 bg-[var(--color-ink)] px-7 text-xs font-semibold uppercase tracking-[0.15em] text-white">Return home</button></div></div>;
  }

  return (
    <div className="store-container grid min-h-[72vh] place-items-center py-16">
      <div className="w-full max-w-2xl bg-white p-7 text-center shadow-[var(--shadow-soft)] sm:p-12">
        <CheckCircle2 size={54} className="mx-auto text-[var(--color-success)]" />
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Order saved</p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Thank you for your order.</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[var(--color-ink-soft)]">Your order <strong className="text-[var(--color-ink)]">{orderNumber}</strong> is now in the store system. We will use the contact details supplied during checkout for fulfilment updates.</p>
        {paymentMethod === 'MOMO' ? <div className="mx-auto mt-6 flex max-w-lg items-start gap-3 border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-900"><Clock3 size={18} className="mt-0.5 shrink-0" /><span>Mobile Money payment is pending verification. This screen does not claim that payment has already been received.</span></div> : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => navigate('/shirts')} className="h-12 bg-[var(--color-ink)] px-7 text-xs font-semibold uppercase tracking-[0.15em] text-white">Continue shopping</button><button onClick={() => navigate('/profile')} className="h-12 border border-[var(--color-border-strong)] px-7 text-xs font-semibold uppercase tracking-[0.15em]">View account</button></div>
      </div>
    </div>
  );
}
