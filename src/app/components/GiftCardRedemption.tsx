import { useState } from 'react';
import { Gift, Check, X, AlertCircle, Loader2, User, DollarSign, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface GiftCardRedemptionProps {
  bookingAmount: number;
  onRedeem: (code: string, amountUsed: number, remainingBalance: number) => void;
  onCancel: () => void;
}

export function GiftCardRedemption({ bookingAmount, onRedeem, onCancel }: GiftCardRedemptionProps) {
  const { formatPrice } = useCurrency();
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validatedCard, setValidatedCard] = useState<any>(null);
  const [error, setError] = useState('');
  const [amountToUse, setAmountToUse] = useState<number>(0);

  const handleValidate = async () => {
    if (!code.trim()) {
      setError('Please enter a gift card code');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/gift-cards/validate`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code: code.toUpperCase() })
      // });
      // const card = await response.json();

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - replace with actual API response
      const mockCards: Record<string, any> = {
        'GIFT-2024-ABC123': {
          code: 'GIFT-2024-ABC123',
          balance: 500,
          isValid: true,
          isUsed: false,
          recipientName: 'Sarah Johnson',
          purchasedBy: 'Emma Watson',
          expiryDate: '2025-12-31',
          usageHistory: []
        },
        'GIFT-2024-XYZ789': {
          code: 'GIFT-2024-XYZ789',
          balance: 150,
          isValid: true,
          isUsed: false,
          recipientName: 'Lisa Davis',
          purchasedBy: 'Michael Brown',
          expiryDate: '2025-12-15',
          usageHistory: []
        }
      };

      const card = mockCards[code.toUpperCase()];

      if (!card) {
        setError('Invalid gift card code. Please check and try again.');
        return;
      }

      if (!card.isValid) {
        setError('This gift card has been cancelled or is no longer valid.');
        return;
      }

      if (card.balance === 0) {
        setError('This gift card has been fully used. No balance remaining.');
        return;
      }

      // Check if already used in this session to prevent double redemption
      if (card.isUsed) {
        setError('This gift card has already been redeemed in this session.');
        return;
      }

      // Calculate how much to use
      const calculatedAmount = Math.min(card.balance, bookingAmount);
      setAmountToUse(calculatedAmount);

      setValidatedCard(card);
      toast.success('Gift card validated successfully! ✅');
    } catch (err) {
      setError('Failed to validate gift card. Please try again.');
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRedeem = async () => {
    if (!validatedCard) return;

    try {
      // TODO: Replace with actual API call to redeem gift card
      // const response = await fetch(`/api/gift-cards/redeem`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     code: validatedCard.code,
      //     amountUsed: amountToUse,
      //     bookingId: bookingId // Pass booking ID
      //   })
      // });
      // const result = await response.json();

      const remainingBalance = validatedCard.balance - amountToUse;
      
      onRedeem(validatedCard.code, amountToUse, remainingBalance);
      toast.success(`${formatPrice(amountToUse)} applied from gift card! 🎉`);
    } catch (err) {
      toast.error('Failed to redeem gift card. Please try again.');
      console.error(err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isValidating && !validatedCard) {
      handleValidate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Redeem Gift Card</h2>
          <p className="text-sm text-gray-600">Enter the gift card code to apply discount</p>
        </div>
      </div>

      {/* Booking Amount */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Booking Amount</span>
          <span className="font-bold text-xl text-gray-900">{formatPrice(bookingAmount)}</span>
        </div>
      </div>

      {/* Code Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gift Card Code
        </label>
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
              setValidatedCard(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder="GIFT-2024-XXXXXX"
            className="flex-1 font-mono"
            disabled={isValidating || !!validatedCard}
          />
          {!validatedCard && (
            <Button
              onClick={handleValidate}
              disabled={isValidating || !code.trim()}
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

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Validated Card Info */}
        {validatedCard && (
          <div className="mt-3 space-y-3">
            {/* Success Message */}
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Gift Card Validated ✓</p>
                <p className="text-sm text-green-700">Code: {validatedCard.code}</p>
              </div>
              <button
                onClick={() => {
                  setValidatedCard(null);
                  setCode('');
                  setAmountToUse(0);
                }}
                className="text-green-600 hover:text-green-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Card Details */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm opacity-90 mb-1">Gift Card Balance</div>
                  <div className="text-3xl font-bold">{formatPrice(validatedCard.balance)}</div>
                </div>
                <Gift className="w-12 h-12 opacity-80" />
              </div>

              <div className="space-y-2 text-sm opacity-90">
                {validatedCard.recipientName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>For: {validatedCard.recipientName}</span>
                  </div>
                )}
                {validatedCard.purchasedBy && (
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    <span>From: {validatedCard.purchasedBy}</span>
                  </div>
                )}
                {validatedCard.expiryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Valid until: {new Date(validatedCard.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amount Calculation */}
            <div className="bg-purple-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Booking Amount</span>
                <span className="text-gray-900">{formatPrice(bookingAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">Gift Card Applied</span>
                <span className="text-green-600 font-semibold">-{formatPrice(amountToUse)}</span>
              </div>
              <div className="border-t border-purple-200 pt-2 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Amount to Charge</span>
                <span className="font-bold text-xl text-purple-600">
                  {formatPrice(Math.max(0, bookingAmount - amountToUse))}
                </span>
              </div>

              {validatedCard.balance > amountToUse && (
                <div className="pt-2 border-t border-purple-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Remaining Gift Card Balance</span>
                    <span className="text-purple-600 font-semibold">
                      {formatPrice(validatedCard.balance - amountToUse)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ℹ️ This balance will remain on the gift card for future use
                  </p>
                </div>
              )}
            </div>

            {/* Warning if fully used */}
            {validatedCard.balance <= amountToUse && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Gift Card Will Be Fully Used</p>
                    <p className="text-sm text-yellow-800">
                      This gift card will be marked as fully redeemed after this transaction.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Anti-fraud notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">One-Time Redemption</p>
                  <p className="text-sm text-blue-800">
                    This gift card code can only be used once per booking. The transaction will be logged to prevent fraud.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How to Find Code */}
      {!validatedCard && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-gray-900 mb-2">Where to find the code?</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <span>Ask the client to show the gift card email or physical card</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <span>The code format is: GIFT-YEAR-XXXXXX</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <span>Gift card codes are case-insensitive</span>
            </li>
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        {validatedCard && (
          <Button
            onClick={handleRedeem}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Gift Card
          </Button>
        )}
      </div>
    </div>
  );
}
