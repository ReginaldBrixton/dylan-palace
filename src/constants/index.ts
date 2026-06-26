import { Product } from '../types';
import { PRODUCTS } from '../api/products';

export const STORAGE_KEYS = {
  CART: 'dp_cart',
  WISHLIST: 'dp_wishlist',
  ORDERS: 'dp_orders',
} as const;

export const SHIPPING = {
  FREE_THRESHOLD: 100,
  BASE_FEE: 15,
} as const;

export const PAYMENT_METHODS = {
  MOMO: 'MOMO',
  DELIVERY: 'DELIVERY',
} as const;

export const MOMO_NETWORKS = [
  { value: 'MTN', label: 'MTN Mobile Money' },
  { value: 'Vodafone', label: 'Telecel Cash' },
  { value: 'AirtelTigo', label: 'AT Money' },
] as const;

export const CURRENCY = 'GH₵';

export const SEED_ORDERS = (): Array<{
  id: string;
  date: string;
  items: Array<{ id: string; product: Product; selectedSize: string; quantity: number }>;
  totalAmount: number;
  status: string;
  details: { fullName: string; email: string; phone: string; address: string; city: string; zip: string; paymentMethod: 'MOMO' | 'DELIVERY' };
}> => [
    {
      id: 'DP-83021',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000 * 1.5).toISOString(),
      items: [
        { id: 'p_ss1', product: PRODUCTS[0], selectedSize: 'M', quantity: 1 },
        { id: 'p_ss2', product: PRODUCTS[1], selectedSize: 'L', quantity: 2 },
      ],
      totalAmount: PRODUCTS[0].price + PRODUCTS[1].price * 2,
      status: 'SHIPPED',
      details: {
        fullName: 'Reginald Brixton',
        email: 'reginaldbrixton@gmail.com',
        phone: '0241234567',
        address: '12 Palace Boulevard',
        city: 'Accra',
        zip: 'GA-184-3528',
        paymentMethod: 'MOMO',
      },
    },
    {
      id: 'DP-79284',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5).toISOString(),
      items: [
        { id: 'p_ss3', product: PRODUCTS[2], selectedSize: 'S', quantity: 1 },
      ],
      totalAmount: PRODUCTS[2].price,
      status: 'DELIVERED',
      details: {
        fullName: 'Reginald Brixton',
        email: 'reginaldbrixton@gmail.com',
        phone: '0241234567',
        address: '12 Palace Boulevard',
        city: 'Accra',
        zip: 'GA-184-3528',
        paymentMethod: 'DELIVERY',
      },
    },
  ];
