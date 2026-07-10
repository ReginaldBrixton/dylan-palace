import React, { useEffect, useState } from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import { fetchStoreSettings, saveStoreSetting } from '../../lib/api/admin';

interface SettingsForm {
  baseFee: string;
  freeThreshold: string;
  pickupLabel: string;
  email: string;
  phone: string;
  whatsapp: string;
  deliveryCopy: string;
  pickupCopy: string;
}

const initial: SettingsForm = { baseFee: '30', freeThreshold: '500', pickupLabel: 'Odorkor pickup', email: '', phone: '', whatsapp: '', deliveryCopy: 'Fast delivery within Accra', pickupCopy: 'Free pickup available' };
const inputClass = 'h-12 w-full border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-ink)]';

export default function SellerSettingsPage() {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchStoreSettings().then((settings) => { const byKey = new Map(settings.map((setting) => [setting.key, setting.value])); const shipping = byKey.get('shipping') || {}; const contact = byKey.get('contact') || {}; const copy = byKey.get('serviceCopy') || {}; setForm({ baseFee: String(shipping.baseFee ?? initial.baseFee), freeThreshold: String(shipping.freeThreshold ?? initial.freeThreshold), pickupLabel: String(shipping.pickupLabel ?? initial.pickupLabel), email: String(contact.email ?? ''), phone: String(contact.phone ?? ''), whatsapp: String(contact.whatsapp ?? ''), deliveryCopy: String(copy.delivery ?? initial.deliveryCopy), pickupCopy: String(copy.pickup ?? initial.pickupCopy) }); }); }, []);
  const update = (key: keyof SettingsForm, value: string) => { setForm((current) => ({ ...current, [key]: value })); setSaved(false); };
  const save = async () => { const baseFee = Number(form.baseFee); const freeThreshold = Number(form.freeThreshold); if (!Number.isFinite(baseFee) || baseFee < 0 || !Number.isFinite(freeThreshold) || freeThreshold < 0) { setError('Shipping values must be zero or positive numbers.'); return; } setSaving(true); setError(''); try { await Promise.all([saveStoreSetting('shipping', { baseFee, freeThreshold, pickupLabel: form.pickupLabel.trim() }), saveStoreSetting('contact', { email: form.email.trim(), phone: form.phone.trim(), whatsapp: form.whatsapp.trim() }), saveStoreSetting('serviceCopy', { delivery: form.deliveryCopy.trim(), pickup: form.pickupCopy.trim() })]); setSaved(true); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Settings could not be saved.'); } finally { setSaving(false); } };
  const action = <button onClick={save} disabled={saving} className="flex h-11 items-center gap-2 bg-[var(--color-ink)] px-4 text-xs font-bold uppercase tracking-[0.13em] text-white disabled:opacity-50"><Save size={16}/>{saving ? 'Saving…' : 'Save settings'}</button>;

  return <AdminShell title="Store settings" description="Public contact, delivery and pickup configuration." actions={action}><div className="grid gap-6 xl:grid-cols-2"><section className="border border-[var(--color-border)] bg-white p-5 sm:p-7"><h2 className="font-serif text-2xl font-bold">Delivery pricing</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm">Base delivery fee<input className={inputClass} inputMode="decimal" value={form.baseFee} onChange={(event) => update('baseFee', event.target.value)}/></label><label className="grid gap-2 text-sm">Free delivery threshold<input className={inputClass} inputMode="decimal" value={form.freeThreshold} onChange={(event) => update('freeThreshold', event.target.value)}/></label><label className="grid gap-2 text-sm sm:col-span-2">Pickup label<input className={inputClass} value={form.pickupLabel} onChange={(event) => update('pickupLabel', event.target.value)}/></label></div></section><section className="border border-[var(--color-border)] bg-white p-5 sm:p-7"><h2 className="font-serif text-2xl font-bold">Store contact</h2><div className="mt-5 grid gap-4"><label className="grid gap-2 text-sm">Email<input type="email" className={inputClass} value={form.email} onChange={(event) => update('email', event.target.value)}/></label><label className="grid gap-2 text-sm">Phone<input className={inputClass} value={form.phone} onChange={(event) => update('phone', event.target.value)}/></label><label className="grid gap-2 text-sm">WhatsApp<input className={inputClass} value={form.whatsapp} onChange={(event) => update('whatsapp', event.target.value)}/></label></div></section><section className="border border-[var(--color-border)] bg-white p-5 sm:p-7 xl:col-span-2"><h2 className="font-serif text-2xl font-bold">Public service copy</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm">Delivery message<input className={inputClass} value={form.deliveryCopy} onChange={(event) => update('deliveryCopy', event.target.value)}/></label><label className="grid gap-2 text-sm">Pickup message<input className={inputClass} value={form.pickupCopy} onChange={(event) => update('pickupCopy', event.target.value)}/></label></div></section></div>{error ? <p role="alert" className="mt-5 border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}{saved ? <p className="mt-5 flex items-center gap-2 border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 size={18}/> Store settings saved.</p> : null}</AdminShell>;
}
