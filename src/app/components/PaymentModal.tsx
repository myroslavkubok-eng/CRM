import { useState } from 'react';
import { X, CreditCard, Smartphone, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

const logo = "/icons/logo.svg";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: string;
  currency: string;
  onPaymentSuccess: () => void;
}

type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'diners' | 'maestro' | 'unknown';

interface CardValidation {
  isValid: boolean;
  cardType: CardType;
  errors: string[];
}

export function PaymentModal({ isOpen, onClose, planName, price, currency, onPaymentSuccess }: PaymentModalProps) {
  const { formatPrice } = useCurrency();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [cardType, setCardType] = useState<CardType>('unknown');
  
  // Format price for display
  const formattedPrice = formatPrice(Number(price));

  if (!isOpen) return null;

  // Luhn Algorithm for card validation
  const luhnCheck = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  // Determine card type based on number
  const detectCardType = (number: string): CardType => {
    const cleaned = number.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    if (/^35/.test(cleaned)) return 'jcb';
    if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'diners';
    if (/^(5018|5020|5038|5893|6304|6759|6761|6762|6763)/.test(cleaned)) return 'maestro';
    
    return 'unknown';
  };

  // Validate card number with Luhn and pattern matching
  const validateCardNumber = (cardNumber: string): CardValidation => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const errors: string[] = [];
    let isValid = true;

    // Check length
    if (cleaned.length < 13 || cleaned.length > 19) {
      errors.push('Card number must be between 13 and 19 digits');
      isValid = false;
    }

    // Check if only digits
    if (!/^\d+$/.test(cleaned)) {
      errors.push('Card number must contain only digits');
      isValid = false;
    }

    // Luhn algorithm check
    if (!luhnCheck(cleaned)) {
      errors.push('Invalid card number (failed Luhn check)');
      isValid = false;
    }

    const detectedType = detectCardType(cleaned);
    
    // Validate based on card type patterns
    const cardPatterns: { [key in CardType]: { regex: RegExp; length: number[] } } = {
      visa: { regex: /^4[0-9]{12}(?:[0-9]{3})?$/, length: [13, 16, 19] },
      mastercard: { regex: /^5[1-5][0-9]{14}$/, length: [16] },
      amex: { regex: /^3[47][0-9]{13}$/, length: [15] },
      discover: { regex: /^6(?:011|5[0-9]{2})[0-9]{12}$/, length: [16] },
      jcb: { regex: /^(?:2131|1800|35\d{3})\d{11}$/, length: [16] },
      diners: { regex: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, length: [14] },
      maestro: { regex: /^(5018|5020|5038|5893|6304|6759|6761|6762|6763)[0-9]{8,15}$/, length: [12, 13, 14, 15, 16, 17, 18, 19] },
      unknown: { regex: /^$/, length: [] },
    };

    if (detectedType !== 'unknown') {
      const pattern = cardPatterns[detectedType];
      if (!pattern.regex.test(cleaned)) {
        errors.push(`Invalid ${detectedType.toUpperCase()} card format`);
        isValid = false;
      }
    }

    return { isValid, cardType: detectedType, errors };
  };

  // Validate expiry date
  const validateExpiryDate = (expiry: string): boolean => {
    const cleaned = expiry.replace(/\D/g, '');
    if (cleaned.length !== 4) return false;

    const month = parseInt(cleaned.slice(0, 2), 10);
    const year = parseInt('20' + cleaned.slice(2, 4), 10);

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  // Validate name matches format (First Last)
  const validateCardholderName = (name: string): boolean => {
    const trimmed = name.trim();
    // Must have at least first and last name
    const nameParts = trimmed.split(/\s+/);
    return nameParts.length >= 2 && nameParts.every(part => part.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset validation errors
    const errors: string[] = [];

    // Validate card number
    const cardValidation = validateCardNumber(cardNumber);
    if (!cardValidation.isValid) {
      errors.push(...cardValidation.errors);
    }

    // Validate expiry date
    if (!validateExpiryDate(expiryDate)) {
      errors.push('Invalid or expired card');
    }

    // Validate CVV
    const cvvLength = cardValidation.cardType === 'amex' ? 4 : 3;
    if (cvv.length !== cvvLength) {
      errors.push(`CVV must be ${cvvLength} digits for ${cardValidation.cardType.toUpperCase()}`);
    }

    // Validate cardholder name
    if (!validateCardholderName(cardName)) {
      errors.push('Please enter full name (First and Last name)');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      errors.forEach(error => toast.error(error));
      return;
    }

    setValidationErrors([]);
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Close after success animation and call onPaymentSuccess
      setTimeout(() => {
        setIsSuccess(false);
        onPaymentSuccess();
      }, 2000);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Welcome to Katia Booking {planName} plan</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Katia Booking" className="w-10 h-10 rounded-xl" />
                <div>
                  <h2 className="font-bold text-gray-900">Complete Payment</h2>
                  <p className="text-sm text-gray-500">{planName} Plan</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Subscription</span>
                <span className="font-semibold text-gray-900">{planName}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Billing Cycle</span>
                <span className="font-semibold text-gray-900">Monthly</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {formattedPrice}
                  </div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                    paymentMethod === 'card' ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <div className="text-xs font-medium text-gray-900">Card</div>
                </button>

                <button
                  onClick={() => setPaymentMethod('apple')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'apple'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className={`w-6 h-6 mx-auto mb-2 ${
                    paymentMethod === 'apple' ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <div className="text-xs font-medium text-gray-900">Apple Pay</div>
                </button>

                <button
                  onClick={() => setPaymentMethod('google')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'google'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className={`w-6 h-6 mx-auto mb-2 ${
                    paymentMethod === 'google' ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <div className="text-xs font-medium text-gray-900">Google Pay</div>
                </button>
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Validation Errors */}
                  {validationErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-red-900 mb-1">Payment Validation Failed</h4>
                          <ul className="text-xs text-red-700 space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value.replace(/\s/g, ''));
                          if (formatted.replace(/\s/g, '').length <= 19) {
                            setCardNumber(formatted);
                            const detected = detectCardType(formatted);
                            setCardType(detected);
                          }
                        }}
                        className="w-full px-4 py-3 pr-16 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                        required
                      />
                      {/* Card Type Badge */}
                      {cardType !== 'unknown' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                          <span className="text-xs font-bold text-purple-700 uppercase">
                            {cardType === 'amex' ? 'AmEx' : cardType}
                          </span>
                        </div>
                      )}
                    </div>
                    {cardNumber && cardType !== 'unknown' && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> {cardType.toUpperCase()} card detected
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          if (formatted.length <= 5) {
                            setExpiryDate(formatted);
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder={cardType === 'amex' ? '1234' : '123'}
                        value={cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          const maxLength = cardType === 'amex' ? 4 : 3;
                          if (value.length <= maxLength) {
                            setCvv(value);
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {cardType === 'amex' ? '4 digits on front' : '3 digits on back'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter full name as shown on card</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Validating & Processing...
                      </div>
                    ) : (
                      `Pay ${formattedPrice}`
                    )}
                  </Button>
                </form>
              )}

              {/* Apple Pay */}
              {paymentMethod === 'apple' && (
                <div className="space-y-4">
                  <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
                    <div className="p-8 text-center">
                      <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">Apple Pay</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Click the button below to complete payment with Apple Pay
                      </p>
                    </div>
                  </Card>

                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full h-12 bg-black hover:bg-gray-900 text-white font-medium"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Pay with Apple Pay
                      </div>
                    )}
                  </Button>
                </div>
              )}

              {/* Google Pay */}
              {paymentMethod === 'google' && (
                <div className="space-y-4">
                  <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
                    <div className="p-8 text-center">
                      <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">Google Pay</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Click the button below to complete payment with Google Pay
                      </p>
                    </div>
                  </Card>

                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 font-medium"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Pay with Google Pay
                      </div>
                    )}
                  </Button>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1l6 2.5v5.5c0 4-2.5 7.5-6 9-3.5-1.5-6-5-6-9V3.5L10 1z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Secure Payment</div>
                    <div className="text-xs">
                      Your payment information is encrypted and secure. We never store your card details.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}