import { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { City, District } from '../data/locations';

interface LocationPickerProps {
  city: City;
  value: string;
  onChange: (location: string) => void;
}

export function LocationPicker({ city, value, onChange }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(value);

  // Find current district or use first one as default
  const currentDistrict = city.districts.find(d => d.name === selectedLocation) || city.districts[0];

  // Update selected location when city changes
  useEffect(() => {
    // Check if current location exists in new city
    const locationExists = city.districts.some(d => d.name === selectedLocation);
    if (!locationExists) {
      // Reset to first district of new city
      const newLocation = city.districts[0]?.name || '';
      setSelectedLocation(newLocation);
      onChange(newLocation);
      localStorage.setItem('userLocation', newLocation);
    }
  }, [city]);

  const handleSelect = (location: string) => {
    setSelectedLocation(location);
    onChange(location);
    setIsOpen(false);
    localStorage.setItem('userLocation', location);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-purple-300 rounded-xl transition-all shadow-sm hover:shadow-md"
      >
        <MapPin className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentDistrict.emoji} {currentDistrict.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Районы {city.name}
              </p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {city.districts.map((district) => (
                <button
                  key={district.id}
                  onClick={() => handleSelect(district.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-purple-50 transition-colors ${
                    district.name === selectedLocation ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{district.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {district.name}
                    </span>
                  </div>
                  {district.name === selectedLocation && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}