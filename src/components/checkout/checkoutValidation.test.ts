import { normalizeGhanaPhone, validateCheckout } from './checkoutValidation';
import type { CheckoutDetails } from '../../types';

describe('checkout validation', () => {
  it('normalizes Ghana international numbers', () => {
    expect(normalizeGhanaPhone('+233 24 123 4567')).toBe('0241234567');
  });

  it('requires Mobile Money details only for Mobile Money orders', () => {
    const details: CheckoutDetails = { fullName: 'Dee Ayitah', email: 'dee@example.com', phone: '0241234567', address: 'Accra Central', city: 'Accra', zip: '', paymentMethod: 'DELIVERY', totalAmount: 100 };
    expect(validateCheckout(details)).toEqual({});
    expect(validateCheckout({ ...details, paymentMethod: 'MOMO' })).toMatchObject({ momoNetwork: expect.any(String), momoNumber: expect.any(String) });
  });
});
