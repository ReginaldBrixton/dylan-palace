import React from 'react';
import { Headphones, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { useStoreSettings } from '../../hooks/useStoreSettings';

export default function ServiceStrip() {
  const { serviceCopy } = useStoreSettings();
  const services = [
    { icon: Truck, title: serviceCopy.delivery, body: 'Clear delivery costs and contact-led fulfilment.' },
    { icon: PackageCheck, title: 'Live stock checks', body: 'Variant availability is confirmed during ordering.' },
    { icon: ShieldCheck, title: 'Reliable order records', body: 'Orders are saved transactionally before your bag clears.' },
    { icon: Headphones, title: serviceCopy.pickup, body: 'Store contact and pickup information are managed centrally.' },
  ];
  return <section className="border-y border-[var(--color-border)] bg-white"><div className="store-container grid divide-y divide-[var(--color-border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">{services.map((service) => <div key={service.title} className="flex gap-3 px-1 py-7 sm:px-5 lg:py-9"><service.icon size={19} className="mt-0.5 shrink-0 text-[var(--color-accent)]"/><div><h3 className="text-sm font-semibold">{service.title}</h3><p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">{service.body}</p></div></div>)}</div></section>;
}
