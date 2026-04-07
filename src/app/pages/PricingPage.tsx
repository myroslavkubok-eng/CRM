import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Users, 
  Zap, 
  Shield,
  Sparkles,
  Crown,
  PlayCircle,
  X,
  TrendingDown,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { DemoModal } from '../components/DemoModal';
import { StripePaymentModal } from '../components/StripePaymentModal';
import { SalonOnboardingModal } from '../components/SalonOnboardingModal';
import { useCurrency } from '../../contexts/CurrencyContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  features: string[];
  unavailableFeatures?: string[]; // Features that are unavailable in this plan
  isPopular?: boolean;
  trialDays: number;
}

export function PricingPage() {
  const { formatPrice, currency } = useCurrency();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'semi-annual' | 'annual'>('annual');
  const navigate = useNavigate();

  // Base prices in AED (monthly)
  const basePrices = {
    basic: 99,
    standard: 299,
    business: 499
  };

  // Discount percentages
  const discounts = {
    monthly: 0,
    'semi-annual': {
      basic: 15,
      standard: 15,
      business: 20
    },
    annual: {
      basic: 20,
      standard: 25,
      business: 30
    }
  };

  const calculatePrice = (planId: string, period: typeof billingPeriod) => {
    const basePrice = basePrices[planId as keyof typeof basePrices];
    
    if (period === 'monthly') {
      return basePrice;
    }
    
    const months = period === 'semi-annual' ? 6 : 12;
    const discount = discounts[period][planId as keyof typeof basePrices];
    const totalPrice = basePrice * months * (1 - discount / 100);
    
    return Math.round(totalPrice);
  };

  const getSavings = (planId: string, period: typeof billingPeriod) => {
    if (period === 'monthly') return 0;
    
    const basePrice = basePrices[planId as keyof typeof basePrices];
    const months = period === 'semi-annual' ? 6 : 12;
    const fullPrice = basePrice * months;
    const discountedPrice = calculatePrice(planId, period);
    
    return fullPrice - discountedPrice;
  };

  const getMonthlyEquivalent = (planId: string, period: typeof billingPeriod) => {
    const totalPrice = calculatePrice(planId, period);
    const months = period === 'monthly' ? 1 : period === 'semi-annual' ? 6 : 12;
    
    return Math.round(totalPrice / months);
  };

  const getDiscountBadge = (planId: string, period: typeof billingPeriod) => {
    if (period === 'monthly') return null;
    
    const discount = discounts[period][planId as keyof typeof basePrices];
    return `Save ${discount}%`;
  };

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic Start',
      price: 99,
      period: 'month',
      description: 'Perfect for independent masters',
      trialDays: 7,
      features: [
        'Up to 2 Masters',
        'Up to 15 Services',
        'Basic Online Booking',
        'Client Database (basic)',
        'Mobile App Access',
        'Push Notifications 24/7',
        'Basic Calendar & Scheduling',
        'Booking Widget for Website'
      ],
      unavailableFeatures: [
        'Admin Role Management',
        'Multiple Salon Locations',
        'AI Receptionist',
        'Marketing Tools (SMS/Email)',
        'Advanced Analytics & Reports',
        'Financial Reports',
        'Export/Import Client Database',
        'Inventory Management',
        'Workplace Management System',
        'Priority Support 24/7'
      ]
    },
    {
      id: 'standard',
      name: 'Standard Growth',
      price: 299,
      period: 'month',
      description: 'For growing salons',
      badge: 'MOST POPULAR',
      badgeColor: 'purple',
      isPopular: true,
      trialDays: 7,
      features: [
        'Up to 8 Masters',
        '1 Admin (with booking access)',
        'Up to 50 Services',
        'Advanced Online Booking',
        'Client CRM System',
        'AI Receptionist (Basic)',
        'Marketing Tools (SMS/Email)',
        'Workplace Management System',
        'Basic Analytics Dashboard',
        'Push Notifications 24/7',
        'Mobile App Access',
        'Booking Widget for Website',
        'Custom Branding'
      ],
      unavailableFeatures: [
        'Multiple Salon Locations',
        'Advanced AI Receptionist',
        'Advanced Analytics & Custom Reports',
        'Financial Reports & Revenue Tracking',
        'Export/Import Client Database',
        'Inventory Management',
        'Priority Support 24/7'
      ]
    },
    {
      id: 'business',
      name: 'Business Pro',
      price: 499,
      period: 'month',
      description: 'Maximum power for large salons',
      badge: 'BEST VALUE',
      badgeColor: 'orange',
      trialDays: 7,
      features: [
        'Unlimited Masters',
        'Unlimited Admins',
        'Unlimited Services',
        'Advanced AI Receptionist',
        'Multiple Salon Locations',
        'Priority Support 24/7',
        'Advanced Analytics & Custom Reports',
        'Financial Reports & Revenue Tracking',
        'Export/Import Client Database',
        'Inventory Management',
        'Marketing Automation',
        'Workplace Management System',
        'Client CRM System (Advanced)',
        'Push Notifications 24/7',
        'Mobile App Access',
        'Custom Branding',
        'API Access',
        'Dedicated Account Manager'
      ]
    }
  ];

  const brandLogos = ['VOGUE', 'ELLE', 'GLAMOUR', 'HARPER\'S BAZAAR'];

  const handleStartTrial = (planId: string) => {
    console.log('Starting trial for plan:', planId);
    // TODO: Navigate to onboarding or create salon account
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 md:py-16">
      <Header />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            Simple, Transparent Pricing
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-3">
            Choose the perfect plan for your salon. No commitment, cancel anytime.
          </p>
          <p className="text-sm text-gray-500 mb-10">
            Select a plan that fits your needs.
          </p>

          {/* Important Notice - No Hidden Fees */}
          <div className="max-w-2xl mx-auto mb-10 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-900">100% Transparent Pricing</span>
            </div>
            <p className="text-sm text-green-800">
              You only pay for your subscription plan. <span className="font-semibold">No hidden fees, no commission on bookings, no setup charges.</span> What you see is what you pay!
            </p>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">Instant Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-700">Unlimited Clients</span>
            </div>
          </div>

          {/* Billing Period Toggle */}
          <div className="mt-12 mb-10 flex justify-center">
            <div className="inline-flex items-center gap-3 p-2 bg-white rounded-full shadow-lg border border-gray-200">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('semi-annual')}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all relative ${
                  billingPeriod === 'semi-annual'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                6 Months
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  15-20%
                </span>
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all relative ${
                  billingPeriod === 'annual'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  25-30%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-20 px-4 md:px-6 mt-20">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-visible ${
                plan.isPopular
                  ? 'border-2 border-purple-500 shadow-2xl scale-105 md:scale-110'
                  : 'border border-gray-200 shadow-lg'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white ${
                    plan.badgeColor === 'purple'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500'
                      : 'bg-gradient-to-r from-orange-500 to-orange-400'
                  }`}
                >
                  {plan.badgeColor === 'purple' && <Crown className="w-3 h-3 inline mr-1" />}
                  {plan.badge}
                </div>
              )}

              <CardHeader className="text-center pt-8 pb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                
                {/* View Demo Link */}
                <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 justify-center mx-auto" onClick={() => setIsDemoOpen(true)}>
                  <PlayCircle className="w-4 h-4" />
                  View Live Demo
                </button>
              </CardHeader>

              <CardContent className="pt-0 pb-8">
                {/* Price */}
                <div className="text-center mb-6">
                  {billingPeriod !== 'monthly' && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(basePrices[plan.id as keyof typeof basePrices] * (billingPeriod === 'semi-annual' ? 6 : 12))}
                      </span>
                    </div>
                  )}
                  <div className="mb-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl md:text-4xl font-bold text-gray-900">
                        {formatPrice(calculatePrice(plan.id, billingPeriod))}
                      </span>
                      <span className="text-sm text-gray-500">
                        /{billingPeriod === 'monthly' ? 'mo' : billingPeriod === 'semi-annual' ? '6mo' : 'yr'}
                      </span>
                    </div>
                  </div>
                  {billingPeriod !== 'monthly' && (
                    <>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingDown className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                          Save {formatPrice(getSavings(plan.id, billingPeriod))}
                        </span>
                      </div>
                      <div className="text-xs text-purple-600 font-medium">
                        {formatPrice(getMonthlyEquivalent(plan.id, billingPeriod))}/month
                      </div>
                    </>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    INCLUDES
                  </p>
                  {/* Available features */}
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {/* Unavailable features (grayed out) */}
                  {plan.unavailableFeatures && plan.unavailableFeatures.map((feature, index) => (
                    <div key={`unavailable-${index}`} className="flex items-start gap-3 opacity-40">
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-400 line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => {
                    // Open payment modal first
                    setSelectedPlan(plan);
                    setIsPaymentOpen(true);
                  }}
                  className={`w-full h-12 font-medium ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : plan.badgeColor === 'orange'
                      ? 'bg-gray-900 hover:bg-gray-800 text-white'
                      : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200'
                  }`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trusted By */}
        <div className="text-center mt-20">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
            TRUSTED BY
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {brandLogos.map((logo, index) => (
              <div
                key={index}
                className="text-gray-300 font-serif text-sm tracking-wider"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-none bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-8 md:p-10">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <Shield className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">Secure & Trusted</h4>
                  <p className="text-sm text-gray-600">
                    Bank-level security for all your data and payments
                  </p>
                </div>
                <div>
                  <Users className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">Free Migration</h4>
                  <p className="text-sm text-gray-600">
                    We'll help you move from your current system for free
                  </p>
                </div>
                <div>
                  <Sparkles className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">24/7 Support</h4>
                  <p className="text-sm text-gray-600">
                    Our team is always here to help you succeed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <details className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Can I upgrade or downgrade my plan at any time?
              </summary>
              <div className="mt-4 text-sm text-gray-600 space-y-3">
                <p className="font-medium text-gray-900">
                  Yes! You can change your plan at any time with instant effect. Here's how it works:
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-semibold text-blue-900 mb-2">📈 Upgrading to a Higher Plan:</p>
                  <p className="text-blue-800">
                    We use <strong>proration</strong> (proportional billing). You only pay the difference for the remaining time.
                  </p>
                  <div className="mt-2 p-3 bg-white rounded text-xs">
                    <p className="font-mono text-gray-700">
                      <strong>Example:</strong> You paid AED 3,000 for Standard Annual (12 months).<br/>
                      After 4 months, you upgrade to Business Annual (AED 4,200/year).<br/>
                      <br/>
                      <strong>Calculation:</strong><br/>
                      • Remaining time: 8 months<br/>
                      • Standard remaining value: AED 2,000 (8/12 × 3,000)<br/>
                      • Business cost for 8 months: AED 2,800 (8/12 × 4,200)<br/>
                      <br/>
                      <span className="text-green-600 font-bold">→ You pay only: AED 800 difference</span><br/>
                      <span className="text-gray-500">Your plan upgrades immediately!</span>
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <p className="font-semibold text-purple-900 mb-2">📉 Downgrading to a Lower Plan:</p>
                  <p className="text-purple-800">
                    The remaining credit is saved and applied to your new plan, extending your subscription period.
                  </p>
                  <div className="mt-2 p-3 bg-white rounded text-xs">
                    <p className="font-mono text-gray-700">
                      <strong>Example:</strong> You paid AED 4,200 for Business Annual.<br/>
                      After 4 months, you downgrade to Standard Annual (AED 3,000/year).<br/>
                      <br/>
                      <strong>Calculation:</strong><br/>
                      • Remaining value: AED 2,800 (8/12 × 4,200)<br/>
                      • Standard monthly cost: AED 250/month<br/>
                      <br/>
                      <span className="text-green-600 font-bold">→ Credit extends your Standard plan by 11.2 months</span><br/>
                      <span className="text-gray-500">No money lost, just extends your subscription!</span>
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 p-3 rounded mt-3">
                  <p className="text-green-800 font-medium text-xs">
                    ✅ <strong>100% Fair System:</strong> You never lose money. We calculate everything down to the day!
                  </p>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                What happens if I want to upgrade from monthly to annual?
              </summary>
              <div className="mt-4 text-sm text-gray-600 space-y-3">
                <p>
                  Great choice! When switching from monthly to annual billing, you get immediate access to the annual discount:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your current monthly subscription is cancelled</li>
                  <li>Unused days are credited towards your annual plan</li>
                  <li>You immediately benefit from 20-30% annual savings</li>
                  <li>No double billing - everything is prorated fairly</li>
                </ul>
                <p className="font-medium text-purple-600 mt-3">
                  💡 Tip: Annual plans save you up to 30% compared to monthly billing!
                </p>
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Are there any setup or hidden fees?
              </summary>
              <p className="mt-3 text-sm text-gray-600">
                <strong>Absolutely not!</strong> The price you see is the price you pay. No setup fees, no hidden charges, no commission on bookings, no transaction fees. We believe in complete transparency.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Can I cancel my subscription anytime?
              </summary>
              <div className="mt-4 text-sm text-gray-600 space-y-2">
                <p>
                  Yes, you can cancel anytime from your dashboard. Here's what happens:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>No cancellation fees</strong> - ever!</li>
                  <li>Your plan remains active until the end of your billing period</li>
                  <li>All your data is safely stored for 30 days after cancellation</li>
                  <li>You can export your client database before cancelling</li>
                  <li>Reactivate anytime - your data will be waiting</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Do you offer refunds?
              </summary>
              <div className="mt-4 text-sm text-gray-600 space-y-2">
                <p>
                  We offer a <strong>7-day money-back guarantee</strong> on all plans:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Try the platform risk-free for 7 days</li>
                  <li>If you're not satisfied, get a full refund - no questions asked</li>
                  <li>After 7 days, unused subscription time is credited (not refunded)</li>
                  <li>Credits can be used for plan changes or future renewals</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                What payment methods do you accept?
              </summary>
              <div className="mt-4 text-sm text-gray-600">
                <p className="mb-2">We accept all major payment methods via Stripe:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Credit & Debit Cards (Visa, Mastercard, Amex)</li>
                  <li>Apple Pay & Google Pay</li>
                  <li>Bank transfers (for annual plans)</li>
                  <li>Local payment methods in your country</li>
                </ul>
                <p className="mt-3 text-xs text-gray-500">
                  🔒 All payments are processed securely through Stripe. We never store your card details.
                </p>
              </div>
            </details>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact">
              <Button variant="outline" size="lg" className="min-w-[180px]">
                Contact Sales
              </Button>
            </Link>
            <Link to="/become-partner">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white min-w-[180px]"
              >
                Back to Partner Page
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      {selectedPlan && (
        <>
          <StripePaymentModal 
      isOpen={isPaymentOpen} 
      onClose={() => setIsPaymentOpen(false)}
      amount={calculatePrice(selectedPlan.id, billingPeriod)}
      currency={currency.code}
      description={`${selectedPlan.name} - ${billingPeriod === 'monthly' ? 'Monthly' : billingPeriod === 'semi-annual' ? '6 Months' : 'Annual'}`}
      onPaymentSuccess={() => {
        setIsPaymentOpen(false);
        setIsOnboardingOpen(true);
      }}
    />
    <SalonOnboardingModal
      isOpen={isOnboardingOpen}
      onClose={() => setIsOnboardingOpen(false)}
      subscription={{
        planName: selectedPlan.name,
        price: calculatePrice(selectedPlan.id, billingPeriod).toString()
      }}
          />
        </>
      )}
      <Footer />
    </div>
  );
}