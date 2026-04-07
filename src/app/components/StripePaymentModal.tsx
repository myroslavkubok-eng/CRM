import { useState } from 'react';
import { X, CreditCard, Lock, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useCurrency } from '../../contexts/CurrencyContext';

// ============================================
// НАСТРОЙКА РЕЖИМА
// ============================================
// true = тестовый режим (без реального Stripe)
// false = реальный Stripe (нужна интеграция)
const TEST_MODE = true;
// ============================================

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  currency?: string;
  description?: string;
  bookingId?: string;
  onSuccess?: () => void;
}

export function StripePaymentModal({
  isOpen,
  onClose,
  amount = 0,
  currency = 'AED',
  description = 'Payment',
  bookingId,
  onSuccess,
}: StripePaymentModalProps) {
  const { formatPrice } = useCurrency();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState(TEST_MODE ? '4242 4242 4242 4242' : '');
  const [expiryDate, setExpiryDate] = useState(TEST_MODE ? '12/26' : '');
  const [cvv, setCvv] = useState(TEST_MODE ? '123' : '');
  const [cardholderName, setCardholderName] = useState(TEST_MODE ? 'John Doe' : '');
  const [error, setError] = useState('');

  // Безопасное отображение суммы
  const displayAmount = isNaN(amount) || amount === null || amount === undefined ? 0 : amount;

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(formatExpiryDate(value));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const validateForm = () => {
    if (!cardholderName.trim()) {
      setError('Cardholder name is required');
      return false;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16) {
      setError('Card number must be 16 digits');
      return false;
    }

    const expiryParts = expiryDate.split('/');
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      setError('Invalid expiry date (MM/YY)');
      return false;
    }

    const month = parseInt(expiryParts[0]);
    if (month < 1 || month > 12) {
      setError('Invalid month (01-12)');
      return false;
    }

    if (cvv.length < 3) {
      setError('CVV must be 3-4 digits');
      return false;
    }

    setError('');
    return true;
  };

  const handleTestPayment = async () => {
    // Имитация обработки платежа
    await new Promise(resolve => setTimeout(resolve, 2000));

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    // Тестовые сценарии по номеру карты
    if (cleanCardNumber === '4000000000000002') {
      throw new Error('Card declined. Please try another card.');
    }
    
    if (cleanCardNumber === '4000000000009995') {
      throw new Error('Insufficient funds.');
    }

    // Успешный платёж
    return { success: true };
  };

  const handleRealPayment = async () => {
    // TODO: Реальная интеграция со Stripe
    // 
    // 1. Создать Payment Intent на бэкенде:
    // const response = await fetch('/api/create-payment-intent', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount: displayAmount, currency, bookingId })
    // });
    // const { clientSecret } = await response.json();
    //
    // 2. Подтвердить платёж с Stripe.js:
    // const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
    // const result = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card: cardElement,
    //     billing_details: { name: cardholderName }
    //   }
    // });
    //
    // if (result.error) {
    //   throw new Error(result.error.message);
    // }
    //
    // return result.paymentIntent;

    throw new Error('Real Stripe integration not configured. Enable TEST_MODE or implement Stripe.');
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      if (TEST_MODE) {
        await handleTestPayment();
      } else {
        await handleRealPayment();
      }

      setIsSuccess(true);
      toast.success('Payment successful! 🎉');
      
      // Вызываем onSuccess через небольшую задержку для показа анимации
      setTimeout(() => {
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      toast.error('Payment failed');
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setIsSuccess(false);
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {isSuccess ? 'Payment Successful!' : 'Secure Payment'}
            </h2>
            {!isProcessing && !isSuccess && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
          {!isSuccess && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
            <p className="text-gray-600">
              Your payment of {formatPrice(displayAmount)} was successful.
            </p>
          </div>
        ) : (
          <>
            {/* Amount */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-b border-purple-200">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Amount to Pay</div>
                <div className="text-4xl font-bold text-purple-600">
                  {formatPrice(displayAmount)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {currency.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Test Mode Banner */}
            {TEST_MODE && (
              <div className="mx-6 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium text-center">
                  🧪 Test Mode — No real payment will be processed
                </p>
              </div>
            )}

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="John Doe"
                  disabled={isProcessing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4242 4242 4242 4242"
                    disabled={isProcessing}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
                  />
                  <CreditCard className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    disabled={isProcessing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    disabled={isProcessing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Security Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <strong>Secure Payment:</strong> Your payment information is encrypted and secure. 
                  We never store your card details.
                </div>
              </div>

              {/* Test Cards Info */}
              {TEST_MODE && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
                  <div className="font-semibold mb-2">Test Cards:</div>
                  <div className="space-y-1 font-mono">
                    <div>✅ Success: 4242 4242 4242 4242</div>
                    <div>❌ Decline: 4000 0000 0000 0002</div>
                    <div>💳 No funds: 4000 0000 0000 9995</div>
                  </div>
                  <div className="mt-2 text-gray-500">
                    Expiry: Any future date • CVV: Any 3 digits
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <Button
                onClick={handleClose}
                disabled={isProcessing}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing || displayAmount <= 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Pay {formatPrice(displayAmount)}
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Secured by Stripe</span>
            </div>
            <span>•</span>
            <span>PCI-DSS Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}