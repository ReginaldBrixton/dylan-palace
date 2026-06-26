import { CURRENCY } from '../constants';

export function formatPrice(amount: number): string {
  return `${CURRENCY}${amount.toFixed(2)}`;
}

export function formatPriceWhole(amount: number): string {
  return `${CURRENCY}${amount}.00`;
}

export function generateOrderId(): string {
  return Math.floor(100000 + Math.random() * 90000).toString();
}

export function calculateSubtotal(items: Array<{ product: { price: number }; quantity: number }>): number {
  return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
}

export function calculateShipping(subtotal: number, freeThreshold: number = 100, baseFee: number = 15): number {
  return subtotal >= freeThreshold ? 0 : baseFee;
}

export function calculateTotal(subtotal: number, shipping: number): number {
  return subtotal + shipping;
}

export function countCartUnits(items: Array<{ quantity: number }>): number {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}
