import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';
import { 
  PaymentOption, 
  SalonDepositSettings,
  generatePaymentOptions,
  calculateDeposit 
} from '../types/depositSystem';
import { StripePaymentModal } from './StripePaymentModal';

interface BookingPaymentOptionsProps {
  salonId: string;
  totalAmount: number;
  depositSettings: SalonDepositSettings;
  isNewClient?: boolean;
  onPaymentOptionSelected: (option: PaymentOption) => void;
  onPaymentSuccess?: () => void;
}

export function BookingPaymentOptions({
  salonId,
  totalAmount,
  depositSettings,
  isNewClient = false,
  onPaymentOptionSelected,
  onPaymentSuccess,
}: BookingPaymentOptionsProps) {
  const { formatPrice } = useCurrency();
  
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<PaymentOption | null>(null);
  const [showStripeModal, setShowStripeModal] = useState(false);

  useEffect(() => {
    // Generate payment options based on settings
    const options = generatePaymentOptions(totalAmount, depositSettings, isNewClient);
    setPaymentOptions(options);
    
    // Auto-select recommended option
    const recommended = options.find(o => o.recommended && o.enabled);
    if (recommended) {
      setSelectedOption(recommended);
      onPaymentOptionSelected(recommended);
    }
  }, [totalAmount, depositSettings, isNewClient]);

  const handleOptionSelect = (option: PaymentOption) => {
    if (!option.enabled) return;
    
    setSelectedOption(option);
    onPaymentOptionSelected(option);
  };

  const handleProceedToPayment = () => {
    if (!selectedOption) return;
    
    if (selectedOption.id === 'in-salon') {
      // No payment needed now
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } else {
      // Show Stripe payment modal
      setShowStripeModal(true);
    }
  };

  const getOptionIcon = (option: PaymentOption) => {
    switch (option.id) {
      case 'deposit':
        return '💳';
      case 'in-salon':
        return '🏪';
      case 'full':
        return '✅';
      default:
        return '💰';
    }
  };

  const depositAmount = calculateDeposit(totalAmount, depositSettings);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Payment Option</h3>
        <p className="text-sm text-gray-600">
          Select how you'd like to pay for this booking
        </p>
      </div>

      {/* Deposit Info (if enabled) */}
      {depositSettings.depositEnabled && depositAmount > 0 && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-purple-900 mb-1">
                Why a deposit?
              </h4>
              <p className="text-sm text-purple-800">
                {depositSettings.customMessage || 
                  'This salon requires a deposit to secure your booking. This helps prevent no-shows and ensures your appointment is confirmed.'
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Options */}
      <div className="space-y-3">
        {paymentOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option)}
            disabled={!option.enabled}
            className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
              selectedOption?.id === option.id && option.enabled
                ? 'border-purple-600 bg-purple-50 shadow-lg'
                : option.enabled
                ? 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="text-3xl">{getOptionIcon(option)}</div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900">{option.label}</h4>
                  {option.recommended && option.enabled && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      ✨ Recommended
                    </span>
                  )}
                  {!option.enabled && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                      Not Available
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {option.description}
                </p>

                {/* Amount Breakdown */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pay now:</span>
                    <span className="font-bold text-purple-600">
                      {formatPrice(option.amount)}
                    </span>
                  </div>
                  {option.remainingAmount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Pay at salon:</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(option.remainingAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-gray-900">
                      {formatPrice(option.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Disabled Reason */}
                {!option.enabled && option.disabledReason && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                    ⚠️ {option.disabledReason}
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {selectedOption?.id === option.id && option.enabled && (
                <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Cancellation Policy */}
      {depositSettings.cancellationPolicy.enabled && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Cancellation Policy
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>
                Cancel {depositSettings.cancellationPolicy.fullRefundHours}+ hours before: 
                <strong> Full refund</strong>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">⚠</span>
              <span>
                Cancel {depositSettings.cancellationPolicy.partialRefundHours}+ hours before: 
                <strong> {depositSettings.cancellationPolicy.partialRefundPercent}% refund</strong>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 font-bold">✗</span>
              <span>
                No-show or late cancellation: 
                <strong> {depositSettings.cancellationPolicy.noShowRefund ? 'Refund available' : 'No refund'}</strong>
              </span>
            </div>
            {depositSettings.cancellationPolicy.allowReschedule && (
              <div className="flex items-start gap-2 mt-2 pt-2 border-t border-blue-300">
                <span className="text-blue-600 font-bold">↻</span>
                <span>
                  You can reschedule up to {depositSettings.cancellationPolicy.rescheduleLimit} times 
                  (at least {depositSettings.cancellationPolicy.rescheduleHours}h before)
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Proceed Button */}
      <Button
        onClick={handleProceedToPayment}
        disabled={!selectedOption || !selectedOption.enabled}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold"
      >
        {!selectedOption ? (
          'Select Payment Option'
        ) : selectedOption.id === 'in-salon' ? (
          'Confirm Booking (Pay at Salon)'
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay {formatPrice(selectedOption.amount)} Now
          </>
        )}
      </Button>

      {/* Summary */}
      {selectedOption && (
        <div className="text-center text-sm text-gray-600">
          {selectedOption.id === 'deposit' && (
            <p>
              You'll pay <strong>{formatPrice(selectedOption.amount)}</strong> now as a deposit,
              and <strong>{formatPrice(selectedOption.remainingAmount)}</strong> at the salon.
            </p>
          )}
          {selectedOption.id === 'in-salon' && (
            <p>
              No payment required now. Pay <strong>{formatPrice(totalAmount)}</strong> when you visit the salon.
            </p>
          )}
          {selectedOption.id === 'full' && (
            <p>
              You'll pay the full amount of <strong>{formatPrice(totalAmount)}</strong> now.
              No payment needed at the salon.
            </p>
          )}
        </div>
      )}

      {/* Stripe Payment Modal */}
      {showStripeModal && selectedOption && (
        <StripePaymentModal
          isOpen={showStripeModal}
          onClose={() => setShowStripeModal(false)}
          amount={selectedOption.amount}
          currency="AED"
          description={`${selectedOption.label} - Booking`}
          onSuccess={() => {
            setShowStripeModal(false);
            if (onPaymentSuccess) {
              onPaymentSuccess();
            }
          }}
        />
      )}
    </div>
  );
}
