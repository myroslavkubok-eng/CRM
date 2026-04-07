import { useState } from 'react';
import { DollarSign, Check, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { toast } from 'sonner';

export type DepositOption = 'full' | 'partial' | 'on-arrival' | 'flexible';

interface DepositPolicy {
  id: string;
  enabled: boolean;
  type: DepositOption;
  percentage?: number; // For partial deposits
  amount?: number; // For fixed amount deposits
}

interface DepositSettingsProps {
  currentPolicies?: DepositPolicy[];
  onSave: (policies: DepositPolicy[]) => void;
}

export function DepositSettings({ currentPolicies = [], onSave }: DepositSettingsProps) {
  const [policies, setPolicies] = useState<DepositPolicy[]>(
    currentPolicies.length > 0
      ? currentPolicies
      : [
          { id: 'full', enabled: true, type: 'full' },
          { id: 'partial', enabled: true, type: 'partial', percentage: 20 },
          { id: 'on-arrival', enabled: true, type: 'on-arrival' }
        ]
  );

  const togglePolicy = (id: string) => {
    setPolicies(policies.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const updatePercentage = (id: string, percentage: number) => {
    setPolicies(policies.map(p =>
      p.id === id ? { ...p, percentage: Math.min(100, Math.max(1, percentage)) } : p
    ));
  };

  const handleSave = () => {
    // Validate at least one option is enabled
    const hasEnabled = policies.some(p => p.enabled);
    if (!hasEnabled) {
      toast.error('Please enable at least one payment option');
      return;
    }

    onSave(policies);
    toast.success('Deposit settings saved successfully! 💰');
  };

  const getPolicyDescription = (policy: DepositPolicy) => {
    switch (policy.type) {
      case 'full':
        return 'Client pays 100% when booking online';
      case 'partial':
        return `Client pays ${policy.percentage}% deposit when booking online`;
      case 'on-arrival':
        return 'Client pays 100% at the salon (no online payment)';
      default:
        return '';
    }
  };

  const getPolicyIcon = (type: DepositOption) => {
    return <DollarSign className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">💰 Payment & Deposit Options</h2>
        <p className="text-gray-600">
          Configure how clients can pay for their bookings. You can offer multiple payment options.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">How It Works</h4>
            <p className="text-sm text-blue-800">
              When clients book online, they'll see the enabled payment options. They can choose their preferred method. Deposits help reduce no-shows and guarantee bookings.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-4">
        {/* Full Payment */}
        <Card className={`border-2 transition-all ${
          policies.find(p => p.id === 'full')?.enabled
            ? 'border-purple-200 bg-purple-50'
            : 'border-gray-200 bg-white'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                policies.find(p => p.id === 'full')?.enabled
                  ? 'bg-purple-100'
                  : 'bg-gray-100'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  policies.find(p => p.id === 'full')?.enabled
                    ? 'text-purple-600'
                    : 'text-gray-400'
                }`} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      Full Payment (100%)
                      {policies.find(p => p.id === 'full')?.enabled && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          Enabled
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getPolicyDescription(policies.find(p => p.id === 'full')!)}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policies.find(p => p.id === 'full')?.enabled}
                      onChange={() => togglePolicy('full')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Example booking: AED 300</span>
                    <span className="font-semibold text-purple-600">Pays: AED 300</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">✅ Best for: Guaranteeing appointments, reducing no-shows</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partial Payment (Deposit) */}
        <Card className={`border-2 transition-all ${
          policies.find(p => p.id === 'partial')?.enabled
            ? 'border-blue-200 bg-blue-50'
            : 'border-gray-200 bg-white'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                policies.find(p => p.id === 'partial')?.enabled
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  policies.find(p => p.id === 'partial')?.enabled
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      Partial Payment (Deposit)
                      {policies.find(p => p.id === 'partial')?.enabled && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          Enabled
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getPolicyDescription(policies.find(p => p.id === 'partial')!)}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policies.find(p => p.id === 'partial')?.enabled}
                      onChange={() => togglePolicy('partial')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {policies.find(p => p.id === 'partial')?.enabled && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deposit Percentage
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={policies.find(p => p.id === 'partial')?.percentage || 20}
                        onChange={(e) => updatePercentage('partial', parseInt(e.target.value) || 20)}
                        className="w-24"
                      />
                      <span className="text-gray-600">%</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${policies.find(p => p.id === 'partial')?.percentage || 20}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Common values: 20%, 30%, 50%
                    </p>
                  </div>
                )}

                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Example booking: AED 300</span>
                    <span className="font-semibold text-blue-600">
                      Pays: AED {Math.round(300 * (policies.find(p => p.id === 'partial')?.percentage || 20) / 100)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Remaining AED {300 - Math.round(300 * (policies.find(p => p.id === 'partial')?.percentage || 20) / 100)} paid at salon
                  </div>
                  <div className="text-xs text-gray-500 mt-1">✅ Best for: Securing bookings while keeping flexibility</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pay at Salon */}
        <Card className={`border-2 transition-all ${
          policies.find(p => p.id === 'on-arrival')?.enabled
            ? 'border-green-200 bg-green-50'
            : 'border-gray-200 bg-white'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                policies.find(p => p.id === 'on-arrival')?.enabled
                  ? 'bg-green-100'
                  : 'bg-gray-100'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  policies.find(p => p.id === 'on-arrival')?.enabled
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      Pay at Salon (0%)
                      {policies.find(p => p.id === 'on-arrival')?.enabled && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          Enabled
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getPolicyDescription(policies.find(p => p.id === 'on-arrival')!)}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policies.find(p => p.id === 'on-arrival')?.enabled}
                      onChange={() => togglePolicy('on-arrival')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Example booking: AED 300</span>
                    <span className="font-semibold text-green-600">Pays: AED 0 online</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Full amount AED 300 paid at salon</div>
                  <div className="text-xs text-gray-500 mt-1">⚠️ Higher risk of no-shows</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <h3 className="font-bold text-gray-900">Client View Preview</h3>
          <p className="text-sm text-gray-600">This is what clients will see when booking</p>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Choose Payment Method</h4>
            <div className="space-y-2">
              {policies.filter(p => p.enabled).map(policy => (
                <div
                  key={policy.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment-preview" className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {policy.type === 'full' && 'Pay Full Amount Now'}
                        {policy.type === 'partial' && `Pay ${policy.percentage}% Deposit Now`}
                        {policy.type === 'on-arrival' && 'Pay at Salon'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {policy.type === 'full' && 'Secure your booking with full payment'}
                        {policy.type === 'partial' && `Pay ${policy.percentage}% now, rest at salon`}
                        {policy.type === 'on-arrival' && 'No online payment required'}
                      </div>
                    </div>
                  </div>
                  {policy.type === 'full' && <span className="text-purple-600 font-semibold">AED 300</span>}
                  {policy.type === 'partial' && (
                    <div className="text-right">
                      <div className="text-purple-600 font-semibold">AED {Math.round(300 * (policy.percentage || 20) / 100)}</div>
                      <div className="text-xs text-gray-500">+AED {300 - Math.round(300 * (policy.percentage || 20) / 100)} later</div>
                    </div>
                  )}
                  {policy.type === 'on-arrival' && <span className="text-green-600 font-semibold">Free booking</span>}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Check className="w-4 h-4 mr-2" />
          Save Payment Settings
        </Button>
      </div>
    </div>
  );
}
