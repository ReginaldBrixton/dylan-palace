import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps { label: string; value: string | number; icon: LucideIcon; note?: string; }

export default function MetricCard({ label, value, icon: Icon, note }: MetricCardProps) {
  return <article className="border border-[var(--color-border)] bg-white p-5 lg:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">{label}</p><p className="mt-3 text-3xl font-bold tracking-[-0.04em]">{value}</p>{note ? <p className="mt-2 text-xs text-[var(--color-muted)]">{note}</p> : null}</div><span className="grid size-10 place-items-center rounded-full bg-[var(--color-surface-subtle)]"><Icon size={19} /></span></div></article>;
}
