import type { CheckoutDetails } from '../../types';

export type CheckoutErrors = Partial<Record<keyof CheckoutDetails, string>>;

export function normalizeGhanaPhone(value: string): string {
  return value.replace(/[\s()-]/g, '').replace(/^\+233/, '0').replace(/^233/, '0');
}

export function validateCheckout(details: CheckoutDetails): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (details.fullName.trim().length < 2) errors.fullName = 'Enter the customer’s full name.';
  if (!/^\S+@\S+\.\S+$/.test(details.email.trim())) errors.email = 'Enter a valid email address.';
  if (!/^0\d{9}$/.test(normalizeGhanaPhone(details.phone))) errors.phone = 'Use a valid 10-digit Ghana phone number.';
  if (details.address.trim().length < 4) errors.address = 'Enter a delivery address or pickup instruction.';
  if (details.city.trim().length < 2) errors.city = 'Enter the city or town.';
  if (details.paymentMethod === 'MOMO') {
    if (!details.momoNetwork) errors.momoNetwork = 'Select a Mobile Money network.';
    if (!/^0\d{9}$/.test(normalizeGhanaPhone(details.momoNumber || ''))) errors.momoNumber = 'Enter a valid Mobile Money number.';
  }
  return errors;
}
