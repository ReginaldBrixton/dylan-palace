export interface TrackingMilestone {
  label: string;
  subLabel: string;
  description: string;
  location: string;
  timeOffset: string;
  status: 'completed' | 'active' | 'upcoming';
}

export function getTrackingMilestones(status: string, dateStr: string): TrackingMilestone[] {
  const baseDate = new Date(dateStr);

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
}
