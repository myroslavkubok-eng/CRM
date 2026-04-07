import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Calendar, DollarSign, CheckCircle2, ArrowRight, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { useCurrency } from '../../contexts/CurrencyContext';
import { StripePaymentModal } from './StripePaymentModal';
import { toast } from 'sonner';

interface UpgradeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: {
    id: string;
    name: string;
    price: number;
    billingPeriod: 'monthly' | 'semi-annual' | 'annual';
    startDate: string; // ISO date string
  };
  newPlan: {
    id: string;
    name: string;
    price: number;
    billingPeriod: 'monthly' | 'semi-annual' | 'annual';
  };
  basePrices: {
    basic: number;
    standard: number;
    business: number;
  };
}

export function UpgradeCalculatorModal({
  isOpen,
  onClose,
  currentPlan,
  newPlan,
  basePrices
}: UpgradeCalculatorModalProps) {
  const { formatPrice } = useCurrency();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [calculationDetails, setCalculationDetails] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      calculateProration();
    }
  }, [isOpen, currentPlan, newPlan]);

  const calculateProration = () => {
    const now = new Date();
    const startDate = new Date(currentPlan.startDate);
    
    // Calculate total period in days
    const periodDays = currentPlan.billingPeriod === 'monthly' ? 30 : 
                       currentPlan.billingPeriod === 'semi-annual' ? 180 : 365;
    
    // Calculate days elapsed and remaining
    const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, periodDays - daysElapsed);
    
    // Calculate remaining value of current plan
    const currentPlanRemainingValue = (currentPlan.price * daysRemaining) / periodDays;
    
    // Calculate cost of new plan for remaining period
    const newPlanTotalPrice = newPlan.price;
    const newPlanDays = newPlan.billingPeriod === 'monthly' ? 30 : 
                        newPlan.billingPeriod === 'semi-annual' ? 180 : 365;
    const newPlanCostForRemainingPeriod = (newPlanTotalPrice * daysRemaining) / newPlanDays;
    
    // Calculate the difference
    const isUpgrade = newPlanCostForRemainingPeriod > currentPlanRemainingValue;
    const difference = Math.abs(newPlanCostForRemainingPeriod - currentPlanRemainingValue);
    
    // For downgrades, calculate extended days
    let extendedDays = 0;
    if (!isUpgrade && difference > 0) {
      const newPlanDailyRate = newPlanTotalPrice / newPlanDays;
      extendedDays = Math.floor(difference / newPlanDailyRate);
    }

    setCalculationDetails({
      isUpgrade,
      daysElapsed,
      daysRemaining,
      periodDays,
      currentPlanRemainingValue,
      newPlanCostForRemainingPeriod,
      difference,
      extendedDays,
      effectiveDate: now.toLocaleDateString(),
      newExpiryDate: isUpgrade 
        ? new Date(now.getTime() + daysRemaining * 24 * 60 * 60 * 1000).toLocaleDateString()
        : new Date(now.getTime() + (daysRemaining + extendedDays) * 24 * 60 * 60 * 1000).toLocaleDateString()
    });
  };

  if (!isOpen || !calculationDetails) return null;

  const { isUpgrade, daysElapsed, daysRemaining, periodDays, currentPlanRemainingValue, 
          newPlanCostForRemainingPeriod, difference, extendedDays, effectiveDate, newExpiryDate } = calculationDetails;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className={`p-6 border-b ${isUpgrade ? 'bg-gradient-to-r from-blue-50 to-cyan-50' : 'bg-gradient-to-r from-purple-50 to-pink-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isUpgrade ? (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-purple-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isUpgrade ? 'Plan Upgrade' : 'Plan Downgrade'} Calculator
                  </h2>
                  <p className="text-sm text-gray-600">
                    Detailed proration breakdown
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Plan Change Overview */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Current Plan</p>
                <p className="font-bold text-gray-900">{currentPlan.name}</p>
                <p className="text-sm text-gray-600">
                  {currentPlan.billingPeriod === 'monthly' ? 'Monthly' : 
                   currentPlan.billingPeriod === 'semi-annual' ? '6 Months' : 'Annual'}
                </p>
              </div>
              <ArrowRight className={`w-6 h-6 ${isUpgrade ? 'text-blue-600' : 'text-purple-600'}`} />
              <div className="flex-1 text-right">
                <p className="text-xs text-gray-500 mb-1">New Plan</p>
                <p className="font-bold text-gray-900">{newPlan.name}</p>
                <p className="text-sm text-gray-600">
                  {newPlan.billingPeriod === 'monthly' ? 'Monthly' : 
                   newPlan.billingPeriod === 'semi-annual' ? '6 Months' : 'Annual'}
                </p>
              </div>
            </div>

            {/* Time Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Time Breakdown</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Total Period</p>
                  <p className="text-2xl font-bold text-blue-900">{periodDays}</p>
                  <p className="text-xs text-blue-600">days</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-600 mb-1">Used</p>
                  <p className="text-2xl font-bold text-orange-900">{daysElapsed}</p>
                  <p className="text-xs text-orange-600">days</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 mb-1">Remaining</p>
                  <p className="text-2xl font-bold text-green-900">{daysRemaining}</p>
                  <p className="text-xs text-green-600">days</p>
                </div>
              </div>
            </div>

            {/* Financial Calculation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Financial Calculation</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Original {currentPlan.name} price:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(currentPlan.price)}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Days used ({daysElapsed}/{periodDays}):</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(currentPlan.price - currentPlanRemainingValue)}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-green-700 font-medium">Remaining value:</span>
                  <span className="font-bold text-green-900">{formatPrice(currentPlanRemainingValue)}</span>
                </div>
                
                <div className="h-px bg-gray-200 my-4"></div>
                
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">New {newPlan.name} full price:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(newPlan.price)}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Cost for {daysRemaining} days:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(newPlanCostForRemainingPeriod)}</span>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className={`p-6 rounded-xl border-2 ${
              isUpgrade 
                ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200' 
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isUpgrade ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  {isUpgrade ? (
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  {isUpgrade ? (
                    <>
                      <h3 className="text-lg font-bold text-blue-900 mb-2">
                        Payment Required
                      </h3>
                      <p className="text-sm text-blue-800 mb-4">
                        You'll be charged the difference for the remaining {daysRemaining} days of your current billing period.
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-900">
                          {formatPrice(difference)}
                        </span>
                        <span className="text-sm text-blue-600">due now</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        Your plan will upgrade immediately after payment
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-purple-900 mb-2">
                        Credit Applied
                      </h3>
                      <p className="text-sm text-purple-800 mb-4">
                        Your remaining credit of <strong>{formatPrice(difference)}</strong> will extend your new {newPlan.name} plan.
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-purple-900">
                          +{extendedDays}
                        </span>
                        <span className="text-sm text-purple-600">extra days</span>
                      </div>
                      <p className="text-xs text-purple-600 mt-2">
                        Total: {daysRemaining + extendedDays} days of {newPlan.name}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Effective Date:</span>
                <span className="font-semibold text-gray-900">{effectiveDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Expiry Date:</span>
                <span className="font-semibold text-gray-900">{newExpiryDate}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-900">
                  {isUpgrade ? 'Amount to Pay:' : 'No Payment Required:'}
                </span>
                <span className={`font-bold text-lg ${isUpgrade ? 'text-blue-600' : 'text-green-600'}`}>
                  {isUpgrade ? formatPrice(difference) : formatPrice(0)}
                </span>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 text-sm mb-1">
                    100% Fair & Transparent
                  </p>
                  <p className="text-xs text-green-700">
                    All calculations are prorated to the day. {isUpgrade ? 'You only pay for what you use.' : 'You never lose money - all credits are applied to your new plan.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t bg-gray-50 flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (isUpgrade) {
                  // DEMO MODE - simulate successful upgrade
                  toast.success(`✅ DEMO: Upgrade to ${newPlan.name} simulated successfully!`);
                  console.log('DEMO: Would charge', formatPrice(difference));
                  setTimeout(() => {
                    onClose();
                  }, 1500);
                } else {
                  // For downgrades, apply immediately (no payment needed)
                  toast.success(`✅ Downgrade to ${newPlan.name} applied successfully!`);
                  console.log('Applying downgrade with', extendedDays, 'extra days');
                  setTimeout(() => {
                    onClose();
                  }, 1500);
                }
              }}
              className={`flex-1 ${
                isUpgrade
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              } text-white`}
            >
              {isUpgrade ? `DEMO: Upgrade for ${formatPrice(difference)}` : 'Confirm Downgrade'}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal for Upgrades */}
      {isUpgrade && (
        <StripePaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          planName={`Upgrade to ${newPlan.name}`}
          price={difference.toFixed(2)}
          currency="aed"
          onPaymentSuccess={() => {
            setIsPaymentOpen(false);
            onClose();
            // TODO: Refresh subscription data
            console.log('Upgrade successful!');
          }}
          type="upgrade"
        />
      )}
    </>
  );
}