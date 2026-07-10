import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SHIPPING } from '../constants';

export interface PublicStoreSettings {
  shipping: { baseFee: number; freeThreshold: number; pickupLabel: string };
  contact: { email: string; phone: string; whatsapp: string };
  serviceCopy: { delivery: string; pickup: string };
}

const defaults: PublicStoreSettings = {
  shipping: { baseFee: SHIPPING.BASE_FEE, freeThreshold: SHIPPING.FREE_THRESHOLD, pickupLabel: 'Store pickup' },
  contact: { email: '', phone: '', whatsapp: '' },
  serviceCopy: { delivery: 'Delivery across Ghana', pickup: 'Pickup available' },
};

export function useStoreSettings(): PublicStoreSettings {
  const [settings, setSettings] = useState(defaults);

  useEffect(() => {
    let active = true;
    supabase.from('store_settings').select('key,value').then(({ data, error }) => {
      if (!active || error || !data) return;
      const byKey = new Map(data.map((item) => [item.key, item.value as Record<string, unknown>]));
      const shipping = byKey.get('shipping') || {};
      const contact = byKey.get('contact') || {};
      const serviceCopy = byKey.get('serviceCopy') || {};
      setSettings({
        shipping: {
          baseFee: Number(shipping.baseFee ?? defaults.shipping.baseFee),
          freeThreshold: Number(shipping.freeThreshold ?? defaults.shipping.freeThreshold),
          pickupLabel: String(shipping.pickupLabel ?? defaults.shipping.pickupLabel),
        },
        contact: {
          email: String(contact.email ?? ''),
          phone: String(contact.phone ?? ''),
          whatsapp: String(contact.whatsapp ?? ''),
        },
        serviceCopy: {
          delivery: String(serviceCopy.delivery ?? defaults.serviceCopy.delivery),
          pickup: String(serviceCopy.pickup ?? defaults.serviceCopy.pickup),
        },
      });
    });
    return () => { active = false; };
  }, []);

  return settings;
}
