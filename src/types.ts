export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS';
  subCategory?: string;
  brand?: string;
  gender?: 'MALE' | 'FEMALE' | 'UNISEX';
  images: string[];
  description: string;
  sizes: string[];
  deliversBy: string;
}

export interface CartItem {
  id: string; // Unique for cart (e.g. productId-size)
  product: Product;
  selectedSize: string;
  quantity: number;
}

export type Screen = 'splash' | 'home' | 'plp' | 'pdp' | 'checkout' | 'success' | 'profile';

export interface LocationData {
  city: string;
  street: string;
  zip: string;
  fullName?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  details: {
    fullName: string;
    email: string;
    address: string;
    city: string;
  };
}
