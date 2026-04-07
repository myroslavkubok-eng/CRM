import { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useCurrency, CURRENCIES, Currency } from '../../contexts/CurrencyContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

export function CurrencySelector() {
  const { currency, setCurrency, loading } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularCurrencies = ['USD', 'EUR', 'AED', 'GBP', 'RUB'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50"
          disabled={loading}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium">
            {currency.flag} {currency.code}
          </span>
          <span className="sm:hidden text-sm">{currency.flag}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 max-h-[500px] overflow-y-auto z-[100]">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-600" />
          Select Currency
        </DropdownMenuLabel>
        
        {/* Search */}
        <div className="px-2 pb-2">
          <input
            type="text"
            placeholder="Search currency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <DropdownMenuSeparator />

        {/* Popular Currencies */}
        {!searchQuery && (
          <>
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium text-gray-500 uppercase">Popular</p>
            </div>
            {popularCurrencies.map((code) => {
              const curr = CURRENCIES.find((c) => c.code === code);
              if (!curr) return null;
              
              return (
                <DropdownMenuItem
                  key={curr.code}
                  onClick={() => setCurrency(curr)}
                  className="flex items-center justify-between px-3 py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{curr.flag}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {curr.code}
                      </div>
                      <div className="text-xs text-gray-500">{curr.name}</div>
                    </div>
                  </div>
                  {currency.code === curr.code && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
          </>
        )}

        {/* All Currencies */}
        <div>
          {!searchQuery && (
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium text-gray-500 uppercase">All Currencies</p>
            </div>
          )}
          {filteredCurrencies.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              No currencies found
            </div>
          ) : (
            filteredCurrencies.map((curr) => (
              <DropdownMenuItem
                key={curr.code}
                onClick={() => {
                  setCurrency(curr);
                  setSearchQuery('');
                }}
                className="flex items-center justify-between px-3 py-2 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{curr.flag}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {curr.code} {curr.symbol}
                    </div>
                    <div className="text-xs text-gray-500">{curr.name}</div>
                  </div>
                </div>
                {currency.code === curr.code && (
                  <Check className="w-4 h-4 text-purple-600" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        {loading && (
          <div className="px-3 py-2 text-xs text-center text-gray-500 border-t border-gray-200">
            Updating exchange rates...
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}