import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Profile } from './database.types';

const LEGACY_AUTH_KEY = 'dylan_seller_auth';

export function isSellerProfile(profile: Profile | null | undefined): profile is Profile {
  return Boolean(profile && profile.role === 'seller');
}

async function fetchSellerProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return isSellerProfile(data as Profile) ? (data as Profile) : null;
}

export async function getCurrentSeller(): Promise<Profile | null> {
  try {
    localStorage.removeItem(LEGACY_AUTH_KEY);
  } catch {
    // Storage may be unavailable; auth must not depend on it.
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const userId = data.session?.user.id;
  if (!userId) return null;
  return fetchSellerProfile(userId);
}

export async function signInSeller(email: string, passcode: string): Promise<Profile> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !passcode) throw new Error('Enter your admin email and passcode.');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: passcode,
  });

  if (error || !data.user) {
    throw new Error('The admin email or passcode is incorrect.');
  }

  const seller = await fetchSellerProfile(data.user.id);
  if (!seller) {
    await supabase.auth.signOut();
    throw new Error('This account does not have seller access.');
  }

  return seller;
}

export async function signOutSeller(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function subscribeToSellerAuth(
  callback: (seller: Profile | null, event: AuthChangeEvent, session: Session | null) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (!session?.user) {
      callback(null, event, session);
      return;
    }

    try {
      const seller = await fetchSellerProfile(session.user.id);
      callback(seller, event, session);
    } catch {
      callback(null, event, session);
    }
  });

  return () => data.subscription.unsubscribe();
}
