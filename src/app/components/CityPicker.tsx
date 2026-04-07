import { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { CITIES, City } from '../data/locations';

interface CityPickerProps {
  value: City;
  onChange: (city: City) => void;
}

export function CityPicker({ value, onChange }: CityPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (city: City) => {
    onChange(city);
    setIsOpen(false);
    localStorage.setItem('userCity', city.id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-purple-300 rounded-xl transition-all shadow-sm hover:shadow-md"
      >
        <Globe className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium text-gray-700">
          {value.emoji} {value.name}
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
                Выберите город
              </p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-purple-50 transition-colors ${
                    city.id === value.id ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{city.emoji}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-700">
                        {city.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {city.country}
                      </div>
                    </div>
                  </div>
                  {city.id === value.id && (
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
