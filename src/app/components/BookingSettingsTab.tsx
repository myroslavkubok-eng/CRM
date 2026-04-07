import { useState } from 'react';
import { Save, Settings, Users, Gift, Repeat, Percent } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';

export interface BookingSettings {
  groupDiscounts: {
    tier1: { minPeople: number; maxPeople: number; discount: number };
    tier2: { minPeople: number; maxPeople: number; discount: number };
    tier3: { minPeople: number; maxPeople: number; discount: number };
  };
  packageDealsDiscount: number;
  recurringDiscount: number;
  enableGroupBooking: boolean;
  enablePackageDeals: boolean;
  enableRecurringBooking: boolean;
}

export function BookingSettingsTab() {
  const { formatPrice } = useCurrency();
  
  const [settings, setSettings] = useState<BookingSettings>({
    groupDiscounts: {
      tier1: { minPeople: 2, maxPeople: 3, discount: 5 },
      tier2: { minPeople: 4, maxPeople: 5, discount: 10 },
      tier3: { minPeople: 6, maxPeople: 99, discount: 15 },
    },
    packageDealsDiscount: 20,
    recurringDiscount: 10,
    enableGroupBooking: true,
    enablePackageDeals: true,
    enableRecurringBooking: true,
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // Save to context/backend
    localStorage.setItem('bookingSettings', JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Settings</h2>
          <p className="text-sm text-gray-500">Configure discounts and booking options</p>
        </div>
        <Button 
          onClick={handleSave}
          className={`gap-2 transition-all ${
            isSaved 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
          }`}
        >
          <Save className="w-4 h-4" />
          {isSaved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>

      {/* Group Booking Settings */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Group Booking Discounts</h3>
              <p className="text-sm text-gray-600">Set discounts based on group size</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableGroupBooking}
              onChange={(e) => setSettings({ ...settings, enableGroupBooking: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
          </label>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Tier 1 */}
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Percent className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">Tier 1 Discount</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Min People</label>
                <input
                  type="number"
                  value={settings.groupDiscounts.tier1.minPeople}
                  onChange={(e) => setSettings({
                    ...settings,
                    groupDiscounts: {
                      ...settings.groupDiscounts,
                      tier1: { ...settings.groupDiscounts.tier1, minPeople: Number(e.target.value) }
                    }
                  })}
                  min={2}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Max People</label>
                <input
                  type="number"
                  value={settings.groupDiscounts.tier1.maxPeople}
                  onChange={(e) => setSettings({
                    ...settings,
                    groupDiscounts: {
                      ...settings.groupDiscounts,
                      tier1: { ...settings.groupDiscounts.tier1, maxPeople: Number(e.target.value) }
                    }
                  })}
                  min={2}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Discount %</label>
                <input
                  type="number"
                  value={settings.groupDiscounts.tier1.discount}
                  onChange={(e) => setSettings({
                    ...settings,
                    groupDiscounts: {
                      ...settings.groupDiscounts,
                      tier1: { ...settings.groupDiscounts.tier1, discount: Number(e.target.value) }
                    }
                  })}
                  min={0}
                  max={100}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="text-center p-2 bg-white rounded-lg">
                <span className="text-2xl font-bold text-green-600">
                  {settings.groupDiscounts.tier1.discount}% OFF
                </span>
              </div>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Percent className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Tier 2 Discount</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Min People</label>
                <input
                  type="number"
                  value={settings.groupDiscounts.tier2.minPeople}
                  onChange={(e) => setSettings({
                    ...settings,
                    groupDiscounts: {
                      ...settings.groupDiscounts,
                      tier2: { ...settings.groupDiscounts.tier2, minPeople: Number(e.target.value) }
                    }
                  })}
                  min={2}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Max People</label>
                <input
                  type="number"
                  value={settings.groupDiscounts.tier2.maxPeople}
                  onChange={(e) => setSettings({
                    ...settings,
                    groupDiscounts: {
                      ...settings.groupDiscounts,
                      tier2: { ...settings.groupDiscounts.tier2, maxPeople: Number(e.target.value) }
                    }
                  })}
                  min={2}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Discount %</label>
                <input
                  type="number"
                  value={settings.groupDiscounts.tier2.discount}
                  onChange={(e) => setSettings({
                    ...settings,
                    groupDiscounts: {
                      ...settings.groupDiscounts,
                      tier2: { ...settings.groupDiscounts.tier2, discount: Number(e.target.value) }
                    }
                  })}
                  min={0}
                  max={100}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-center p-2 bg-white rounded-lg">
                <span className="text-2xl font-bold text-blue-600">
                  {settings.groupDiscounts.tier2.discount}% OFF
                </span>
              </div>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Percent className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Tier 3 Discount</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Min People</label>
                <input
                  type="number"
                  value={settings.groupDiscounts.tier3.minPeople}
                  onChange={(e) => setSettings({
                    ...settings,
                    groupDiscounts: {
                      ...settings.groupDiscounts,
                      tier3: { ...settings.groupDiscounts.tier3, minPeople: Number(e.target.value) }
                    }
                  })}
                  min={2}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Max People</label>
                <input
                  type="number"
                  value={settings.groupDiscounts.tier3.maxPeople}
                  onChange={(e) => setSettings({
                    ...settings,
                    groupDiscounts: {
                      ...settings.groupDiscounts,
                      tier3: { ...settings.groupDiscounts.tier3, maxPeople: Number(e.target.value) }
                    }
                  })}
                  min={2}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Discount %</label>
                <input
                  type="number"
                  value={settings.groupDiscounts.tier3.discount}
                  onChange={(e) => setSettings({
                    ...settings,
                    groupDiscounts: {
                      ...settings.groupDiscounts,
                      tier3: { ...settings.groupDiscounts.tier3, discount: Number(e.target.value) }
                    }
                  })}
                  min={0}
                  max={100}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="text-center p-2 bg-white rounded-lg">
                <span className="text-2xl font-bold text-purple-600">
                  {settings.groupDiscounts.tier3.discount}% OFF
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Preview:</h4>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              {settings.groupDiscounts.tier1.minPeople}-{settings.groupDiscounts.tier1.maxPeople} people = <span className="font-bold text-green-600">{settings.groupDiscounts.tier1.discount}% OFF</span>
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">
              {settings.groupDiscounts.tier2.minPeople}-{settings.groupDiscounts.tier2.maxPeople} people = <span className="font-bold text-blue-600">{settings.groupDiscounts.tier2.discount}% OFF</span>
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">
              {settings.groupDiscounts.tier3.minPeople}+ people = <span className="font-bold text-purple-600">{settings.groupDiscounts.tier3.discount}% OFF</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Package Deals Settings */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Package Deals Discount</h3>
              <p className="text-sm text-gray-600">Default discount for service packages</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enablePackageDeals}
              onChange={(e) => setSettings({ ...settings, enablePackageDeals: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Package Deals Discount (%)
            </label>
            <input
              type="number"
              value={settings.packageDealsDiscount}
              onChange={(e) => setSettings({ ...settings, packageDealsDiscount: Number(e.target.value) })}
              min={0}
              max={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center justify-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Clients save</p>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {settings.packageDealsDiscount}% OFF
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Example:</strong> Manicure ({formatPrice(50)}) + Pedicure ({formatPrice(70)}) = {formatPrice(120)} → 
            <span className="font-bold text-purple-600 ml-1">
              {formatPrice(120 * (1 - settings.packageDealsDiscount / 100))} (Save {formatPrice(120 * settings.packageDealsDiscount / 100)})
            </span>
          </p>
        </div>
      </Card>

      {/* Recurring Booking Settings */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Repeat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recurring Booking Discount</h3>
              <p className="text-sm text-gray-600">Incentive for regular clients</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableRecurringBooking}
              onChange={(e) => setSettings({ ...settings, enableRecurringBooking: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Recurring Discount (%)
            </label>
            <input
              type="number"
              value={settings.recurringDiscount}
              onChange={(e) => setSettings({ ...settings, recurringDiscount: Number(e.target.value) })}
              min={0}
              max={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center justify-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Clients save per visit</p>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {settings.recurringDiscount}% OFF
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Example:</strong> Weekly haircut at {formatPrice(50)} × 12 visits = {formatPrice(600)} → 
            <span className="font-bold text-orange-600 ml-1">
              {formatPrice(600 * (1 - settings.recurringDiscount / 100))} (Save {formatPrice(600 * settings.recurringDiscount / 100)})
            </span>
          </p>
        </div>
      </Card>

      {/* Summary Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">Current Settings Summary</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Group Booking</div>
            <div className="font-bold text-lg text-gray-900">
              {settings.enableGroupBooking ? 'Enabled' : 'Disabled'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Up to {settings.groupDiscounts.tier3.discount}% OFF
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Package Deals</div>
            <div className="font-bold text-lg text-gray-900">
              {settings.enablePackageDeals ? 'Enabled' : 'Disabled'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {settings.packageDealsDiscount}% OFF
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Recurring Booking</div>
            <div className="font-bold text-lg text-gray-900">
              {settings.enableRecurringBooking ? 'Enabled' : 'Disabled'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {settings.recurringDiscount}% OFF
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
