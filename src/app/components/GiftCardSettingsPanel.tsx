import { useState } from 'react';
import { Save, Plus, Trash2, Edit2, DollarSign, Calendar, Mail, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { useCurrency } from '../../contexts/CurrencyContext';

interface GiftCardSettings {
  enabled: boolean;
  presetAmounts: number[];
  allowCustomAmounts: boolean;
  minAmount: number;
  maxAmount: number;
  expiryMonths: number | null; // null = never expires
  allowPartialUse: boolean;
  allowMultipleServices: boolean;
  requireMinimumPurchase: boolean;
  minimumPurchaseAmount?: number;
  customMessage: string;
  sendToRecipient: boolean;
  sendConfirmationToPurchaser: boolean;
  notifyOwnerOnUse: boolean;
}

interface GiftCardSettingsPanelProps {
  salonId: string;
  currentSettings?: GiftCardSettings;
  onSave: (settings: GiftCardSettings) => void;
}

export function GiftCardSettingsPanel({
  salonId,
  currentSettings,
  onSave,
}: GiftCardSettingsPanelProps) {
  const { formatPrice } = useCurrency();
  
  // Default settings
  const defaultSettings: GiftCardSettings = {
    enabled: true,
    presetAmounts: [100, 200, 300, 500, 1000],
    allowCustomAmounts: true,
    minAmount: 50,
    maxAmount: 5000,
    expiryMonths: null, // Never expires
    allowPartialUse: true,
    allowMultipleServices: true,
    requireMinimumPurchase: false,
    customMessage: 'Thank you for choosing our salon! Your gift card can be used for any service.',
    sendToRecipient: true,
    sendConfirmationToPurchaser: true,
    notifyOwnerOnUse: true,
  };

  const [settings, setSettings] = useState<GiftCardSettings>(
    currentSettings || defaultSettings
  );
  
  const [newAmount, setNewAmount] = useState('');
  const [editingAmount, setEditingAmount] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Add new preset amount
  const handleAddAmount = () => {
    const amount = parseFloat(newAmount);
    
    if (!amount || amount < 1) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (settings.presetAmounts.includes(amount)) {
      toast.error('This amount already exists');
      return;
    }

    const updated = [...settings.presetAmounts, amount].sort((a, b) => a - b);
    setSettings({ ...settings, presetAmounts: updated });
    setNewAmount('');
    toast.success(`Added ${formatPrice(amount)}`);
  };

  // Remove preset amount
  const handleRemoveAmount = (amount: number) => {
    const updated = settings.presetAmounts.filter(a => a !== amount);
    setSettings({ ...settings, presetAmounts: updated });
    toast.success(`Removed ${formatPrice(amount)}`);
  };

  // Start editing amount
  const handleStartEdit = (amount: number) => {
    setEditingAmount(amount);
    setEditValue(amount.toString());
  };

  // Save edited amount
  const handleSaveEdit = () => {
    if (editingAmount === null) return;

    const newValue = parseFloat(editValue);
    
    if (!newValue || newValue < 1) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (newValue !== editingAmount && settings.presetAmounts.includes(newValue)) {
      toast.error('This amount already exists');
      return;
    }

    const updated = settings.presetAmounts
      .map(a => a === editingAmount ? newValue : a)
      .sort((a, b) => a - b);
    
    setSettings({ ...settings, presetAmounts: updated });
    setEditingAmount(null);
    setEditValue('');
    toast.success('Amount updated');
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingAmount(null);
    setEditValue('');
  };

  // Save all settings
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // TODO: Save to backend
      // await fetch(`/api/gift-cards/salon/${salonId}/settings`, {
      //   method: 'PUT',
      //   body: JSON.stringify(settings)
      // });
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      onSave(settings);
      toast.success('Settings saved successfully! 🎉');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gift Card Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure gift cards for your salon
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

      {/* Enable/Disable */}
      <Card className="p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
            className="w-5 h-5 text-purple-600 rounded"
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Enable Gift Cards</div>
            <div className="text-sm text-gray-600">
              Allow customers to purchase and redeem gift cards for your salon
            </div>
          </div>
        </label>
      </Card>

      {settings.enabled && (
        <>
          {/* Preset Amounts */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Preset Amounts</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Set the default amounts customers can choose from
            </p>

            {/* Current Amounts */}
            <div className="space-y-2 mb-4">
              {settings.presetAmounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No preset amounts. Add some below.
                </div>
              ) : (
                settings.presetAmounts.map((amount) => (
                  <div
                    key={amount}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {editingAmount === amount ? (
                      <>
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1"
                          min="1"
                          step="10"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {formatPrice(amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Popular choice
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartEdit(amount)}
                          className="gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveAmount(amount)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </Button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add New Amount */}
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter amount (e.g., 150)"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="flex-1"
                min="1"
                step="10"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddAmount();
                  }
                }}
              />
              <Button
                onClick={handleAddAmount}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Amount
              </Button>
            </div>
          </Card>

          {/* Custom Amounts */}
          <Card className="p-6">
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={settings.allowCustomAmounts}
                onChange={(e) => setSettings({ ...settings, allowCustomAmounts: e.target.checked })}
                className="w-5 h-5 text-purple-600 rounded mt-0.5"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Allow Custom Amounts</div>
                <div className="text-sm text-gray-600">
                  Let customers enter their own gift card amount
                </div>
              </div>
            </label>

            {settings.allowCustomAmounts && (
              <div className="ml-8 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Amount
                  </label>
                  <Input
                    type="number"
                    value={settings.minAmount}
                    onChange={(e) => setSettings({ ...settings, minAmount: parseFloat(e.target.value) })}
                    min="1"
                    step="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {formatPrice(settings.minAmount)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Amount
                  </label>
                  <Input
                    type="number"
                    value={settings.maxAmount}
                    onChange={(e) => setSettings({ ...settings, maxAmount: parseFloat(e.target.value) })}
                    min="1"
                    step="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {formatPrice(settings.maxAmount)}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Expiry & Rules */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Expiry & Rules</h3>
            </div>

            <div className="space-y-4">
              {/* Expiry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Gift Card Expiry
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={settings.expiryMonths === null}
                      onChange={() => setSettings({ ...settings, expiryMonths: null })}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Never expires</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={settings.expiryMonths !== null}
                      onChange={() => setSettings({ ...settings, expiryMonths: 12 })}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      Expires after
                      {settings.expiryMonths !== null && (
                        <Input
                          type="number"
                          value={settings.expiryMonths}
                          onChange={(e) => setSettings({ ...settings, expiryMonths: parseFloat(e.target.value) })}
                          className="w-20"
                          min="1"
                          max="60"
                        />
                      )}
                      months
                    </span>
                  </label>
                </div>
              </div>

              {/* Usage Rules */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowPartialUse}
                    onChange={(e) => setSettings({ ...settings, allowPartialUse: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Allow Partial Use</div>
                    <div className="text-xs text-gray-600">
                      Customer can use gift card balance across multiple bookings
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowMultipleServices}
                    onChange={(e) => setSettings({ ...settings, allowMultipleServices: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Allow Multiple Services</div>
                    <div className="text-xs text-gray-600">
                      Gift card can be used for different services
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireMinimumPurchase}
                    onChange={(e) => setSettings({ ...settings, requireMinimumPurchase: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Require Minimum Purchase</div>
                    <div className="text-xs text-gray-600">
                      Set minimum booking amount to use gift card
                    </div>
                    {settings.requireMinimumPurchase && (
                      <Input
                        type="number"
                        value={settings.minimumPurchaseAmount || 0}
                        onChange={(e) => setSettings({ ...settings, minimumPurchaseAmount: parseFloat(e.target.value) })}
                        className="w-32 mt-2"
                        placeholder="Min amount"
                        min="0"
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>
          </Card>

          {/* Email & Notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Email & Notifications</h3>
            </div>

            <div className="space-y-4">
              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Message
                </label>
                <textarea
                  value={settings.customMessage}
                  onChange={(e) => setSettings({ ...settings, customMessage: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                  placeholder="Enter a custom message for gift card emails..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {settings.customMessage.length}/500 characters
                </p>
              </div>

              {/* Email Options */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sendToRecipient}
                    onChange={(e) => setSettings({ ...settings, sendToRecipient: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Send to Recipient</div>
                    <div className="text-xs text-gray-600">
                      Email the gift card to the recipient automatically
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sendConfirmationToPurchaser}
                    onChange={(e) => setSettings({ ...settings, sendConfirmationToPurchaser: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Send Confirmation to Purchaser</div>
                    <div className="text-xs text-gray-600">
                      Email purchase confirmation to the buyer
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifyOwnerOnUse}
                    onChange={(e) => setSettings({ ...settings, notifyOwnerOnUse: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Notify Owner on Use</div>
                    <div className="text-xs text-gray-600">
                      Get notified when a gift card is redeemed
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Preview */}
      {settings.enabled && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-sm text-gray-600 mb-2">Available amounts:</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {settings.presetAmounts.map((amount) => (
                <div
                  key={amount}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
                >
                  {formatPrice(amount)}
                </div>
              ))}
              {settings.allowCustomAmounts && (
                <div className="px-4 py-2 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg font-semibold">
                  Custom Amount
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {settings.expiryMonths === null
                ? '✨ Never expires'
                : `⏰ Expires after ${settings.expiryMonths} months`}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
