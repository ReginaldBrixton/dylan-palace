import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, Compass, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Screen, CheckoutDetails } from '../../types';
import { detectLocation, buildMapUrl } from '../../api/geolocation';
import { SHIPPING, MOMO_NETWORKS, CURRENCY } from '../../constants';
import { calculateSubtotal, calculateShipping, calculateTotal } from '../../utils/format';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  onOrderComplete: (details: CheckoutDetails) => void;
  onNavigate: (screen: Screen) => void;
}

export default function CheckoutScreen({ cartItems, onOrderComplete, onNavigate }: CheckoutScreenProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'MOMO' | 'DELIVERY'>('MOMO');

  // Momo fields
  const [momoNetwork, setMomoNetwork] = useState('MTN');
  const [momoNumber, setMomoNumber] = useState('');

  // Location detection flags
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState<string | null>(null);

  // Debounced address for map iframe to prevent lag
  const [debouncedAddress, setDebouncedAddress] = useState('Accra Ghana');

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = `${streetAddress} ${city}`.trim();
      setDebouncedAddress(query || 'Accra Ghana');
    }, 1000);
    return () => clearTimeout(timer);
  }, [streetAddress, city]);

  const subtotal = calculateSubtotal(cartItems);
  const shippingFee = calculateShipping(subtotal, SHIPPING.FREE_THRESHOLD, SHIPPING.BASE_FEE);
  const totalAmount = calculateTotal(subtotal, shippingFee);

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setDetectionMessage("Accessing system coordinates...");

    const result = await detectLocation();

    if (result) {
      setCity(result.city);
      setStreetAddress(result.street);
      setZip(result.zip);
      setDetectionMessage(`Detected: ${result.city}, ${result.zip}`);
    } else {
      setDetectionMessage("Location detection failed. Please enter manually.");
    }
    setIsDetecting(false);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !phone || !fullName || !streetAddress || !city || !zip) {
      alert("Please complete all required shipping fields.");
      return;
    }

    onOrderComplete({
      fullName,
      email,
      phone,
      address: streetAddress,
      city,
      zip,
      paymentMethod,
      momoNetwork: paymentMethod === 'MOMO' ? momoNetwork : undefined,
      momoNumber: paymentMethod === 'MOMO' ? momoNumber : undefined,
      totalAmount
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fade-in">
        <div className="w-16 h-16 border-2 border-dashed border-[#E5E5E5] flex items-center justify-center mb-4 text-[#8B8B8A]">
          <ShoppingBag size={24} />
        </div>
        <h2 className="font-serif text-[20px] font-bold text-[#111111] uppercase tracking-tight mb-2">
          Your bag is empty
        </h2>
        <p className="text-[13px] text-[#8B8B8A] max-w-[280px] mb-6 leading-relaxed">
          Add items to your bag before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-3 bg-[#111111] text-white text-[11px] font-semibold uppercase tracking-widest cursor-pointer rounded-lg hover:bg-[#333333] active:scale-95 transition-all shadow-md"
        >
          BROWSE PRODUCTS
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-screen" className="w-full flex flex-col pb-40 animate-fade-in">
      <form onSubmit={handlePay} className="px-6 py-6 flex flex-col gap-10">

        {/* Contact info Segment */}
        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-[18px] font-bold text-[#111111] uppercase tracking-wider border-b border-[#E5E5E5] pb-2">
            CONTACT
          </h2>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                id="checkout-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer w-full pt-6 pb-2 px-3 border border-[#E5E5E5] focus:border-[#111111] outline-none text-base rounded-lg bg-white transition-all duration-200 shadow-sm"
              />
              <label
                htmlFor="checkout-email"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A] text-base pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#444748] peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#444748]"
              >
                Email Address *
              </label>
            </div>

            <div className="relative">
              <input
                id="checkout-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder=" "
                className="peer w-full pt-6 pb-2 px-3 border border-[#E5E5E5] focus:border-[#111111] outline-none text-base rounded-lg bg-white transition-all duration-200 shadow-sm"
              />
              <label
                htmlFor="checkout-phone"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A] text-base pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#444748] peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#444748]"
              >
                Phone Number *
              </label>
            </div>
          </div>
        </section>

        {/* Shipping Segment */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-end border-b border-[#E5E5E5] pb-2">
            <h2 className="font-serif text-[18px] font-bold text-[#111111] uppercase tracking-wider">
              DELIVERY / PICKUP INFO
            </h2>
            <button
              type="button"
              id="detect-location-btn"
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="flex items-center gap-1.5 text-[#111111] cursor-pointer hover:text-[#4A5D23] transition-colors bg-transparent border-0 outline-none leading-none active:scale-95 text-[11px] font-bold uppercase tracking-wider pl-4"
            >
              {isDetecting ? (
                <Loader2 size={13} className="animate-spin text-[#4A5D23]" />
              ) : (
                <Compass size={13} />
              )}
              <span>DETECT</span>
            </button>
          </div>

          {/* Location Feedback Notification */}
          {detectionMessage && (
            <div className="text-[11px] font-semibold text-[#4A5D23] uppercase tracking-wider bg-[#4A5D23]/10 px-3 py-2 border border-[#4A5D23]/20 flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A5D23]"></span>
              {detectionMessage}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                id="checkout-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder=" "
                className="peer w-full pt-6 pb-2 px-3 border border-[#E5E5E5] focus:border-[#111111] outline-none text-base rounded-lg bg-white transition-all duration-200 shadow-sm"
              />
              <label
                htmlFor="checkout-name"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A] text-base pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#444748] peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#444748]"
              >
                Full Name *
              </label>
            </div>

            <div className="relative">
              <input
                id="checkout-street"
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder=" "
                className="peer w-full pt-6 pb-2 px-3 border border-[#E5E5E5] focus:border-[#111111] outline-none text-base rounded-lg bg-white transition-all duration-200 shadow-sm"
              />
              <label
                htmlFor="checkout-street"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A] text-base pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#444748] peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#444748]"
              >
                Street Address *
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  id="checkout-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder=" "
                  className="peer w-full pt-6 pb-2 px-3 border border-[#E5E5E5] focus:border-[#111111] outline-none text-base rounded-lg bg-white transition-all duration-200 shadow-sm"
                />
                <label
                  htmlFor="checkout-city"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A] text-base pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#444748] peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#444748]"
                >
                  City *
                </label>
              </div>

              <div className="relative">
                <input
                  id="checkout-zip"
                  type="text"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder=" "
                  className="peer w-full pt-6 pb-2 px-3 border border-[#E5E5E5] focus:border-[#111111] outline-none text-base rounded-lg bg-white transition-all duration-200 shadow-sm"
                />
                <label
                  htmlFor="checkout-zip"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A] text-base pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#444748] peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#444748]"
                >
                  ZIP Code *
                </label>
              </div>
            </div>

            {/* Dynamic visual map container */}
            <div className="w-full h-[120px] bg-[#E5E5E5] rounded-lg overflow-hidden border border-[#E5E5E5] relative shadow-sm">
              <iframe
                title="Delivery Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                loading="lazy"
                style={{ border: 0 }}
                src={buildMapUrl(debouncedAddress)}
                aria-hidden="false"
                tabIndex={0}
              />
              <div className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-white/80 to-transparent p-2 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] drop-shadow-sm">Delivery Location Preview</span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Segment */}
        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-[18px] font-bold text-[#111111] uppercase tracking-wider border-b border-[#E5E5E5] pb-2">
            PAYMENT METHOD
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-1">
            <button
              type="button"
              onClick={() => setPaymentMethod('MOMO')}
              className={`py-3.5 border font-semibold text-[11px] uppercase tracking-widest text-center transition-all duration-200 cursor-pointer rounded-lg ${paymentMethod === 'MOMO'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111]'
                }`}
            >
              MOBILE MONEY
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('DELIVERY')}
              className={`py-3.5 border font-semibold text-[11px] uppercase tracking-widest text-center transition-all duration-200 cursor-pointer rounded-lg ${paymentMethod === 'DELIVERY'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111]'
                }`}
            >
              ARRIVAL / PICKUP
            </button>
          </div>

          <AnimatePresence mode="wait">
            {paymentMethod === 'MOMO' ? (
              <motion.div
                key="momo"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex flex-col gap-4 mt-2"
              >
                <div className="relative">
                  <select
                    id="checkout-network"
                    value={momoNetwork}
                    onChange={(e) => setMomoNetwork(e.target.value)}
                    className="w-full pt-6 pb-2 px-3 border border-[#E5E5E5] focus:border-[#111111] outline-none text-base rounded-lg bg-white transition-all duration-200 shadow-sm appearance-none"
                  >
                    {MOMO_NETWORKS.map(network => (
                      <option key={network.value} value={network.value}>{network.label}</option>
                    ))}
                  </select>
                  <label
                    htmlFor="checkout-network"
                    className="absolute left-3 top-2 text-[10px] text-[#444748] pointer-events-none transition-all duration-200"
                  >
                    Network *
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="checkout-momo-number"
                    type="tel"
                    maxLength={10}
                    required={paymentMethod === 'MOMO'}
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder=" "
                    className="peer w-full pt-6 pb-2 px-3 border border-[#E5E5E5] focus:border-[#111111] outline-none text-base rounded-lg bg-white transition-all duration-200 shadow-sm"
                  />
                  <label
                    htmlFor="checkout-momo-number"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8A] text-base pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#444748] peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#444748]"
                  >
                    MoMo Number *
                  </label>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="delivery"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="mt-2 border border-[#4A5D23]/30 bg-[#4A5D23]/5 p-4 rounded-lg flex items-start gap-2.5 shadow-sm"
              >
                <ShieldCheck className="text-[#4A5D23] shrink-0 mt-0.5" size={18} />
                <div className="text-[12px] text-[#4A5D23] uppercase tracking-wider leading-relaxed">
                  <strong>Pay on Arrival or Pickup Selected</strong>
                  <p className="mt-1 text-[#555555] normal-case">
                    No online payment data required. Pay using cash or Momo when you pick up at our Odorkor shop, or upon local delivery arrival.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Calculation summary segment */}
        <section className="flex flex-col gap-2 border-t border-[#E5E5E5] pt-4 mt-4">
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[#8B8B8A] uppercase tracking-wider">Subtotal</span>
            <span className="text-[#111111] font-bold">{CURRENCY}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-[#8B8B8A] uppercase tracking-wider">Shipping</span>
            <span className="text-[#111111] font-bold">
              {shippingFee === 0 ? "FREE" : `${CURRENCY}${shippingFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-[#E5E5E5] pt-3 mt-1.5">
            <span className="text-[12px] font-bold text-[#111111] uppercase tracking-wider">TOTAL</span>
            <span className="font-serif text-[22px] font-bold text-[#111111] leading-none">
              {CURRENCY}{totalAmount.toFixed(2)}
            </span>
          </div>
        </section>

        {/* Sticky Pay Button */}
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 pb-6 border-t border-[#E5E5E5] z-[39]">
          <button
            type="submit"
            className="w-full bg-[#111111] text-white py-4 font-semibold text-[13px] uppercase tracking-widest hover:bg-black active:scale-[0.98] transition-all duration-300 cursor-pointer rounded-lg shadow-lg"
          >
            {paymentMethod === 'DELIVERY' ? `CONFIRM ORDER - ${CURRENCY}${totalAmount.toFixed(2)}` : `PAY ${CURRENCY}${totalAmount.toFixed(2)}`}
          </button>
        </div>

      </form>
    </div>
  );
}
