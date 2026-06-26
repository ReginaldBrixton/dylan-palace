import { LocationData } from '../types';

interface GeolocationResult {
  city: string;
  street: string;
  zip: string;
}

const FALLBACK_LOCATIONS: GeolocationResult[] = [
  { city: 'New York', street: '742 Evergreen Terrace', zip: '10001' },
  { city: 'San Francisco', street: '88 Brutalist Center Dr', zip: '94105' },
  { city: 'London', street: '10 Downing Street', zip: 'SW1A 2AA' },
];

export async function reverseGeocode(lat: number, lon: number): Promise<GeolocationResult> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
  );

  if (!response.ok) throw new Error('Geocoding API failed');

  const data = await response.json();
  if (!data || !data.address) throw new Error('No address details');

  const addr = data.address;
  return {
    city: addr.city || addr.town || addr.suburb || addr.village || 'Metropolitan Zone',
    street: ((addr.road || '') + ' ' + (addr.house_number || '')).trim() || 'Detected Street Location',
    zip: addr.postcode || '94043',
  };
}

export function detectLocation(): Promise<GeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve(FALLBACK_LOCATIONS[0]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          resolve(result);
        } catch (e) {
          resolve(FALLBACK_LOCATIONS[1]);
        }
      },
      () => {
        resolve(FALLBACK_LOCATIONS[2]);
      },
      { timeout: 8000 }
    );
  });
}

export function buildMapUrl(address: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
}
