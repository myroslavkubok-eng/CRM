import { useState } from 'react';
import { X, Gift, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface GiftCardInfo {
  code: string;
  balance: number;
  isValid: boolean;
  expiryDate?: string;
}

interface RedeemGiftCardModalProps {
  totalAmount: number;
  onApply: (code: string, discountAmount: number) => void;
  onClose: () => void;
}

export function RedeemGiftCardModal({ totalAmount, onApply, onClose }: RedeemGiftCardModalProps) {
  const { formatPrice } = useCurrency();
  const [giftCardCode, setGiftCardCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validatedCard, setValidatedCard] = useState<GiftCardInfo | null>(null);
  const [error, setError] = useState('');

  const handleValidateCode = async () => {
    if (!giftCardCode.trim()) {
      setError('Please enter a gift card code');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // TODO: Replace with actual API call to backend
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation - replace with real API call
      const mockGiftCards: Record<string, GiftCardInfo> = {
        'GIFT-2024-ABC123': { code: 'GIFT-2024-ABC123', balance: 500, isValid: true, expiryDate: '2025-12-31' },
        'GIFT-2024-XYZ789': { code: 'GIFT-2024-XYZ789', balance: 150, isValid: true },
        'GIFT-2024-DEF456': { code: 'GIFT-2024-DEF456', balance: 0, isValid: false },
        'EXPIRED-CARD': { code: 'EXPIRED-CARD', balance: 200, isValid: false }
      };

      const card = mockGiftCards[giftCardCode.toUpperCase()];

      if (!card) {
        setError('Invalid gift card code. Please check and try again.');
      } else if (!card.isValid) {
        setError('This gift card is not valid or has been fully redeemed.');
      } else if (card.balance === 0) {
        setError('This gift card has no remaining balance.');
      } else {
        setValidatedCard(card);
        toast.success('Gift card validated successfully! ✅');
      }
    } catch (err) {
      setError('Failed to validate gift card. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleApplyGiftCard = () => {
    if (!validatedCard) return;

    const discountAmount = Math.min(validatedCard.balance, totalAmount);
    onApply(validatedCard.code, discountAmount);
    toast.success(`${formatPrice(discountAmount)} applied from gift card!`);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isValidating && !validatedCard) {
      handleValidateCode();
    }
  };

  const remainingAfterUse = validatedCard 
    ? Math.max(0, validatedCard.balance - totalAmount)
    : 0;

  const appliedAmount = validatedCard 
    ? Math.min(validatedCard.balance, totalAmount)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Apply Gift Card</h2>
              <p className="text-sm text-gray-600">Enter your gift card code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Order Total</span>
              <span className="font-bold text-xl text-gray-900">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          {/* Gift Card Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gift Card Code
            </label>
            <div className="flex gap-2">
              <Input
                value={giftCardCode}
                onChange={(e) => {
                  setGiftCardCode(e.target.value.toUpperCase());
                  setError('');
                  setValidatedCard(null);
                }}
                onKeyPress={handleKeyPress}
                placeholder="GIFT-2024-XXXXXX"
                className="font-mono flex-1"
                disabled={isValidating || !!validatedCard}
              />
              {!validatedCard && (
                <Button
                  onClick={handleValidateCode}
                  disabled={isValidating || !giftCardCode.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'Validate'
                  )}
                </Button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success - Validated Card */}
            {validatedCard && (
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-green-800 font-medium">Gift Card Validated ✓</p>
                    <p className="text-sm text-green-700">Code: {validatedCard.code}</p>
                  </div>
                  <button
                    onClick={() => {
                      setValidatedCard(null);
                      setGiftCardCode('');
                    }}
                    className="text-green-600 hover:text-green-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Details */}
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm opacity-90">Gift Card Balance</div>
                      <div className="text-2xl font-bold">{formatPrice(validatedCard.balance)}</div>
                    </div>
                    <Gift className="w-10 h-10 opacity-80" />
                  </div>
                  {validatedCard.expiryDate && (
                    <div className="text-xs opacity-90">
                      Valid until: {new Date(validatedCard.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Breakdown */}
                <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order Total</span>
                    <span className="text-gray-900">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">Gift Card Applied</span>
                    <span className="text-green-600 font-semibold">-{formatPrice(appliedAmount)}</span>
                  </div>
                  <div className="border-t border-purple-200 pt-2 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Amount to Pay</span>
                    <span className="font-bold text-xl text-purple-600">
                      {formatPrice(Math.max(0, totalAmount - appliedAmount))}
                    </span>
                  </div>
                  {remainingAfterUse > 0 && (
                    <div className="pt-2 border-t border-purple-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Gift Card Remaining</span>
                        <span className="text-purple-600 font-semibold">{formatPrice(remainingAfterUse)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This amount will remain on your gift card for future use
                      </p>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> If your gift card balance is higher than the order total, the remaining balance will stay on your card for future use.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* How to Find Code */}
          {!validatedCard && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Where to find your code?</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                  <span>Check your email for the gift card confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                  <span>The code format is: GIFT-YEAR-XXXXXX</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                  <span>Gift cards are case-insensitive</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50 rounded-b-xl">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {validatedCard && (
            <Button
              onClick={handleApplyGiftCard}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Gift Card
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
