import { Search, MapPin, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useIsMobile } from './ui/use-mobile';
import { LocationPicker } from './LocationPicker';
import { CityPicker } from './CityPicker';
import { City } from '../data/locations';

interface MobileSearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedService: string;
  setSelectedService: (value: string) => void;
  currentCity: City;
  onCityChange: (city: City) => void;
  userLocation: string;
  setUserLocation: (location: string) => void;
  onSearchClick: () => void;
}

export function MobileSearchBar({
  searchQuery,
  setSearchQuery,
  selectedService,
  setSelectedService,
  currentCity,
  onCityChange,
  userLocation,
  setUserLocation,
  onSearchClick
}: MobileSearchBarProps) {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isMobile) {
    // Desktop version - simple search bar
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Service Type */}
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="h-12">
              <Sparkles className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="hair">Hair Salon</SelectItem>
              <SelectItem value="nails">Nail Salon</SelectItem>
              <SelectItem value="spa">Spa & Massage</SelectItem>
              <SelectItem value="makeup">Makeup</SelectItem>
            </SelectContent>
          </Select>

          {/* City Picker */}
          <CityPicker currentCity={currentCity} onCityChange={onCityChange} />

          {/* Location Picker */}
          <LocationPicker 
            currentCity={currentCity}
            selectedLocation={userLocation}
            onLocationChange={setUserLocation}
          />
        </div>
        
        <Button
          onClick={onSearchClick}
          className="w-full mt-4 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Search className="w-5 h-5 mr-2" />
          Search Salons
        </Button>
      </div>
    );
  }

  // Mobile version - compact with expandable filters
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Main Search Bar */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <Input
            type="text"
            placeholder="Search salons, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="pl-10 pr-10 h-12 text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filters Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-2 w-full mt-2 py-2 text-sm text-purple-600 font-medium"
        >
          <Sparkles className="w-4 h-4" />
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-gray-100 pt-3">
          {/* Service Type */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Service Type</label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="h-11">
                <Sparkles className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="hair">Hair Salon</SelectItem>
                <SelectItem value="nails">Nail Salon</SelectItem>
                <SelectItem value="spa">Spa & Massage</SelectItem>
                <SelectItem value="makeup">Makeup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">City</label>
            <CityPicker currentCity={currentCity} onCityChange={onCityChange} />
          </div>

          {/* Area */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Area</label>
            <LocationPicker 
              currentCity={currentCity}
              selectedLocation={userLocation}
              onLocationChange={setUserLocation}
            />
          </div>

          {/* Search Button */}
          <Button
            onClick={() => {
              onSearchClick();
              setIsExpanded(false);
            }}
            className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Search className="w-5 h-5 mr-2" />
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}
