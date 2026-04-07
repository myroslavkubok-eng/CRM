import { useState } from 'react';
import { X, Store, MapPin, Check, Crown, Zap, Rocket, CreditCard, Calendar, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';
import { StripePaymentModal } from './StripePaymentModal';

interface AddSalonModalProps {
  onClose: () => void;
  onAdd: (salonData: any) => void;
}

type Plan = 'starter' | 'professional' | 'business';
type BillingPeriod = 'monthly' | 'semi-annual' | 'annual';

export function AddSalonModal({ onClose, onAdd }: AddSalonModalProps) {
  const { formatPrice, convertFromAED } = useCurrency();
  const [step, setStep] = useState<'details' | 'plan' | 'payment'>('details');
  
  // Salon details
  const [salonName, setSalonName] = useState('');
  const [location, setLocation] = useState('');
  
  // Plan selection
  const [selectedPlan, setSelectedPlan] = useState<Plan>('professional');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('annual');
  
  // Payment
  const [showPayment, setShowPayment] = useState(false);

  // Base prices in AED (monthly)
  const basePrices = {
    starter: 99,
    professional: 299,
    business: 499
  };

  // Discount percentages
  const discounts = {
    monthly: 0,
    'semi-annual': {
      starter: 15,
      professional: 15,
      business: 20
    },
    annual: {
      starter: 20,
      professional: 25,
      business: 30
    }
  };

  const calculatePrice = (plan: Plan, period: BillingPeriod) => {
    const basePrice = basePrices[plan];
    
    if (period === 'monthly') {
      return basePrice;
    }
    
    const months = period === 'semi-annual' ? 6 : 12;
    const discount = discounts[period][plan];
    const totalPrice = basePrice * months * (1 - discount / 100);
    
    return Math.round(totalPrice);
  };

  const getSavings = (plan: Plan, period: BillingPeriod) => {
    if (period === 'monthly') return 0;
    
    const months = period === 'semi-annual' ? 6 : 12;
    const fullPrice = basePrices[plan] * months;
    const discountedPrice = calculatePrice(plan, period);
    
    return fullPrice - discountedPrice;
  };

  const getMonthlyEquivalent = (plan: Plan, period: BillingPeriod) => {
    const totalPrice = calculatePrice(plan, period);
    const months = period === 'monthly' ? 1 : period === 'semi-annual' ? 6 : 12;
    
    return Math.round(totalPrice / months);
  };

  const plans = [
    {
      id: 'starter' as Plan,
      name: 'Starter',
      icon: Zap,
      color: 'from-gray-600 to-gray-700',
      features: [
        'Up to 50 bookings/month',
        '1 staff member',
        'Basic calendar',
        'Email support',
        'Client database',
        'Basic analytics'
      ]
    },
    {
      id: 'professional' as Plan,
      name: 'Professional',
      icon: Rocket,
      color: 'from-blue-600 to-cyan-600',
      popular: true,
      features: [
        'Unlimited bookings',
        'Up to 5 staff members',
        'Advanced calendar',
        'SMS notifications',
        'CRM system',
        'Advanced analytics',
        'Gift cards',
        'Package deals'
      ]
    },
    {
      id: 'business' as Plan,
      name: 'Business',
      icon: Crown,
      color: 'from-purple-600 to-pink-600',
      features: [
        'Everything in Professional',
        'Unlimited staff members',
        'Multi-location support',
        'Priority support',
        'Custom branding',
        'API access',
        'Advanced integrations',
        'Dedicated account manager'
      ]
    }
  ];

  const handleContinueFromDetails = () => {
    if (!salonName || !location) {
      toast.error('Please fill in all fields');
      return;
    }
    setStep('plan');
  };

  const handleContinueFromPlan = () => {
    setStep('payment');
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    const nextBillingDate = new Date();
    if (billingPeriod === 'semi-annual') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 6);
    } else if (billingPeriod === 'annual') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    } else {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }

    onAdd({
      name: salonName,
      location: location,
      plan: selectedPlan,
      billingPeriod: billingPeriod,
      nextBillingDate: nextBillingDate.toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New Salon</h2>
              <p className="text-sm text-gray-600">
                {step === 'details' && 'Enter salon information'}
                {step === 'plan' && 'Choose your subscription plan'}
                {step === 'payment' && 'Complete payment'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'details' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step === 'details' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="font-medium">Details</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === 'plan' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step === 'plan' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="font-medium">Plan</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step === 'payment' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Salon Details */}
          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salon Name *
                </label>
                <Input
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="e.g., Beauty Palace"
                  className="text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Dubai Marina, UAE"
                    className="pl-10 text-lg"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleContinueFromDetails}
                  disabled={!salonName || !location}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12"
                >
                  Continue to Plan Selection
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Plan Selection */}
          {step === 'plan' && (
            <div className="space-y-6">
              {/* Billing Period Selector */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Choose Billing Period</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      billingPeriod === 'monthly'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold text-gray-900">Monthly</div>
                      <div className="text-xs text-gray-600">Pay as you go</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setBillingPeriod('semi-annual')}
                    className={`p-4 rounded-lg border-2 transition-all relative ${
                      billingPeriod === 'semi-annual'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Save 15-20%
                    </div>
                    <div className="text-center">
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <div className="font-semibold text-gray-900">6 Months</div>
                      <div className="text-xs text-gray-600">Best value</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setBillingPeriod('annual')}
                    className={`p-4 rounded-lg border-2 transition-all relative ${
                      billingPeriod === 'annual'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Save 25-30%
                    </div>
                    <div className="text-center">
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-green-600" />
                      <div className="font-semibold text-gray-900">Annual</div>
                      <div className="text-xs text-gray-600">Maximum savings</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Select Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => {
                    const Icon = plan.icon;
                    const price = calculatePrice(plan.id, billingPeriod);
                    const savings = getSavings(plan.id, billingPeriod);
                    const monthlyEquivalent = getMonthlyEquivalent(plan.id, billingPeriod);
                    
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? 'border-purple-600 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${plan.popular ? 'ring-2 ring-purple-200' : ''}`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-4 py-1 rounded-full font-semibold">
                            Most Popular
                          </div>
                        )}

                        <div className="text-center mb-6">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-3`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2">{plan.name}</h3>
                          
                          {billingPeriod === 'monthly' ? (
                            <div>
                              <div className="text-3xl font-bold text-gray-900">
                                {formatPrice(basePrices[plan.id])}
                              </div>
                              <div className="text-sm text-gray-600">/month</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-sm text-gray-500 line-through mb-1">
                                {formatPrice(basePrices[plan.id] * (billingPeriod === 'semi-annual' ? 6 : 12))}
                              </div>
                              <div className="text-3xl font-bold text-gray-900 mb-1">
                                {formatPrice(price)}
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                /{billingPeriod === 'semi-annual' ? '6 months' : 'year'}
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <TrendingDown className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-semibold text-green-600">
                                  Save {formatPrice(savings)}
                                </span>
                              </div>
                              <div className="text-xs text-purple-600 font-medium mt-1">
                                = {formatPrice(monthlyEquivalent)}/month
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {selectedPlan === plan.id && (
                          <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                <h4 className="font-bold text-gray-900 mb-4">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Salon:</span>
                    <span className="font-semibold text-gray-900">{salonName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold text-gray-900">
                      {plans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Billing:</span>
                    <span className="font-semibold text-gray-900">
                      {billingPeriod === 'monthly' ? 'Monthly' : billingPeriod === 'semi-annual' ? '6 Months' : 'Annual'}
                    </span>
                  </div>
                  {getSavings(selectedPlan, billingPeriod) > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>You save:</span>
                      <span className="font-bold">{formatPrice(getSavings(selectedPlan, billingPeriod))}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-purple-200 flex items-center justify-between">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatPrice(calculatePrice(selectedPlan, billingPeriod))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('details')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleContinueFromPlan}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <StripePaymentModal
          amount={calculatePrice(selectedPlan, billingPeriod)}
          description={`${plans.find(p => p.id === selectedPlan)?.name} Plan - ${salonName}`}
          onSuccess={handlePaymentSuccess}
          onClose={() => {
            setShowPayment(false);
            setStep('plan');
          }}
        />
      )}
    </div>
  );
}
