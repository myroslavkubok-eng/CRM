import { useState } from 'react';
import { Save, DollarSign, Shield, Calendar, CreditCard, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { useCurrency } from '../../contexts/CurrencyContext';
import { 
  SalonDepositSettings, 
  DEFAULT_DEPOSIT_SETTINGS,
  calculateDeposit 
} from '../types/depositSystem';

interface DepositSettingsPanelProps {
  salonId: string;
  currentSettings?: SalonDepositSettings;
  onSave: (settings: SalonDepositSettings) => void;
}

export function DepositSettingsPanel({
  salonId,
  currentSettings,
  onSave,
}: DepositSettingsPanelProps) {
  const { formatPrice } = useCurrency();
  
  const [settings, setSettings] = useState<SalonDepositSettings>(
    currentSettings || { ...DEFAULT_DEPOSIT_SETTINGS, salonId }
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const [showStripeConnect, setShowStripeConnect] = useState(false);

  const handleSave = async () => {
    // Validation
    if (settings.depositEnabled && !settings.stripeConnected) {
      toast.error('Please connect Stripe before enabling deposits');
      setShowStripeConnect(true);
      return;
    }

    setIsSaving(true);
    
    try {
      // TODO: Save to backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSave(settings);
      toast.success('Deposit settings saved! 🎉');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectStripe = () => {
    // TODO: Redirect to Stripe Connect OAuth
    // const redirectUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${RETURN_URL}`;
    // window.location.href = redirectUrl;
    
    toast.info('Stripe Connect integration coming soon!');
  };

  const testDepositAmount = 200; // For preview

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Deposit & Payment Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Protect your salon from no-shows and fake bookings
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Stripe Connect Status */}
      <Card className={`p-6 ${settings.stripeConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            settings.stripeConnected ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {settings.stripeConnected ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              {settings.stripeConnected ? 'Stripe Connected ✅' : 'Stripe Not Connected'}
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              {settings.stripeConnected 
                ? `Your Stripe account (${settings.stripeAccountId?.substring(0, 15)}...) is connected and ready to accept payments.`
                : 'Connect your Stripe account to accept deposits and online payments directly to your bank account.'
              }
            </p>
            {!settings.stripeConnected && (
              <Button
                onClick={handleConnectStripe}
                className="gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Connect Stripe Account
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            {settings.stripeConnected && (
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">●</span>
                  <span>Charges enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">●</span>
                  <span>Payouts enabled</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Enable/Disable Deposits */}
      <Card className="p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.depositEnabled}
            onChange={(e) => setSettings({ ...settings, depositEnabled: e.target.checked })}
            disabled={!settings.stripeConnected}
            className="w-5 h-5 text-purple-600 rounded disabled:opacity-50"
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Require Deposit for Bookings
            </div>
            <div className="text-sm text-gray-600">
              Protect your salon from no-shows by requiring a deposit to confirm bookings
            </div>
            {!settings.stripeConnected && (
              <div className="text-xs text-yellow-600 mt-1">
                ⚠️ Connect Stripe first to enable deposits
              </div>
            )}
          </div>
        </label>
      </Card>

      {settings.depositEnabled && settings.stripeConnected && (
        <>
          {/* Deposit Amount Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Deposit Amount</h3>
            </div>

            {/* Deposit Type */}
            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-colors hover:bg-gray-50" style={{
                borderColor: settings.depositType === 'fixed' ? '#9333ea' : '#e5e7eb'
              }}>
                <input
                  type="radio"
                  checked={settings.depositType === 'fixed'}
                  onChange={() => setSettings({ ...settings, depositType: 'fixed' })}
                  className="w-4 h-4 text-purple-600 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Fixed Amount</div>
                  <div className="text-sm text-gray-600 mb-2">
                    Charge a fixed deposit amount for all bookings
                  </div>
                  {settings.depositType === 'fixed' && (
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={settings.fixedAmount || ''}
                        onChange={(e) => setSettings({ ...settings, fixedAmount: parseFloat(e.target.value) })}
                        className="w-32"
                        placeholder="50"
                        min="0"
                        step="10"
                      />
                      <span className="text-sm text-gray-600">AED</span>
                      <span className="text-xs text-gray-500 ml-2">
                        Example: {formatPrice(settings.fixedAmount || 50)} deposit for all bookings
                      </span>
                    </div>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-colors hover:bg-gray-50" style={{
                borderColor: settings.depositType === 'percentage' ? '#9333ea' : '#e5e7eb'
              }}>
                <input
                  type="radio"
                  checked={settings.depositType === 'percentage'}
                  onChange={() => setSettings({ ...settings, depositType: 'percentage' })}
                  className="w-4 h-4 text-purple-600 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Percentage of Total</div>
                  <div className="text-sm text-gray-600 mb-2">
                    Charge a percentage of the booking total as deposit
                  </div>
                  {settings.depositType === 'percentage' && (
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={settings.percentageAmount || ''}
                        onChange={(e) => setSettings({ ...settings, percentageAmount: parseFloat(e.target.value) })}
                        className="w-32"
                        placeholder="20"
                        min="0"
                        max="100"
                        step="5"
                      />
                      <span className="text-sm text-gray-600">%</span>
                      <span className="text-xs text-gray-500 ml-2">
                        Example: {settings.percentageAmount}% of {formatPrice(testDepositAmount)} = {formatPrice(calculateDeposit(testDepositAmount, settings))} deposit
                      </span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Min/Max Deposit */}
            {settings.depositType === 'percentage' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Deposit
                  </label>
                  <Input
                    type="number"
                    value={settings.minDepositAmount || ''}
                    onChange={(e) => setSettings({ ...settings, minDepositAmount: parseFloat(e.target.value) })}
                    placeholder="30"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum: {formatPrice(settings.minDepositAmount || 30)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Deposit
                  </label>
                  <Input
                    type="number"
                    value={settings.maxDepositAmount || ''}
                    onChange={(e) => setSettings({ ...settings, maxDepositAmount: parseFloat(e.target.value) })}
                    placeholder="200"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {formatPrice(settings.maxDepositAmount || 200)}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Payment Options */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Options for Clients</h3>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowPayInSalon}
                  onChange={(e) => setSettings({ ...settings, allowPayInSalon: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Allow "Pay at Salon"</div>
                  <div className="text-xs text-gray-600">
                    Let clients pay the full amount when they visit (no online payment required)
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowFullPayment}
                  onChange={(e) => setSettings({ ...settings, allowFullPayment: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Allow Full Payment Online</div>
                  <div className="text-xs text-gray-600">
                    Let clients pay the full amount online (no payment at salon needed)
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireDepositForNewClients}
                  onChange={(e) => setSettings({ ...settings, requireDepositForNewClients: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Require Deposit for New Clients</div>
                  <div className="text-xs text-gray-600">
                    Force new clients to pay deposit (disable "Pay at Salon" option for first-time customers)
                  </div>
                </div>
              </label>
            </div>
          </Card>

          {/* Cancellation Policy */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Cancellation & Refund Policy</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.cancellationPolicy.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    cancellationPolicy: {
                      ...settings.cancellationPolicy,
                      enabled: e.target.checked
                    }
                  })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm font-medium text-gray-900">Enable Cancellation Policy</span>
              </label>

              {settings.cancellationPolicy.enabled && (
                <div className="space-y-4 ml-7">
                  {/* Full Refund Window */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Refund if Cancelled At Least
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={settings.cancellationPolicy.fullRefundHours}
                        onChange={(e) => setSettings({
                          ...settings,
                          cancellationPolicy: {
                            ...settings.cancellationPolicy,
                            fullRefundHours: parseInt(e.target.value)
                          }
                        })}
                        className="w-24"
                        min="0"
                      />
                      <span className="text-sm text-gray-600">hours before appointment</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ✅ Cancel {settings.cancellationPolicy.fullRefundHours}+ hours early = 100% refund
                    </p>
                  </div>

                  {/* Partial Refund Window */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partial Refund if Cancelled At Least
                    </label>
                    <div className="flex items-center gap-3 mb-2">
                      <Input
                        type="number"
                        value={settings.cancellationPolicy.partialRefundHours}
                        onChange={(e) => setSettings({
                          ...settings,
                          cancellationPolicy: {
                            ...settings.cancellationPolicy,
                            partialRefundHours: parseInt(e.target.value)
                          }
                        })}
                        className="w-24"
                        min="0"
                      />
                      <span className="text-sm text-gray-600">hours before appointment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={settings.cancellationPolicy.partialRefundPercent}
                        onChange={(e) => setSettings({
                          ...settings,
                          cancellationPolicy: {
                            ...settings.cancellationPolicy,
                            partialRefundPercent: parseInt(e.target.value)
                          }
                        })}
                        className="w-24"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-gray-600">% refund</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ⚠️ Cancel {settings.cancellationPolicy.partialRefundHours}+ hours early = {settings.cancellationPolicy.partialRefundPercent}% refund
                    </p>
                  </div>

                  {/* No-Show Policy */}
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.cancellationPolicy.noShowRefund}
                        onChange={(e) => setSettings({
                          ...settings,
                          cancellationPolicy: {
                            ...settings.cancellationPolicy,
                            noShowRefund: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-red-600 rounded mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Refund on No-Show</div>
                        <div className="text-xs text-gray-600">
                          Refund deposit if client doesn't show up (NOT recommended)
                        </div>
                      </div>
                    </label>
                    {!settings.cancellationPolicy.noShowRefund && (
                      <p className="text-xs text-red-700 mt-2">
                        ❌ No-show = No refund (recommended to prevent fake bookings)
                      </p>
                    )}
                  </div>

                  {/* Reschedule Policy */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={settings.cancellationPolicy.allowReschedule}
                        onChange={(e) => setSettings({
                          ...settings,
                          cancellationPolicy: {
                            ...settings.cancellationPolicy,
                            allowReschedule: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900">Allow Rescheduling</span>
                    </label>

                    {settings.cancellationPolicy.allowReschedule && (
                      <div className="ml-7 space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Must reschedule at least</span>
                          <Input
                            type="number"
                            value={settings.cancellationPolicy.rescheduleHours}
                            onChange={(e) => setSettings({
                              ...settings,
                              cancellationPolicy: {
                                ...settings.cancellationPolicy,
                                rescheduleHours: parseInt(e.target.value)
                              }
                            })}
                            className="w-20"
                            min="0"
                          />
                          <span className="text-sm text-gray-600">hours before</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Max</span>
                          <Input
                            type="number"
                            value={settings.cancellationPolicy.rescheduleLimit}
                            onChange={(e) => setSettings({
                              ...settings,
                              cancellationPolicy: {
                                ...settings.cancellationPolicy,
                                rescheduleLimit: parseInt(e.target.value)
                              }
                            })}
                            className="w-20"
                            min="0"
                          />
                          <span className="text-sm text-gray-600">reschedules allowed</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Custom Message */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Custom Message to Clients</h3>
            <textarea
              value={settings.customMessage || ''}
              onChange={(e) => setSettings({ ...settings, customMessage: e.target.value })}
              placeholder="We require a deposit to secure your booking. This helps us serve you better and prevents no-shows."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              maxLength={300}
            />
            <p className="text-xs text-gray-500 mt-1">
              {(settings.customMessage || '').length}/300 characters
            </p>
          </Card>

          {/* Preview */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-4">Preview: How Clients See It</h3>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-sm text-gray-600 mb-4">
                Booking: Haircut & Styling - {formatPrice(testDepositAmount)}
              </div>

              {/* Payment Options Preview */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-purple-600 bg-purple-50 rounded-lg cursor-pointer">
                  <input type="radio" checked readOnly className="w-4 h-4 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">💳 Pay Deposit</div>
                    <div className="text-sm text-gray-600">
                      {formatPrice(calculateDeposit(testDepositAmount, settings))} now • {formatPrice(testDepositAmount - calculateDeposit(testDepositAmount, settings))} at salon
                    </div>
                    <div className="text-xs text-purple-600 mt-1">✨ Recommended</div>
                  </div>
                </label>

                {settings.allowPayInSalon && (
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg ${
                    settings.requireDepositForNewClients 
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-300 hover:border-gray-400 cursor-pointer'
                  }`}>
                    <input 
                      type="radio" 
                      disabled={settings.requireDepositForNewClients}
                      className="w-4 h-4 text-purple-600" 
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">🏪 Pay at Salon</div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(0)} now • {formatPrice(testDepositAmount)} at salon
                      </div>
                      {settings.requireDepositForNewClients && (
                        <div className="text-xs text-red-600 mt-1">Deposit required for new clients</div>
                      )}
                    </div>
                  </label>
                )}

                {settings.allowFullPayment && (
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 hover:border-gray-400 rounded-lg cursor-pointer">
                    <input type="radio" className="w-4 h-4 text-purple-600" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">✅ Pay Full Amount</div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(testDepositAmount)} now • {formatPrice(0)} at salon
                      </div>
                    </div>
                  </label>
                )}
              </div>

              {/* Cancellation Policy Preview */}
              {settings.cancellationPolicy.enabled && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-gray-700">
                  <div className="font-semibold mb-2">📋 Cancellation Policy:</div>
                  <ul className="space-y-1">
                    <li>✅ Cancel {settings.cancellationPolicy.fullRefundHours}+ hours early: Full refund</li>
                    <li>⚠️ Cancel {settings.cancellationPolicy.partialRefundHours}+ hours early: {settings.cancellationPolicy.partialRefundPercent}% refund</li>
                    <li>❌ No-show: {settings.cancellationPolicy.noShowRefund ? 'Refund available' : 'No refund'}</li>
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
