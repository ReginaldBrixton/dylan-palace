import { useState, useCallback } from 'react';
import { detectLocation } from '../api/geolocation';

interface GeolocationState {
  isDetecting: boolean;
  message: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    isDetecting: false,
    message: null,
  });

  const detect = useCallback(async (): Promise<{ city: string; street: string; zip: string } | null> => {
    setState({ isDetecting: true, message: 'Accessing system coordinates...' });

    try {
      const result = await detectLocation();
      setState({
        isDetecting: false,
        message: `Detected: ${result.city}, ${result.zip}`,
      });
      return result;
    } catch {
      setState({
        isDetecting: false,
        message: 'Location detection failed. Please enter manually.',
      });
      return null;
    }
  }, []);

  return { ...state, detect };
}
