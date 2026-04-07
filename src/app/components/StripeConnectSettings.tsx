import { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, ExternalLink, Copy, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { toast } from 'sonner';

interface StripeConnectSettingsProps {
  salonId: string;
  salonName: string;
  currentStripeAccountId?: string;
  isStripeConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function StripeConnectSettings({
  salonId,
  salonName,
  currentStripeAccountId,
  isStripeConnected,
  onConnect,
  onDisconnect
}: StripeConnectSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountId, setShowAccountId] = useState(false);

  const handleConnectStripe = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual backend API call
      // This should create a Stripe Connect onboarding link
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would redirect to Stripe Connect onboarding:
      // const response = await fetch('/api/stripe/connect/create-account', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ salonId, salonName })
      // });
      // const { accountLinkUrl } = await response.json();
      // window.location.href = accountLinkUrl;
      
      onConnect();
      toast.success('Stripe account connected successfully! 🎉');
    } catch (error) {
      toast.error('Failed to connect Stripe account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectStripe = async () => {
    if (!confirm('Are you sure you want to disconnect your Stripe account? This will stop all payment processing.')) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual backend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onDisconnect();
      toast.success('Stripe account disconnected successfully');
    } catch (error) {
      toast.error('Failed to disconnect Stripe account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual backend API call to check account status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Account status refreshed');
    } catch (error) {
      toast.error('Failed to refresh status');
    } finally {
      setIsLoading(false);
    }
  };

  const copyAccountId = () => {
    if (currentStripeAccountId) {
      navigator.clipboard.writeText(currentStripeAccountId);
      toast.success('Account ID copied to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">💳 Stripe Payment Settings</h2>
        <p className="text-gray-600">
          Connect your own Stripe account to accept payments. You keep 100% of your revenue - we only charge for the platform subscription.
        </p>
      </div>

      {/* Connection Status Card */}
      <Card className={`border-2 ${
        isStripeConnected 
          ? 'border-green-200 bg-green-50' 
          : 'border-yellow-200 bg-yellow-50'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isStripeConnected
                ? 'bg-green-100'
                : 'bg-yellow-100'
            }`}>
              {isStripeConnected ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold mb-1 ${
                isStripeConnected ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {isStripeConnected ? 'Stripe Connected ✓' : 'Stripe Not Connected'}
              </h3>
              <p className={`text-sm mb-3 ${
                isStripeConnected ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {isStripeConnected 
                  ? 'Your salon is ready to accept online payments. Clients can pay with credit cards, debit cards, and digital wallets.'
                  : 'Connect your Stripe account to start accepting online payments from clients.'
                }
              </p>

              {isStripeConnected && currentStripeAccountId && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-xs text-green-700">
                    <span className="font-medium">Account ID:</span>{' '}
                    {showAccountId ? (
                      <span className="font-mono">{currentStripeAccountId}</span>
                    ) : (
                      <span>••••••••••••</span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowAccountId(!showAccountId)}
                    className="text-green-600 hover:text-green-700 text-xs underline"
                  >
                    {showAccountId ? 'Hide' : 'Show'}
                  </button>
                  {showAccountId && (
                    <button
                      onClick={copyAccountId}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                {!isStripeConnected ? (
                  <Button
                    onClick={handleConnectStripe}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Connect Stripe Account
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleRefreshStatus}
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh Status
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleDisconnectStripe}
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Disconnect
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Your Own Account</h4>
            <p className="text-sm text-gray-600">
              Connect your personal Stripe account. Money goes directly to you.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">No Commission</h4>
            <p className="text-sm text-gray-600">
              You keep 100% of payments. Only Stripe's standard fees apply.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Instant Payouts</h4>
            <p className="text-sm text-gray-600">
              Manage payouts, refunds, and settings directly in your Stripe dashboard.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <h3 className="font-bold text-gray-900">How It Works</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Connect Your Stripe Account</h4>
                <p className="text-sm text-gray-600">
                  Click "Connect Stripe Account" above. You'll be redirected to Stripe to create or connect your existing account. This takes about 2-3 minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Start Accepting Payments</h4>
                <p className="text-sm text-gray-600">
                  Once connected, your clients can pay online when booking. They can choose full payment, deposit, or pay at the salon.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Manage From Stripe Dashboard</h4>
                <p className="text-sm text-gray-600">
                  Access your Stripe dashboard anytime to view transactions, issue refunds, update banking info, and manage payouts.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Stripe charges standard processing fees (~2.9% + 30¢ per transaction)</li>
              <li>• Katia does NOT take any commission from your payments</li>
              <li>• You need a valid business/personal bank account to receive payouts</li>
              <li>• Refunds can be processed directly from your Stripe dashboard</li>
              <li>• All payment data is securely handled by Stripe (PCI compliant)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <h3 className="font-bold text-gray-900">Frequently Asked Questions</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Do I need a Stripe account?</h4>
            <p className="text-sm text-gray-600">
              No, if you don't have one, you can create a new Stripe account during the connection process. It's free and takes just a few minutes.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">How much does it cost?</h4>
            <p className="text-sm text-gray-600">
              Stripe charges 2.9% + 30¢ per successful transaction. Katia doesn't charge any commission - you only pay your monthly subscription fee.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">When do I receive payouts?</h4>
            <p className="text-sm text-gray-600">
              Stripe typically transfers funds to your bank account within 2-7 business days. You can set up instant payouts in your Stripe dashboard (fees may apply).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Can I use my existing Stripe account?</h4>
            <p className="text-sm text-gray-600">
              Yes! If you already have a Stripe account, you can connect it during the onboarding process.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Is it safe?</h4>
            <p className="text-sm text-gray-600">
              Absolutely. Stripe is one of the world's most trusted payment processors, used by millions of businesses. All payment data is encrypted and PCI compliant.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">Need Help?</h4>
            <p className="text-sm text-purple-800 mb-2">
              If you have any questions about connecting your Stripe account or accepting payments, our support team is here to help!
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
