import { useState } from 'react';
import { Globe, X } from 'lucide-react';
import { useCurrency, CURRENCIES } from '../../contexts/CurrencyContext';
import { Button } from './ui/button';

export function CurrencySelectorSimple() {
  const { currency, setCurrency, loading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
        <Globe className="w-4 h-4 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currency.flag} {currency.code}
        </span>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-900">Select Currency</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Popular Currencies */}
            <div className="p-2">
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-gray-500 uppercase">Popular</p>
              </div>
              {['USD', 'EUR', 'AED', 'GBP', 'RUB'].map((code) => {
                const curr = CURRENCIES.find((c) => c.code === code);
                if (!curr) return null;
                
                return (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors ${
                      currency.code === curr.code ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{curr.flag}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {curr.code}
                        </div>
                        <div className="text-xs text-gray-500">{curr.name}</div>
                      </div>
                    </div>
                    {currency.code === curr.code && (
                      <div className="w-2 h-2 rounded-full bg-purple-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-2" />

            {/* All Currencies */}
            <div className="p-2">
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-gray-500 uppercase">All Currencies</p>
              </div>
              <div className="space-y-1">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors ${
                      currency.code === curr.code ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{curr.flag}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {curr.code} {curr.symbol}
                        </div>
                        <div className="text-xs text-gray-500">{curr.name}</div>
                      </div>
                    </div>
                    {currency.code === curr.code && (
                      <div className="w-2 h-2 rounded-full bg-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
