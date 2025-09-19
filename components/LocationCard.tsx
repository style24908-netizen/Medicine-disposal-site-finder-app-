
import React from 'react';
import type { LocationWithDistance } from '../types';
import { LocationPinIcon, PhoneIcon, NavigationIcon } from './Icons';

interface LocationCardProps {
  location: LocationWithDistance;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="p-5">
        <div className="flex items-start">
          <LocationPinIcon className="h-6 w-6 text-pink-500 mt-1 flex-shrink-0" />
          <div className="ml-4 flex-1">
            <div className="uppercase tracking-wide text-sm text-pink-600 font-bold">{location.name}</div>
            <p className="mt-1 text-gray-600">{location.road_address}</p>
            <p className="mt-2 text-sm font-semibold text-gray-800">{location.distance.toFixed(2)} km away</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          {location.phone && (
            <a
              href={`tel:${location.phone}`}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PhoneIcon className="h-4 w-4 mr-2" />
              Call
            </a>
          )}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-pink-400 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400"
          >
            <NavigationIcon className="h-4 w-4 mr-2" />
            Navigate
          </a>
        </div>
      </div>
    </div>
  );
};
