import { useState } from 'react';
import { X, Gift, Mail, User, MessageSquare, CreditCard, Check, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';
import { StripePaymentModal } from './StripePaymentModal';
import { GiftCardPreview } from './GiftCardPreview';
import { GiftCardTheme, GIFT_CARD_THEMES, SalonGiftCardBranding } from '../types/giftCardTemplates';

interface BuyGiftCardModalProps {
  salonId: string;
  salonName: string;
  onClose: () => void;
}

export function BuyGiftCardModal({ salonId, salonName, onClose }: BuyGiftCardModalProps) {
  const { formatPrice } = useCurrency();
  const [showPayment, setShowPayment] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  
  // Form state
  const [selectedTheme, setSelectedTheme] = useState<GiftCardTheme>('just-because');
  const [amount, setAmount] = useState('');
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [purchaserPhone, setPurchaserPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sendNow, setSendNow] = useState(true);
  const [generatedCode, setGeneratedCode] = useState('');

  const predefinedAmounts = [100, 200, 300, 500, 1000];
  
  // Mock salon branding (в реале загружается с backend)
  const salonBranding: SalonGiftCardBranding = {
    salonId,
    logoPosition: 'top-left',
    defaultTheme: 'just-because',
    allowCustomThemes: true,
  };

  const isFormValid = amount && parseFloat(amount) >= 10 && purchaserName && purchaserEmail && purchaserPhone;

  const handleProceedToPayment = () => {
    if (!isFormValid) {
      toast.error('Please fill in all required fields');
      return;
    }
    setShowPayment(true);
    // Scroll to payment section
    setTimeout(() => {
      document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePaymentSuccess = () => {
    // Generate unique gift card code
    const code = `GIFT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setGeneratedCode(code);
    
    // TODO: Save to backend
    console.log('Gift card purchased:', {
      salonId,
      code,
      amount: parseFloat(amount),
      purchaserName,
      purchaserEmail,
      purchaserPhone,
      recipientName: recipientName || undefined,
      recipientEmail: recipientEmail || undefined,
      message: message || undefined,
      sendNow
    });

    setIsPurchased(true);
    toast.success('Gift card purchased successfully! 🎉');
    
    // Scroll to success section
    setTimeout(() => {
      document.getElementById('success-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              {isPurchased ? '✅ Complete' : '🎁 Buy Gift Card'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">{salonName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-8">
          {!isPurchased ? (
            <>
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto pb-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center text-xs sm:text-sm font-semibold">
                    1
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 hidden sm:inline">Theme</span>
                </div>
                <div className="w-6 sm:w-12 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600" />
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                    amount ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${amount ? 'text-gray-900' : 'text-gray-600'} hidden sm:inline`}>Amount</span>
                </div>
                <div className={`w-6 sm:w-12 h-0.5 ${amount ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-200'}`} />
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                    isFormValid ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${isFormValid ? 'text-gray-900' : 'text-gray-600'} hidden sm:inline`}>Details</span>
                </div>
                <div className={`w-6 sm:w-12 h-0.5 ${isFormValid ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-200'}`} />
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                    showPayment ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    4
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${showPayment ? 'text-gray-900' : 'text-gray-600'} hidden sm:inline`}>Payment</span>
                </div>
              </div>

              {/* 1. Theme Selection */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-6 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">1. Select Theme</h3>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                  {Object.entries(GIFT_CARD_THEMES).map(([themeKey, themeData]) => (
                    <button
                      key={themeKey}
                      onClick={() => setSelectedTheme(themeKey as GiftCardTheme)}
                      className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                        selectedTheme === themeKey
                          ? 'border-purple-600 bg-white shadow-lg scale-105'
                          : 'border-white bg-white/50 hover:border-purple-300 hover:shadow-md hover:scale-102'
                      }`}
                    >
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{themeData.emoji}</div>
                      <div className="text-[10px] sm:text-xs font-semibold text-gray-900 leading-tight">{themeData.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Amount Selection */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-6 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">2. Amount *</h3>
                </div>
                <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt.toString())}
                      className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                        amount === amt.toString()
                          ? 'border-green-600 bg-white shadow-lg scale-105'
                          : 'border-white bg-white/50 hover:border-green-300 hover:shadow-md'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-lg text-gray-900">{formatPrice(amt)}</div>
                    </button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Or custom amount..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white text-sm sm:text-base"
                  min="10"
                />
                {amount && parseFloat(amount) < 10 && (
                  <p className="text-xs text-red-600 mt-2">⚠️ Minimum {formatPrice(10)}</p>
                )}
              </div>

              {/* 3. Your Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-6 border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">3. Your Info</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={purchaserName}
                      onChange={(e) => setPurchaserName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-white text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Phone *
                    </label>
                    <Input
                      type="tel"
                      value={purchaserPhone}
                      onChange={(e) => setPurchaserPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="bg-white text-sm sm:text-base"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={purchaserEmail}
                      onChange={(e) => setPurchaserEmail(e.target.value)}
                      placeholder="john@email.com"
                      className="bg-white text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      📧 Gift card sent to this email
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Recipient Information */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg sm:rounded-xl p-3 sm:p-6 border-2 border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">4. Recipient (Optional)</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  💝 Send to someone special or yourself
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Recipient Name
                    </label>
                    <Input
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Jane Smith"
                      className="bg-white text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Recipient Email <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <Input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="jane@email.com (optional)"
                      className="bg-white text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                      💡 Leave empty to share manually after purchase
                    </p>
                  </div>
                </div>

                {recipientEmail && (
                  <div className="mt-3 sm:mt-4">
                    <label className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg cursor-pointer border-2 border-pink-300 hover:border-pink-400 transition-colors">
                      <input
                        type="checkbox"
                        checked={sendNow}
                        onChange={(e) => setSendNow(e.target.checked)}
                        className="w-4 h-4 text-pink-600"
                      />
                      <div className="flex-1">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">✉️ Send immediately</div>
                        <div className="text-xs text-gray-600">
                          Gift card will be sent via email after purchase
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* 5. Gift Message */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-6 border-2 border-amber-200">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">5. Message (Optional)</h3>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Happy Birthday! 🎉"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-amber-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white min-h-[80px] sm:min-h-[100px]"
                  maxLength={200}
                />
                <p className="text-xs text-gray-600 mt-2">💬 {message.length}/200</p>
              </div>

              {/* 6. Preview */}
              {amount && parseFloat(amount) >= 10 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-6 border-2 border-purple-200">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    6. Preview Your Gift Card
                  </h3>
                  <div className="max-w-sm sm:max-w-none mx-auto">
                    <GiftCardPreview
                      salonName={salonName}
                      amount={parseFloat(amount)}
                      purchaserName={purchaserName}
                      recipientName={recipientName}
                      message={message}
                      theme={selectedTheme}
                      salonBranding={salonBranding}
                    />
                  </div>
                </div>
              )}

              {/* 7. Payment Section */}
              <div id="payment-section" className={`rounded-xl p-6 border-2 transition-all ${
                showPayment 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className={`w-5 h-5 ${showPayment ? 'text-green-600' : 'text-gray-400'}`} />
                  <h3 className={`font-semibold ${showPayment ? 'text-gray-900' : 'text-gray-500'}`}>
                    7. Payment
                  </h3>
                </div>

                {!showPayment ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Complete all required fields to proceed to payment</p>
                    <Button
                      onClick={handleProceedToPayment}
                      disabled={!isFormValid}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      Proceed to Payment
                      <CreditCard className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                      <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Gift Card Amount</span>
                          <span className="font-semibold text-gray-900">{formatPrice(parseFloat(amount))}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <span className="font-semibold text-gray-900">Total</span>
                          <span className="font-bold text-xl text-green-600">{formatPrice(parseFloat(amount))}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stripe Payment */}
                    <StripePaymentModal
                      isOpen={true}
                      onClose={() => setShowPayment(false)}
                      amount={parseFloat(amount)}
                      currency="AED"
                      description={`Gift Card - ${salonName}`}
                      onSuccess={handlePaymentSuccess}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Success Section */
            <div id="success-section" className="text-center py-8 space-y-6">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-10 h-10 text-green-600" />
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Gift Card Purchased! 🎉
                </h3>
                <p className="text-gray-600">
                  Your gift card has been created and sent to your email
                </p>
              </div>

              {/* Gift Card Code */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8 text-white max-w-md mx-auto">
                <div className="mb-4">
                  <div className="text-sm opacity-90 mb-1">{salonName}</div>
                  <div className="text-4xl font-bold mb-2">{formatPrice(parseFloat(amount))}</div>
                  <div className="text-sm opacity-90">Gift Card</div>
                </div>
                
                <div className="bg-white/20 rounded-lg p-4 mb-4">
                  <div className="text-xs opacity-90 mb-1">Gift Card Code</div>
                  <div className="font-mono text-2xl font-bold tracking-wider">{generatedCode}</div>
                </div>

                {message && (
                  <div className="bg-white/20 rounded-lg p-3 mb-4">
                    <p className="text-sm italic">"{message}"</p>
                  </div>
                )}

                <div className="text-sm opacity-90 text-left">
                  <div>From: {purchaserName}</div>
                  {recipientName && <div>To: {recipientName}</div>}
                </div>
              </div>

              {/* Information */}
              <div className="bg-blue-50 rounded-lg p-6 text-left max-w-md mx-auto">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  What's Next?
                </h4>
                <ul className="space-y-3 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      A confirmation email has been sent to <strong>{purchaserEmail}</strong>
                    </span>
                  </li>
                  {recipientEmail && sendNow && (
                    <li className="flex items-start gap-2">
                      <Gift className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        The gift card has been sent to <strong>{recipientEmail}</strong>
                      </span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      The gift card can be used for any service at {salonName}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    toast.success('Gift card code copied!');
                  }}
                  variant="outline"
                  className="gap-2"
                  size="lg"
                >
                  📋 Copy Code
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  size="lg"
                >
                  ✅ Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}