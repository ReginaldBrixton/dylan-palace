import { supabase } from '../supabase';
import type { CartItem, CheckoutDetails } from '../../types';

export interface PersistedOrder {
  orderId: string;
  orderNumber: string;
}

export async function placeOrder(details: CheckoutDetails, items: CartItem[], shippingCost: number): Promise<PersistedOrder> {
  const orderItems = items.map((item) => {
    const variantId = item.selectedVariantId || item.product.variants?.find((variant) => variant.size === item.selectedSize && variant.stockQuantity > 0)?.id;
    if (!variantId) throw new Error(`${item.product.name} is missing a purchasable inventory variant. Refresh the product and select a size again.`);
    return {
      variantId,
      quantity: item.quantity,
      productImage: item.product.images[0] || null,
    };
  });

  const payload = {
    fullName: details.fullName,
    email: details.email,
    phone: details.phone,
    address: details.address,
    city: details.city,
    zip: details.zip,
    paymentMethod: details.paymentMethod,
    momoNetwork: details.momoNetwork || '',
    momoNumber: details.momoNumber || '',
    shippingCost,
  };

  const { data, error } = await supabase.rpc('place_order', { payload, items: orderItems });
  if (error) throw new Error(error.message || 'The order could not be saved.');
  const result = data as { orderId?: string; orderNumber?: string } | null;
  if (!result?.orderId || !result.orderNumber) throw new Error('The database did not return an order confirmation.');
  return { orderId: result.orderId, orderNumber: result.orderNumber };
}
