import React, { useState, useEffect } from 'react';
import { Check, Calendar, MapPin, Truck, Award, Package, Clock } from 'lucide-react';
import { Screen } from '../../types';
import { triggerHaptic } from '../../utils/haptic';

interface SuccessScreenProps {
  orderDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    paymentMethod: 'MOMO' | 'DELIVERY';
    totalAmount: number;
  } | null;
  onContinueShopping: () => void;
}

export default function SuccessScreen({ orderDetails, onContinueShopping }: SuccessScreenProps) {
  const randomOrderNo = Math.floor(100000 + Math.random() * 90000).toString();

  // Simulate order progression for demo purposes
  const [orderState, setOrderState] = useState<number>(1);

  useEffect(() => {
    // Trigger heavy double haptic feedback when order is secured
    triggerHaptic('heavy');

    const timer = setTimeout(() => {
      setOrderState(2);
    }, 4000); // simulate moving to "processing" after 4s
    return () => clearTimeout(timer);
  }, []);

  const TrackingSteps = [
    { id: 1, label: 'ORDER PLACED', icon: Check },
    { id: 2, label: 'PACKING AT ODORKOR', icon: Clock },
    { id: 3, label: 'DISPATCHED', icon: Truck },
    { id: 4, label: 'AT YOUR LOCATION', icon: Package },
  ];

  return (
    <div id="success-screen" className="w-full flex flex-col px-6 py-12 items-center bg-[#F9F9F8] min-h-[70vh] animate-fade-in text-center selection:bg-black selection:text-white pb-32">

      {/* Editorial Checked Marker */}
      <div className="w-16 h-16 bg-[#111111] text-white flex items-center justify-center rounded-none mb-6 animate-bounce">
        <Check size={32} strokeWidth={2.5} />
      </div>

      <h1 className="font-serif text-[28px] font-bold text-[#111111] uppercase tracking-tight mb-2">
        ORDER SECURED
      </h1>
      <p className="text-[13px] text-[#8B8B8A] uppercase tracking-widest pl-1 mb-8">
        Reference: DP-{randomOrderNo}-2026
      </p>

      {/* Visual Tracking Component */}
      <div className="w-full max-w-md bg-white border border-[#E5E5E5] p-6 mb-8">
        <h3 className="text-[10px] font-bold text-[#8B8B8A] uppercase tracking-wider text-left mb-6">LIVE TRACKING STATUS</h3>
        <div className="relative flex justify-between items-center w-full px-2">
          {/* Progress bar background */}
          <div className="absolute top-1/2 left-2 right-2 h-[4px] bg-[#E5E5E5] -translate-y-1/2 z-0 rounded-full" />

          {/* Active progress bar */}
          <div
            className="absolute top-1/2 left-2 h-[4px] bg-[#111111] -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out rounded-full"
            style={{ width: `calc(${((orderState - 1) / (TrackingSteps.length - 1)) * 100}% - 16px)` }}
          />

          {TrackingSteps.map((step) => {
            const isCompleted = orderState >= step.id;
            const isCurrent = orderState === step.id;
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-white ${isCompleted ? 'border-[#111111] text-[#111111] shadow-md' : 'border-[#E5E5E5] text-[#E5E5E5]'} ${isCurrent ? 'ring-4 ring-[#111111]/20 scale-110' : ''}`}>
                  <Icon size={isCurrent ? 16 : 14} strokeWidth={isCompleted ? 3 : 2.5} />
                </div>
                <span className={`text-[9px] font-bold tracking-widest transition-colors duration-500 absolute -bottom-6 w-max ${isCompleted ? 'text-[#111111]' : 'text-[#8B8B8A]'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex items-start gap-2.5 bg-[#F9F9F8] p-3 text-left border border-[#E5E5E5]">
          <Truck size={14} className="text-[#111111] shrink-0 mt-0.5" />
          <div className="text-[11px] text-[#555555]">
            Estimated ready time: <strong>{new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</strong>
            <p className="mt-1">Your order will be packed at our Odorkor shop and dispatched via local courier.</p>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      {orderDetails && (
        <div className="w-full max-w-md bg-white border border-[#E5E5E5] p-6 text-left flex flex-col gap-5 mb-8">

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#8B8B8A] uppercase tracking-wider">DELIVERY RECIPIENT</span>
            <span className="text-[14px] font-bold text-[#111111] uppercase">{orderDetails.fullName}</span>
            <span className="text-[13px] text-[#555555] lowercase first-letter:uppercase">{orderDetails.email} • {orderDetails.phone}</span>
          </div>

          <div className="w-full h-px bg-[#E5E5E5]" />

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#8B8B8A] uppercase tracking-wider">DELIVERY / PICKUP INFO</span>
            <div className="flex items-start gap-1.5 mt-0.5">
              <MapPin size={15} className="text-[#4A5D23] shrink-0 mt-0.5" />
              <span className="text-[13px] text-[#111111]">
                {orderDetails.address}, {orderDetails.city}, {orderDetails.zip}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-[#E5E5E5]" />

          <div className="flex justify-between items-center text-[13px]">
            <div>
              <span className="text-[10px] font-bold text-[#8B8B8A] uppercase tracking-wider block">METHOD</span>
              <span className="text-[13px] font-bold text-[#111111]">
                {orderDetails.paymentMethod === 'DELIVERY' ? "PAY ON ARRIVAL / PICKUP" : "MOBILE MONEY (MOMO)"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#8B8B8A] uppercase tracking-wider block">PRICE</span>
              <span className="text-[14px] font-bold text-[#4A5D23]">GH₵{orderDetails.totalAmount}.00</span>
            </div>
          </div>

        </div>
      )}

      {/* Interactive Lookbook notes */}
      <div className="w-full max-w-md bg-[#4A5D23]/5 border border-[#4A5D23]/25 p-5 text-left flex flex-col gap-3.5 mb-8">
        <div className="flex items-start gap-2.5">
          <Award size={18} className="text-[#4A5D23] shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#555555] leading-relaxed">
            A copy of the digital catalog invoice has been dispatched to listed email credential. Thank you for choosing Dylan's Palace.
          </p>
        </div>
      </div>

      <button
        id="continue-shopping-btn"
        onClick={onContinueShopping}
        className="w-full max-w-md bg-[#111111] text-white py-4 font-semibold text-[13px] uppercase tracking-widest hover:bg-black transition-colors rounded-none cursor-pointer"
      >
        CONTINUE BY BROWSING
      </button>

    </div>
  );
}
