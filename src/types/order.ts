import { CartItem } from './product';

export type OrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  details: OrderDetails;
}

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  paymentMethod: 'MOMO' | 'DELIVERY';
  totalAmount: number;
}

export interface LocationData {
  city: string;
  street: string;
  zip: string;
  fullName?: string;
}
