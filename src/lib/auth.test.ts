import { isSellerProfile } from './auth';
import type { Profile } from './database.types';

const profile = (role: Profile['role']): Profile => ({
  id: '1',
  email: 'admin@example.com',
  full_name: 'Admin',
  role,
  phone: null,
  created_at: '',
  updated_at: '',
});

describe('isSellerProfile', () => {
  it('accepts only profiles with the seller role', () => {
    expect(isSellerProfile(profile('seller'))).toBe(true);
    expect(isSellerProfile(profile('customer'))).toBe(false);
    expect(isSellerProfile(null)).toBe(false);
  });
});
