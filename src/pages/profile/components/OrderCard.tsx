import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Compass,
  Truck,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Order } from '../../../types';
import { CURRENCY } from '../../../constants';
import { triggerHaptic } from '../../../utils/haptic';
import { getTrackingMilestones } from '../utils/tracking';
import { printReceipt } from '../utils/receipt';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const milestones = getTrackingMilestones(order.status, order.date);
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const activeIndex = milestones.findIndex(m => m.status === 'active');
  const progressPct = activeIndex !== -1
    ? (activeIndex / (milestones.length - 1)) * 100
    : completedCount === milestones.length ? 100 : 0;

  const toggleTracking = () => {
    triggerHaptic('selection');
    setIsExpanded(prev => !prev);
  };

  const handleDownloadReceipt = () => {
    triggerHaptic('medium');
    printReceipt(order);
  };

  return (
    <div className="border border-[#E5E5E5] rounded-xl bg-white shadow-sm overflow-hidden text-left flex flex-col">
      {/* Order Card Header */}
      <div className="p-4 border-b border-[#E5E5E5] bg-[#FDFDFD]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-[#8B8B8A] font-bold uppercase tracking-widest mb-1">
              ORDER ID: <span className="font-mono text-[#111111]">{order.id}</span>
            </p>
            <p className="text-[12px] text-[#111111] font-medium">
              {new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-serif text-[15px] font-bold text-[#111111]">
              {CURRENCY}{order.totalAmount.toFixed(2)}
            </p>
            <span className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${order.status === 'DELIVERED'
              ? 'bg-[#4A5D23]/10 text-[#4A5D23]'
              : order.status === 'SHIPPED'
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
              <span className={`w-1 h-1 rounded-full ${order.status === 'DELIVERED' ? 'bg-[#4A5D23] animate-pulse' : order.status === 'SHIPPED' ? 'bg-blue-600 animate-ping' : 'bg-amber-600 animate-pulse'
                }`} />
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Purchased products list */}
      <div className="p-4 bg-white/50 border-b border-[#E5E5E5]/60">
        <ul className="flex flex-col gap-2.5">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-start text-[12px] gap-4">
              <div className="flex gap-2.5 items-center min-w-0">
                <div className="w-8 h-10 bg-[#FAF9F6] border border-[#E5E5E5] shrink-0 rounded overflow-hidden">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="truncate">
                  <span className="font-medium text-[#111111]">{item.product.name}</span>
                  <div className="text-[10px] text-[#8B8B8A] font-medium font-mono uppercase mt-0.5">
                    SIZE: {item.selectedSize} &bull; QTY: {item.quantity}
                  </div>
                </div>
              </div>
              <span className="font-mono text-[#111111] pt-0.5 font-medium">
                {CURRENCY}{(item.product.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Brief visual timeline preview bar */}
      <div className="px-4 py-3 bg-[#FAFBFB] flex flex-col gap-2 border-b border-[#E5E5E5]/40">
        <div className="flex justify-between items-center text-[10px] text-[#555555] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Compass size={12} className="text-[#8B8B8A] animate-spin" style={{ animationDuration: '6s' }} /> LIVE Post-Purchase Tracking
          </span>
          <span className="text-[#8B8B8A] lowercase font-normal font-mono">
            {progressPct.toFixed(0)}% route complete
          </span>
        </div>

        {/* Horizontal Custom Timeline Bar */}
        <div className="relative w-full h-1 bg-[#E5E5E5] rounded-full my-1 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#4A5D23]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>

        {/* Node mini indicators */}
        <div className="flex justify-between text-[8px] font-extrabold uppercase tracking-widest text-[#8B8B8A]">
          <span className={completedCount >= 1 ? "text-[#4A5D23]" : ""}>PLACED</span>
          <span className={completedCount >= 2 ? "text-[#4A5D23]" : ""}>ASSEMBLED</span>
          <span className={completedCount >= 3 ? "text-[#4A5D23]" : ""}>DISPATCHED</span>
          <span className={completedCount >= 4 ? "text-[#4A5D23]" : ""}>ROUTING</span>
          <span className={completedCount >= 5 ? "text-[#4A5D23]" : ""}>DELIVERED</span>
        </div>
      </div>

      {/* Drawer Collapsible live logging details */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden bg-[#FAF9F6] border-b border-[#E5E5E5]"
          >
            <div className="p-4 flex flex-col gap-4">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#111111] pb-1 border-b border-[#C9C9C7]/50">
                Sartorial Courier Checkpoints
              </h5>

              {/* Vertical Stepper Timeline Design */}
              <div className="relative pl-6 border-l border-dashed border-[#E5E5E5] flex flex-col gap-5 ml-2 mt-1">
                {milestones.map((m, mIdx) => {
                  const isCompleted = m.status === 'completed';
                  const isActive = m.status === 'active';

                  return (
                    <div key={mIdx} className="relative text-left">
                      {/* Stepper Node dot */}
                      <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300 ${isCompleted
                        ? 'border-[#4A5D23] text-[#4A5D23]'
                        : isActive
                          ? 'border-[#111111] text-[#111111] animate-pulse scale-110'
                          : 'border-[#E5E5E5] text-[#8B8B8A]'
                        }`}>
                        {isCompleted ? (
                          <CheckCircle2 size={10} className="fill-[#4A5D23] text-white" />
                        ) : isActive ? (
                          <Clock size={10} className="animate-spin text-[#111111]" style={{ animationDuration: '3s' }} />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col">
                        <div className="flex justify-between items-baseline gap-2">
                          <h6 className={`text-[12px] font-bold ${isCompleted ? 'text-[#111111]' : isActive ? 'text-[#4A5D23]' : 'text-[#8B8B8A]'}`}>
                            {m.label}
                          </h6>
                          <span className="font-mono text-[9px] text-[#8B8B8A] shrink-0">
                            {m.timeOffset}
                          </span>
                        </div>
                        <span className="text-[9px] font-medium font-mono text-[#8B8B8A] uppercase tracking-wider mt-0.5 block">
                          {m.subLabel} &bull; <span className="text-[#111111]/70 font-semibold">{m.location}</span>
                        </span>
                        <p className="text-[11px] text-[#555555] leading-relaxed mt-1 pr-2">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white/80 p-3 rounded-lg border border-[#E5E5E5]/60 flex items-start gap-2 text-[10px] text-[#666666] leading-relaxed">
                <Truck size={14} className="text-[#111111] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#111111] uppercase tracking-wider text-[9px] block mb-0.5">POLICIES CERTIFICATE</strong>
                  Your package undergoes multi-point sterile sanitation and is delivered using our zero-emission luxury garments packaging protocol.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Action Controls Row */}
      <div className="p-3 bg-white flex items-center justify-between gap-3">
        {/* Download Printable Invoice/Receipt */}
        <button
          onClick={handleDownloadReceipt}
          className="flex-1 py-2 px-3 border border-[#E5E5E5] hover:border-[#111111] bg-white text-[#111111] hover:bg-[#FAF9F6] active:scale-95 transition-all rounded-lg flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider cursor-pointer"
          title="Generate printable PDF summary"
        >
          <FileText size={13} className="text-gray-500" />
          Receipt
        </button>

        {/* Toggle tracking panel */}
        <button
          onClick={toggleTracking}
          className={`flex-1 py-2 px-3 border transition-all rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider cursor-pointer ${isExpanded
            ? 'bg-[#111111] text-white border-[#111111]'
            : 'bg-white text-[#111111] border-[#E5E5E5] hover:bg-[#FAF9F6]'
            }`}
        >
          {isExpanded ? (
            <>
              Hide Track <ChevronUp size={13} />
            </>
          ) : (
            <>
              Track Live <ChevronDown size={13} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
