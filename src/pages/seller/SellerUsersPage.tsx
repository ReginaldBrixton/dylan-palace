import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Search, Shield, User } from 'lucide-react';
import AdminShell from '../../components/admin/AdminShell';
import StatusBadge from '../../components/admin/StatusBadge';
import { fetchProfiles } from '../../lib/api';
import type { Profile } from '../../lib/database.types';

export default function SellerUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const load = useCallback(async () => { setLoading(true); try { setProfiles(await fetchProfiles()); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return profiles;
    return profiles.filter((profile) => [profile.full_name, profile.email, profile.phone, profile.role].filter(Boolean).join(' ').toLowerCase().includes(query));
  }, [profiles, search]);
  const customerCount = profiles.filter((profile) => profile.role === 'customer').length;
  const sellerCount = profiles.filter((profile) => profile.role === 'seller').length;

  return (
    <AdminShell title="Customers" description={`${customerCount} customer profiles and ${sellerCount} seller accounts.`}>
      <label className="relative mb-5 block max-w-xl"><span className="sr-only">Search profiles</span><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone or role" className="h-12 w-full border border-[var(--color-border)] bg-white pl-11 pr-4 text-sm outline-none focus:border-[var(--color-ink)]"/></label>
      {loading ? <div className="grid gap-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-20 animate-pulse bg-white"/>)}</div> : filtered.length === 0 ? <div className="border border-dashed border-[var(--color-border-strong)] bg-white p-12 text-center text-sm text-[var(--color-muted)]">No matching profiles.</div> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filtered.map((profile) => <article key={profile.id} className="border border-[var(--color-border)] bg-white p-5"><div className="flex items-start gap-3"><span className="grid size-10 place-items-center rounded-full bg-[var(--color-surface-subtle)]">{profile.role === 'seller' ? <Shield size={18}/> : <User size={18}/>}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{profile.full_name || 'Unnamed profile'}</p><div className="mt-1"><StatusBadge status={profile.role}/></div></div></div><div className="mt-5 grid gap-2 text-xs text-[var(--color-ink-soft)]"><p className="flex items-center gap-2 truncate"><Mail size={14} className="shrink-0"/>{profile.email}</p>{profile.phone ? <p className="flex items-center gap-2"><Phone size={14}/>{profile.phone}</p> : null}<p className="mt-2 text-[var(--color-muted)]">Joined {new Date(profile.created_at).toLocaleDateString()}</p></div></article>)}</div>}
    </AdminShell>
  );
}
