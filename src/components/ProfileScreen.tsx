import React, { useState } from 'react';
import { Order, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Heart, 
  ChevronRight, 
  Download, 
  Truck, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Printer, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Compass
} from 'lucide-react';
import { triggerHaptic } from '../haptic';

interface ProfileScreenProps {
  pastOrders: Order[];
  wishlist: Product[];
  onSelectProduct: (p: Product) => void;
}

interface TrackingMilestone {
  label: string;
  subLabel: string;
  description: string;
  location: string;
  timeOffset: string; // text representation
  status: 'completed' | 'active' | 'upcoming';
}

export default function ProfileScreen({ pastOrders, wishlist, onSelectProduct }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'WISHLIST'>('ORDERS');
  const [expandedTracking, setExpandedTracking] = useState<Record<string, boolean>>({});

  const toggleTracking = (orderId: string) => {
    triggerHaptic('selection');
    setExpandedTracking(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleDownloadReceipt = (order: Order) => {
    triggerHaptic('medium');
    
    // Create an iframe to print cleanly without messing up the main page state
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E5E5E5; font-size: 13px; color: #111111;">
          <strong style="font-weight: 600;">${item.product.name}</strong><br/>
          <span style="font-size: 11px; color: #666666;">Size: ${item.selectedSize} | Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #E5E5E5; font-size: 13px; color: #111111;">
          GH₵${(item.product.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const subtotal = order.totalAmount / 1.15;
    const vat = order.totalAmount - subtotal;

    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - DYLAN'S PALACE - #${order.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #111111;
            margin: 0;
            padding: 40px;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #111111;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand {
            font-family: 'Playfair Display', serif;
            font-size: 26px;
            font-weight: bold;
            letter-spacing: -0.05em;
            text-transform: uppercase;
          }
          .invoice-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: #666666;
            text-align: right;
            letter-spacing: 0.15em;
            text-transform: uppercase;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 40px;
            font-size: 12px;
            line-height: 1.6;
          }
          .meta-label {
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #666666;
            margin-bottom: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            border-bottom: 2px solid #111111;
            padding-bottom: 8px;
            text-align: left;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #666666;
          }
          .summary-box {
            margin-left: auto;
            width: 310px;
            font-size: 13px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #111111;
            border-bottom: 2px solid #111111;
            padding: 12px 0;
            margin-top: 10px;
            font-weight: bold;
            font-size: 16px;
          }
          .footer {
            margin-top: 80px;
            border-top: 1px solid #E5E5E5;
            padding-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #8B8B8A;
            letter-spacing: 0.02em;
            line-height: 1.5;
          }
          .badge {
            display: inline-block;
            background: #4A5D23;
            color: white;
            font-size: 9px;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: bold;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-top: 8px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Dylan's Palace</div>
            <div style="font-size: 11px; color: #666666; margin-top: 4px;">Premium Bespoke Apparel & Footwear</div>
          </div>
          <div class="invoice-title">
            INVOICE / RECEIPT<br/>
            <span style="font-size: 18px; font-weight: bold; color: #111111; font-family: 'Inter';">#${order.id}</span>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <div class="meta-label">Billed To</div>
            <strong style="font-size:14px; color: #111111;">${order.details.fullName}</strong><br/>
            ${order.details.email}<br/>
            ${order.details.address}<br/>
            ${order.details.city}, Ghana
          </div>
          <div style="text-align: right;">
            <div class="meta-label">Details</div>
            <strong>Date:</strong> ${new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}<br/>
            <strong>Status:</strong> ${order.status}<br/>
            <span class="badge">SECURED &amp; VERIFIED</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Particulars</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="summary-box">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>GH₵${subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row" style="color: #666666;">
            <span>VAT (15%):</span>
            <span>GH₵${vat.toFixed(2)}</span>
          </div>
          <div class="summary-row" style="color: #666666;">
            <span>Standard Palace Delivery:</span>
            <span>FREE / INCLUDED</span>
          </div>
          <div class="total-row">
            <span>Amount Paid:</span>
            <span>GH₵${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <strong>Thank you for choosing Dylan's Palace.</strong><br/>
          Odorkor Palace St. Mall, Accra, Ghana | support@dylanspalace.com<br/>
          This document serves as an official electronic certificate of your transaction and digital purchase credentials.
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.parent.document.body.removeChild(window.frameElement);
            }, 500);
          }
        </script>
      </body>
      </html>
    `);
    doc.close();
  };

  const getTrackingMilestones = (status: string, dateStr: string): TrackingMilestone[] => {
    const baseDate = new Date(dateStr);
    
    // Format helpers
    const formatOffset = (days: number, hrs: number) => {
      const d = new Date(baseDate.getTime() + (days * 24 + hrs) * 60 * 60 * 1000);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + " at " + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    if (status === 'PROCESSING') {
      return [
        {
          label: 'Order Confirmed',
          subLabel: 'Digital checkout authorized',
          description: "Secure payment received. Dylan's Palace curation team has queued your elements.",
          location: 'Digital Desk Gate, Accra',
          timeOffset: formatOffset(0, 0),
          status: 'completed'
        },
        {
          label: 'Atelier Fabric Matching',
          subLabel: 'Premium sizing double-check',
          description: "Checking loom density and tailoring metrics under strict light calibrations.",
          location: 'Bespoke Atelier Room 2',
          timeOffset: formatOffset(0, 4),
          status: 'active'
        },
        {
          label: 'Elite Handover Dispatch',
          subLabel: 'Securing leather and tissue wraps',
          description: "Courier scheduled for direct priority dispatch with wax seal finish.",
          location: 'Dispatch Hub, Odorkor',
          timeOffset: 'Scheduled soon',
          status: 'upcoming'
        },
        {
          label: 'Regional Hub Sorting',
          subLabel: 'Routing to terminal district vehicle',
          description: "Sorting through regional scanning lockers for localized direct address mapping.",
          location: 'Accra Priority Hub',
          timeOffset: 'Pending atelier dispatch',
          status: 'upcoming'
        },
        {
          label: 'Wax Sealed Delivery',
          subLabel: 'Bespoke receipt hand-over',
          description: "Signature match verifying packaging security. Delivered directly to your doorstep.",
          location: 'Your address',
          timeOffset: 'Pending route lock',
          status: 'upcoming'
        }
      ];
    }

    if (status === 'SHIPPED') {
      return [
        {
          label: 'Order Confirmed',
          subLabel: 'Digital checkout authorized',
          description: "Secure payment received. Dylan's Palace curation team has received your order.",
          location: 'Digital Desk Gate, Accra',
          timeOffset: formatOffset(0, 0),
          status: 'completed'
        },
        {
          label: 'Atelier Fabric Matching',
          subLabel: 'Premium sizing double-check',
          description: "Checking loom density, tailoring metrics, and footwear soles under strict light calibrations.",
          location: 'Bespoke Atelier Room 2',
          timeOffset: formatOffset(0, 4),
          status: 'completed'
        },
        {
          label: 'Elite Handover Dispatch',
          subLabel: 'Securing leather and tissue wraps',
          description: "Package wax-sealed and loaded into the Elite Priority Transit vehicle to guarantee zero wear.",
          location: 'Dispatch Hub, Odorkor',
          timeOffset: formatOffset(0, 18),
          status: 'completed'
        },
        {
          label: 'Regional Hub Sorting',
          subLabel: 'Routing to terminal district vehicle',
          description: "Arrived at Accra Central hub. Sorted into local priority delivery vehicle with active coordinate system.",
          location: 'Accra Main Sorting Hub',
          timeOffset: formatOffset(1, 2),
          status: 'active'
        },
        {
          label: 'Wax Sealed Delivery',
          subLabel: 'Bespoke receipt hand-over',
          description: "Signature match verifying packaging security. Handed directly to you.",
          location: 'Your address',
          timeOffset: 'Scheduled within next 24 hours',
          status: 'upcoming'
        }
      ];
    }

    // Default or DELIVERED status
    return [
      {
        label: 'Order Confirmed',
        subLabel: 'Digital checkout authorized',
        description: "Secure payment received. Dylan's Palace curation team has received your order.",
        location: 'Digital Desk Gate, Accra',
        timeOffset: formatOffset(0, 0),
        status: 'completed'
      },
      {
        label: 'Atelier Fabric Curation',
        subLabel: 'Premium tailoring double-check',
        description: "Tailoring metrics and packaging components carefully certified.",
        location: 'Bespoke Atelier Room 2',
        timeOffset: formatOffset(0, 3),
        status: 'completed'
      },
      {
        label: 'Elite Handover Dispatch',
        subLabel: 'Securing leather wraps',
        description: "Dispatched under priority lane courier logs directly from Odorkor Headquarters.",
        location: 'Dispatch Hub, Odorkor',
        timeOffset: formatOffset(0, 15),
        status: 'completed'
      },
      {
        label: 'Regional Sorting Hub',
        subLabel: 'Local sorting complete',
        description: "Assigned to dedicated courier dispatch locker for terminal gate priority delivery.",
        location: 'Accra Main Sorting Hub',
        timeOffset: formatOffset(1, 1),
        status: 'completed'
      },
      {
        label: 'Delivered & Signed',
        subLabel: 'Palace delivery verified',
        description: "Package successfully arrived at doorstep. Handed over directly with authenticity seal intact.",
        location: 'Your address',
        timeOffset: formatOffset(1, 8),
        status: 'completed'
      }
    ];
  };

  return (
    <div id="profile-screen" className="w-full flex flex-col pb-32 animate-fade-in bg-transparent min-h-screen pt-2">
      
      {/* Tabs list */}
      <div className="flex border-b border-[#E5E5E5] px-4 pt-1 shrink-0 mt-0">
        <button 
          onClick={() => setActiveTab('ORDERS')}
          className={`flex-1 pb-3 text-[11px] font-bold uppercase tracking-widest text-[#111111] border-b-2 transition-colors ${activeTab === 'ORDERS' ? 'border-[#111111] opacity-100' : 'border-transparent opacity-40'}`}
        >
          ORDERS
        </button>
        <button 
          onClick={() => setActiveTab('WISHLIST')}
          className={`flex-1 pb-3 text-[11px] font-bold uppercase tracking-widest text-[#111111] border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'WISHLIST' ? 'border-[#111111] opacity-100' : 'border-transparent opacity-40'}`}
        >
          WISHLIST {wishlist.length > 0 && `(${wishlist.length})`}
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'ORDERS' && (
          <>
            {pastOrders.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Package size={24} className="text-[#E5E5E5] mb-3" />
                <p className="text-[13px] text-[#555555]">No past orders found.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {pastOrders.map((order) => {
                  const milestones = getTrackingMilestones(order.status, order.date);
                  const isExpanded = !!expandedTracking[order.id];
                  
                  // Calculate active progress index
                  const completedCount = milestones.filter(m => m.status === 'completed').length;
                  const activeIndex = milestones.findIndex(m => m.status === 'active');
                  const progressPct = activeIndex !== -1 
                    ? (activeIndex / (milestones.length - 1)) * 100 
                    : completedCount === milestones.length ? 100 : 0;

                  return (
                    <div key={order.id} className="border border-[#E5E5E5] rounded-xl bg-white shadow-sm overflow-hidden text-left flex flex-col">
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
                              GH₵{order.totalAmount.toFixed(2)}
                            </p>
                            <span className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                              order.status === 'DELIVERED' 
                                ? 'bg-[#4A5D23]/10 text-[#4A5D23]' 
                                : order.status === 'SHIPPED'
                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${
                                order.status === 'DELIVERED' ? 'bg-[#4A5D23] animate-pulse' : order.status === 'SHIPPED' ? 'bg-blue-600 animate-ping' : 'bg-amber-600 animate-pulse'
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
                                GH₵{(item.product.price * item.quantity).toFixed(2)}
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
                                      <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300 ${
                                        isCompleted 
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
                          onClick={() => handleDownloadReceipt(order)}
                          className="flex-1 py-2 px-3 border border-[#E5E5E5] hover:border-[#111111] bg-white text-[#111111] hover:bg-[#FAF9F6] active:scale-95 transition-all rounded-lg flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                          title="Generate printable PDF summary"
                        >
                          <FileText size={13} className="text-gray-500" />
                          Receipt
                        </button>

                        {/* Toggle tracking panel */}
                        <button
                          onClick={() => toggleTracking(order.id)}
                          className={`flex-1 py-2 px-3 border transition-all rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider cursor-pointer ${
                            isExpanded 
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
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'WISHLIST' && (
          <>
            {wishlist.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Heart size={24} className="text-[#E5E5E5] mb-3" />
                <p className="text-[13px] text-[#555555]">Your wishlist is empty.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
                {wishlist.map((product) => (
                  <div key={product.id} className="flex items-center py-3 gap-3 cursor-pointer group hover:bg-[#F9F9F8]" onClick={() => onSelectProduct(product)}>
                    <div className="w-16 h-20 bg-[#eeeeed] shrink-0 rounded overflow-hidden">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 font-sans">
                      <p className="text-[9px] font-bold text-[#8B8B8A] uppercase tracking-wider mb-0.5">{product.brand || product.category}</p>
                      <h4 className="text-[12px] font-bold text-[#111111] truncate">{product.name}</h4>
                      <p className="font-serif text-[13px] font-bold text-[#111111] mt-1">GH₵{product.price.toFixed(2)}</p>
                    </div>
                    <ChevronRight size={16} className="text-[#E5E5E5] group-hover:text-[#111111] shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
