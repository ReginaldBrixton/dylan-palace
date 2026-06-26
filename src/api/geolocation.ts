interface GeolocationResult {
  city: string;
  street: string;
  zip: string;
}

const FALLBACK_LOCATIONS: GeolocationResult[] = [
  { city: 'Accra', street: 'Oxford Street, Osu', zip: 'GA-184-3528' },
  { city: 'Kumasi', street: 'Adum High Street', zip: 'AK-037-2024' },
  { city: 'Takoradi', street: 'Market Circle Road', zip: 'WR-011-7782' },
];

export async function reverseGeocode(lat: number, lon: number): Promise<GeolocationResult> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&zoom=18`,
    { headers: { 'Accept-Language': 'en' } }
  );

  if (!response.ok) throw new Error('Geocoding API failed');

  const data = await response.json();
  if (!data || !data.address) throw new Error('No address details');

  const addr = data.address;
  return {
    city: addr.city || addr.town || addr.suburb || addr.village || addr.county || 'Accra',
    street: ((addr.road || '') + ' ' + (addr.house_number || '')).trim() || 'Detected Street Location',
    zip: addr.postcode || 'GA-184-3528',
  };
}

export function detectLocation(): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(FALLBACK_LOCATIONS[0]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          resolve(result);
        } catch {
          resolve(FALLBACK_LOCATIONS[1]);
        }
      },
      () => {
        resolve(FALLBACK_LOCATIONS[2]);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

export function buildMapUrl(address: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
}
