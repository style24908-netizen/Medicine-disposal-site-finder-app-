import React, { useState, useEffect, useCallback } from 'react';
import type { LocationWithDistance, Coordinates } from './types';
import { AppMode } from './types';
import { useGeolocation } from './hooks/useGeolocation';
import { findNearbyLocations, findTopNLocations } from './services/locationService';
import { getCoordinatesForAddress } from './services/geminiService';
import { LocationCard } from './components/LocationCard';
import { SearchIcon, SpinnerIcon, LocationPinIcon } from './components/Icons';
import { autocompleteData } from './data/autocomplete';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Nearby);
  const { position: userLocation, loading: geoLoading, error: geoError } = useGeolocation();
  
  const [searchRadius, setSearchRadius] = useState<number>(3);
  const [nearbyLocations, setNearbyLocations] = useState<LocationWithDistance[]>([]);

  const [addressInput, setAddressInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchedCoords, setSearchedCoords] = useState<Coordinates | null>(null);
  const [searchResultLocations, setSearchResultLocations] = useState<LocationWithDistance[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === AppMode.Nearby && userLocation) {
      const locations = findNearbyLocations(userLocation, searchRadius);
      setNearbyLocations(locations);
    }
  }, [userLocation, searchRadius, mode]);
  
  const handleSearch = useCallback(async (addressOverride?: string) => {
    const addressToSearch = addressOverride !== undefined ? addressOverride : addressInput;
    if (!addressToSearch.trim()) {
      setSearchError("Please enter an address.");
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    setSearchResultLocations([]);
    setSearchedCoords(null);
    setSuggestions([]);

    const coords = await getCoordinatesForAddress(addressToSearch);
    if (coords) {
      setSearchedCoords(coords);
      const results = findTopNLocations(coords, 3);
      setSearchResultLocations(results);
    } else {
      setSearchError("Could not find location. Please try a different address.");
    }
    setSearchLoading(false);
  }, [addressInput]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddressInput(value);
    if (value.trim().length > 0) {
        const filtered = autocompleteData.filter(item => 
            item.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 7); // Show top 7 matches
        setSuggestions(filtered);
    } else {
        setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAddressInput(suggestion);
    setSuggestions([]);
    handleSearch(suggestion);
  };
  
  const renderContent = () => {
    if (mode === AppMode.Nearby) {
      if (geoLoading) return <div className="text-center p-8"><SpinnerIcon className="h-8 w-8 mx-auto text-pink-500" /><p className="mt-2 text-gray-600">Finding your location...</p></div>;
      if (geoError) return <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">{geoError}</div>;
      if (!userLocation) return <div className="text-center p-8 text-gray-600">Could not determine your location.</div>;
      
      return (
        <div>
          <div className="p-4 bg-white rounded-lg shadow-sm mb-4">
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700">Search Radius: {searchRadius} km</label>
            <input
              id="radius"
              type="range"
              min="1"
              max="10"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
            />
          </div>
          {nearbyLocations.length > 0 ? (
            <div className="space-y-4">
              {nearbyLocations.map(loc => <LocationCard key={loc.id} location={loc} />)}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-600 bg-gray-100 rounded-lg">No locations found within {searchRadius} km. Try increasing the radius.</div>
          )}
        </div>
      );
    }

    if (mode === AppMode.Address) {
      return (
        <div>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={addressInput}
                onChange={handleAddressChange}
                onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                placeholder="e.g., 서울특별시 강남구 테헤란로"
                className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-pink-400 focus:border-pink-400"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-b-lg shadow-md mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <li 
                            key={index} 
                            className="px-4 py-2 cursor-pointer hover:bg-pink-100"
                            onMouseDown={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
              )}
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={searchLoading}
              className="px-4 py-2 text-white bg-pink-400 rounded-lg hover:bg-pink-500 disabled:bg-pink-200 flex items-center justify-center w-24"
            >
              {searchLoading ? <SpinnerIcon className="h-5 w-5" /> : <SearchIcon className="h-5 w-5" />}
            </button>
          </div>
          {searchError && <div className="text-center p-4 mb-4 text-red-500 bg-red-50 rounded-lg">{searchError}</div>}
          {searchResultLocations.length > 0 ? (
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 text-blue-800 rounded-lg">
                <p className="font-semibold">Showing 3 closest locations to your searched address.</p>
              </div>
              {searchResultLocations.map(loc => <LocationCard key={loc.id} location={loc} />)}
            </div>
          ) : (
            !searchLoading && <div className="text-center p-8 text-gray-600 bg-gray-100 rounded-lg">Enter an address to find the 3 nearest disposal locations.</div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 font-sans">
      <header className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-5 shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          <i className="fas fa-pills mr-2"></i> Medication Disposal Finder
        </h1>
        <p className="text-center text-sm opacity-90 mt-1">Find safe disposal locations for your medications.</p>
      </header>
      
      <main className="p-4 max-w-2xl mx-auto">
        <div className="flex justify-center bg-white p-1 rounded-lg shadow-sm mb-6">
          <button
            onClick={() => setMode(AppMode.Nearby)}
            className={`w-1/2 py-2.5 text-sm font-semibold rounded-md transition-colors ${mode === AppMode.Nearby ? 'bg-pink-400 text-white shadow' : 'text-gray-600 hover:bg-pink-100'}`}
          >
            <LocationPinIcon className="h-5 w-5 inline-block mr-1" />
            Find Nearby
          </button>
          <button
            onClick={() => setMode(AppMode.Address)}
            className={`w-1/2 py-2.5 text-sm font-semibold rounded-md transition-colors ${mode === AppMode.Address ? 'bg-pink-400 text-white shadow' : 'text-gray-600 hover:bg-pink-100'}`}
          >
            <SearchIcon className="h-5 w-5 inline-block mr-1" />
            Search Address
          </button>
        </div>
        
        {renderContent()}
      </main>
      
      <footer className="text-center py-4 text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Safe Disposal Initiative. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
