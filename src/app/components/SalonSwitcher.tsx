import { useState, useRef, useEffect } from 'react';
import { Store, ChevronDown, Check, Plus, Settings } from 'lucide-react';
import { Button } from './ui/button';
import type { Salon } from '../../types/roles';

interface SalonSwitcherProps {
  salons: Salon[];
  currentSalonId: string;
  onSwitch: (salonId: string) => void;
  onAddNew?: () => void;
  onManage?: () => void;
}

export function SalonSwitcher({ 
  salons, 
  currentSalonId, 
  onSwitch, 
  onAddNew,
  onManage 
}: SalonSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSalon = salons.find(s => s.id === currentSalonId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to get a plan badge color based on the salon plan
  const getPlanBadgeColor = (plan?: string) => {
    switch (plan) {
      case 'business':
        return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'professional':
        return 'bg-gradient-to-r from-blue-600 to-cyan-600';
      case 'starter':
        return 'bg-gray-400';
      default:
        return 'bg-gradient-to-r from-purple-600 to-pink-600';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-all shadow-sm min-w-[200px]"
      >
        <div className="flex items-center gap-3 flex-1">
          {currentSalon?.logo ? (
            <img
              src={currentSalon.logo}
              alt={currentSalon.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div className="text-left flex-1">
            <div className="font-semibold text-gray-900 text-sm truncate max-w-[150px]">
              {currentSalon?.name || 'Select Salon'}
            </div>
            {currentSalon && (
              <div className="text-xs text-gray-500 truncate max-w-[150px]">
                {currentSalon.address}
              </div>
            )}
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 text-sm">Switch Salon</div>
                <div className="text-xs text-gray-600">{salons.length} locations</div>
              </div>
              {onManage && (
                <button
                  onClick={() => {
                    onManage();
                    setIsOpen(false);
                  }}
                  className="text-purple-600 hover:text-purple-700 text-xs font-medium flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  Manage All
                </button>
              )}
            </div>
          </div>

          {/* Salons List */}
          <div className="max-h-96 overflow-y-auto">
            {salons.map((salon) => (
              <button
                key={salon.id}
                onClick={() => {
                  onSwitch(salon.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                  salon.id === currentSalonId ? 'bg-purple-50' : ''
                }`}
              >
                {salon.logo ? (
                  <img
                    src={salon.logo}
                    alt={salon.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-lg ${getPlanBadgeColor(salon.plan)} flex items-center justify-center flex-shrink-0`}>
                    <Store className="w-5 h-5 text-white" />
                  </div>
                )}

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-gray-900 text-sm truncate">
                      {salon.name}
                    </div>
                    {salon.id === currentSalonId && (
                      <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600 truncate">{salon.address}</div>
                  {salon.isPublished && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600">
                        Published
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Add New Button */}
          {onAddNew && (
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <Button
                onClick={() => {
                  onAddNew();
                  setIsOpen(false);
                }}
                variant="outline"
                className="w-full justify-center border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Salon
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}