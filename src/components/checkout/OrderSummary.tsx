import React from 'react';
import type { CartItem } from '../../types';
import { CURRENCY } from '../../constants';

interface OrderSummaryProps { items: CartItem[]; subtotal: number; shipping: number; total: number; }

export default function OrderSummary({ items, subtotal, shipping, total }: OrderSummaryProps) {
  return (
    <aside className="bg-[var(--color-surface)] p-5 lg:sticky lg:top-[calc(var(--header-desktop)+2rem)] lg:p-7" aria-label="Order summary">
      <h2 className="font-serif text-2xl font-bold tracking-[-0.03em]">Your order</h2>
      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-[64px_1fr_auto] gap-3 border-b border-[var(--color-border)] pb-4">
            <img src={item.product.images[0]} alt="" className="aspect-[4/5] h-20 w-16 object-cover bg-[var(--color-surface-subtle)]" />
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{item.product.name}</p><p className="mt-1 text-xs text-[var(--color-muted)]">Size {item.selectedSize} · Qty {item.quantity}</p></div>
            <p className="text-sm font-semibold">{CURRENCY}{(item.product.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <dl className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between"><dt className="text-[var(--color-muted)]">Subtotal</dt><dd>{CURRENCY}{subtotal.toFixed(2)}</dd></div>
        <div className="flex justify-between"><dt className="text-[var(--color-muted)]">Delivery</dt><dd>{shipping === 0 ? 'Free' : `${CURRENCY}${shipping.toFixed(2)}`}</dd></div>
        <div className="mt-2 flex justify-between border-t border-[var(--color-border-strong)] pt-4 text-lg font-bold"><dt>Total</dt><dd>{CURRENCY}{total.toFixed(2)}</dd></div>
      </dl>
    </aside>
  );
}
