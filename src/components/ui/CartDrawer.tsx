import React, { useEffect, useMemo } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import type { CartItem } from '../../types';
import { CURRENCY, SHIPPING } from '../../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (cartItemId: string, change: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
}

const itemPrice = (item: CartItem) => item.product.variants?.find((variant) => variant.id === item.selectedVariantId)?.price ?? item.product.price;

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQty, onRemoveItem, onProceedToCheckout }: CartDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', closeOnEscape); };
  }, [isOpen, onClose]);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + itemPrice(item) * item.quantity, 0), [cartItems]);
  const remaining = Math.max(0, SHIPPING.FREE_THRESHOLD - subtotal);
  const units = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button type="button" className="absolute inset-0 h-full w-full bg-black/45 backdrop-blur-sm" onClick={onClose} aria-label="Close shopping bag" />
      <section className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[var(--radius-lg)] bg-white shadow-[var(--shadow-drawer)] sm:left-auto sm:top-0 sm:h-full sm:max-h-none sm:w-[min(460px,100%)] sm:rounded-none">
        <header className="flex min-h-16 items-center justify-between border-b border-[var(--color-border)] px-5">
          <div><p className="font-serif text-xl font-bold">Your bag</p><p className="text-xs text-[var(--color-muted)]">{units} {units === 1 ? 'item' : 'items'}</p></div>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-[var(--color-surface-subtle)]" aria-label="Close"><X size={19} /></button>
        </header>

        {cartItems.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 py-14 text-center"><div><ShoppingBag size={42} className="mx-auto text-[var(--color-muted)]" /><h2 className="mt-5 font-serif text-2xl font-bold">Your bag is empty</h2><p className="mt-2 text-sm text-[var(--color-ink-soft)]">Add a piece from any collection to begin.</p><button type="button" onClick={onClose} className="mt-6 h-11 bg-[var(--color-ink)] px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white">Continue shopping</button></div></div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {cartItems.map((item) => (
                <article key={item.id} className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 border-b border-[var(--color-border)] py-5">
                  <img src={item.product.images[0]} alt="" className="aspect-[4/5] h-[100px] w-20 bg-[var(--color-surface-subtle)] object-cover" />
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-sm font-semibold">{item.product.name}</h3><p className="mt-1 text-xs text-[var(--color-muted)]">Size {item.selectedSize}</p></div><button type="button" onClick={() => onRemoveItem(item.id)} className="grid size-8 shrink-0 place-items-center text-[var(--color-muted)] hover:text-[var(--color-danger)]" aria-label={`Remove ${item.product.name}`}><Trash2 size={16} /></button></div>
                    <div className="mt-5 flex items-center justify-between"><div className="flex h-9 items-center border border-[var(--color-border)]"><button type="button" onClick={() => onUpdateQty(item.id, -1)} className="grid size-9 place-items-center" aria-label={`Decrease ${item.product.name} quantity`}><Minus size={14} /></button><span className="grid w-8 place-items-center text-sm">{item.quantity}</span><button type="button" onClick={() => onUpdateQty(item.id, 1)} className="grid size-9 place-items-center" aria-label={`Increase ${item.product.name} quantity`}><Plus size={14} /></button></div><p className="text-sm font-bold">{CURRENCY}{(itemPrice(item) * item.quantity).toFixed(2)}</p></div>
                  </div>
                </article>
              ))}
            </div>

            <footer className="border-t border-[var(--color-border)] p-5">
              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]"><div className="h-full bg-[var(--color-accent)] transition-all" style={{ width: `${Math.min(100, (subtotal / SHIPPING.FREE_THRESHOLD) * 100)}%` }} /></div>
              <p className="text-xs text-[var(--color-ink-soft)]">{remaining > 0 ? `${CURRENCY}${remaining.toFixed(2)} more for free delivery.` : 'You qualify for free delivery.'}</p>
              <div className="mt-5 flex items-center justify-between text-lg font-bold"><span>Subtotal</span><span>{CURRENCY}{subtotal.toFixed(2)}</span></div>
              <p className="mt-1 text-xs text-[var(--color-muted)]">Delivery and final stock are confirmed at checkout.</p>
              <button type="button" onClick={onProceedToCheckout} className="mt-5 h-13 w-full bg-[var(--color-accent)] text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[var(--color-accent-strong)]">Proceed to checkout</button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
