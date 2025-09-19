
import { useState, useEffect } from 'react';
import type { Coordinates } from '../types';

interface GeolocationState {
  position: Coordinates | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchLocation = () => {
      if (!navigator.geolocation) {
        setState({
          position: null,
          loading: false,
          error: "Geolocation is not supported by your browser.",
        });
        return;
      }

      setState({ position: null, loading: true, error: null });

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setState({
            position: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
            loading: false,
            error: null,
          });
        },
        (err) => {
          let errorMessage = "An unknown error occurred.";
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "Please allow location access to find nearby places.";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case err.TIMEOUT:
              errorMessage = "The request to get user location timed out.";
              break;
          }
          setState({
            position: null,
            loading: false,
            error: errorMessage,
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};
