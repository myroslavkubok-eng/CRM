import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Lock,
  AlertTriangle,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  RefreshCw,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface BlockedSalonViewProps {
  salon: {
    id: number;
    name: string;
    owner: string;
    email: string;
    phone: string;
    blockReason: 'payment_failed' | 'refund_processed' | 'subscription_expired' | 'manual_block';
    blockedDate: string;
    lastPaymentDate?: string;
    subscriptionPlan?: string;
    amountDue?: number;
  };
  onReactivate?: () => void;
}

export function BlockedSalonView({ salon, onReactivate }: BlockedSalonViewProps) {
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getBlockReasonInfo = () => {
    switch (salon.blockReason) {
      case 'payment_failed':
        return {
          title: 'Subscription Payment Failed',
          description: 'Your last payment was unsuccessful. Please update your payment method to reactivate your salon.',
          icon: CreditCard,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          canRestore: true,
          restoreAction: 'Update Payment & Reactivate',
        };
      case 'refund_processed':
        return {
          title: 'Refund Processed - Account Paused',
          description: 'Your refund has been processed. Your salon data is safely stored and you can reactivate anytime.',
          icon: RefreshCw,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          canRestore: true,
          restoreAction: 'Subscribe Again & Restore',
        };
      case 'subscription_expired':
        return {
          title: 'Subscription Expired',
          description: 'Your subscription has expired. Renew now to regain access to your salon dashboard.',
          icon: Calendar,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          canRestore: true,
          restoreAction: 'Renew Subscription',
        };
      case 'manual_block':
        return {
          title: 'Account Suspended',
          description: 'Your account has been suspended. Please contact support for assistance.',
          icon: Shield,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          canRestore: false,
          restoreAction: 'Contact Support',
        };
      default:
        return {
          title: 'Account Blocked',
          description: 'Your account is currently blocked.',
          icon: Lock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          canRestore: false,
          restoreAction: 'Contact Support',
        };
    }
  };

  const blockInfo = getBlockReasonInfo();
  const Icon = blockInfo.icon;

  const handleRestore = async () => {
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (onReactivate) {
      onReactivate();
    } else {
      alert('Redirecting to payment page...');
    }
    
    setIsProcessing(false);
    setShowRestoreModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className={`max-w-2xl w-full border-4 ${blockInfo.borderColor}`}>
        {/* Header */}
        <div className={`${blockInfo.bgColor} p-8 border-b-4 ${blockInfo.borderColor}`}>
          <div className="flex items-center justify-center mb-4">
            <div className={`w-20 h-20 rounded-full ${blockInfo.bgColor} border-4 ${blockInfo.borderColor} flex items-center justify-center`}>
              <Icon className={`w-10 h-10 ${blockInfo.color}`} />
            </div>
          </div>
          <h1 className={`text-3xl font-bold text-center mb-2 ${blockInfo.color}`}>
            {blockInfo.title}
          </h1>
          <p className="text-center text-gray-700 max-w-md mx-auto">
            {blockInfo.description}
          </p>
        </div>

        {/* Salon Info */}
        <div className="p-8 space-y-6">
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600" />
              Blocked Salon Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Salon Name:</p>
                <p className="font-bold">{salon.name}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Owner:</p>
                <p className="font-bold">{salon.owner}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Email:</p>
                <p className="font-bold">{salon.email}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Blocked Date:</p>
                <p className="font-bold">{salon.blockedDate}</p>
              </div>
              {salon.subscriptionPlan && (
                <div>
                  <p className="text-gray-600 mb-1">Previous Plan:</p>
                  <Badge className="bg-purple-100 text-purple-700">{salon.subscriptionPlan}</Badge>
                </div>
              )}
              {salon.amountDue && (
                <div>
                  <p className="text-gray-600 mb-1">Amount Due:</p>
                  <p className="font-bold text-red-600">AED {salon.amountDue.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Data Safety Notice */}
          <Card className="p-5 border-2 border-green-200 bg-green-50">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-900 mb-1">Your Data is Safe! 🔒</h4>
                <p className="text-sm text-green-800 mb-2">
                  All your salon data is securely stored for <strong>90 days</strong>:
                </p>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>✓ Client list and contact information</li>
                  <li>✓ Booking history and appointments</li>
                  <li>✓ Staff members and schedules</li>
                  <li>✓ Services and pricing</li>
                  <li>✓ Photos and salon profile</li>
                </ul>
                <p className="text-sm text-green-800 mt-3 font-semibold">
                  💡 Reactivate anytime to restore everything instantly!
                </p>
              </div>
            </div>
          </Card>

          {/* What Happens Now */}
          <Card className="p-5 border-2 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 mb-2">What Happens Now?</h4>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>Your salon is temporarily <strong>hidden</strong> from public listings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>Clients cannot make new bookings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>Existing appointments are <strong>preserved</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">4.</span>
                    <span>Data remains safe for 90 days</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">5.</span>
                    <span>After 90 days without reactivation, data will be permanently deleted</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {blockInfo.canRestore ? (
              <Button
                onClick={() => setShowRestoreModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14 text-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                {blockInfo.restoreAction}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = 'mailto:support@katia.beauty'}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-14 text-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.href = 'mailto:support@katia.beauty'}
                className="h-12"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Us
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = 'tel:+971XXXXXXXX'}
                className="h-12"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Support
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 p-5 rounded-lg border-2 border-gray-200">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Reactivation Timeline
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>⚡ <strong>Instant:</strong> Pay & reactivate immediately</p>
              <p>📊 <strong>5 minutes:</strong> All data fully restored</p>
              <p>🌐 <strong>15 minutes:</strong> Salon live on public listings</p>
              <p>✉️ <strong>24 hours:</strong> Clients notified you're back</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Restore Modal */}
      {showRestoreModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !isProcessing && setShowRestoreModal(false)}
        >
          <Card
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Reactivate Your Salon</h3>
                <p className="text-gray-600">
                  Welcome back! Let's get your salon running again.
                </p>
              </div>

              <Card className="p-4 bg-purple-50 border-2 border-purple-200 mb-6">
                <h4 className="font-bold text-purple-900 mb-2">What you'll get:</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>✓ All your data restored instantly</li>
                  <li>✓ Salon visible to clients again</li>
                  <li>✓ Booking system reactivated</li>
                  <li>✓ Full access to dashboard</li>
                </ul>
              </Card>

              {salon.amountDue && (
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Amount Due:</span>
                    <span className="text-2xl font-bold text-green-600">
                      AED {salon.amountDue.toFixed(2)}
                    </span>
                  </div>
                  {salon.subscriptionPlan && (
                    <p className="text-sm text-gray-600">
                      {salon.subscriptionPlan} Plan - Monthly
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleRestore}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay & Reactivate Now
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRestoreModal(false)}
                  disabled={isProcessing}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
