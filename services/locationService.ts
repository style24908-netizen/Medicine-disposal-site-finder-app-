
import type { Location, LocationWithDistance, Coordinates } from '../types';
import { locations } from '../data/locations';

// Haversine formula to calculate distance between two lat/lng points
export const getDistance = (p1: Coordinates, p2: Coordinates): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
  const dLon = (p2.lng - p1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat * (Math.PI / 180)) * Math.cos(p2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const findNearbyLocations = (userCoords: Coordinates, radius: number): LocationWithDistance[] => {
  return locations
    .map(location => ({
      ...location,
      distance: getDistance(userCoords, { lat: location.lat, lng: location.lng }),
    }))
    .filter(location => location.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
};

export const findTopNLocations = (targetCoords: Coordinates, n: number): LocationWithDistance[] => {
    return locations
    .map(location => ({
      ...location,
      distance: getDistance(targetCoords, { lat: location.lat, lng: location.lng }),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, n);
}
