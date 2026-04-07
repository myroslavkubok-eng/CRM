import { useState } from 'react';
import { ExternalLink, CheckCircle, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface StripeConnectButtonProps {
  salonId: string;
  isConnected: boolean;
  stripeAccountId?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function StripeConnectButton({
  salonId,
  isConnected,
  stripeAccountId,
  onConnect,
  onDisconnect,
}: StripeConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<{
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    requirementsNeeded: string[];
  } | null>(null);

  const handleConnect = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement Stripe Connect OAuth flow
      // 1. Create Connect account or get OAuth link
      // const response = await fetch('/api/stripe/connect/create', {
      //   method: 'POST',
      //   body: JSON.stringify({ salonId })
      // });
      // const { accountId, onboardingUrl } = await response.json();
      
      // 2. Redirect to Stripe onboarding
      // window.location.href = onboardingUrl;
      
      // Mock for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Redirecting to Stripe Connect...');
      
      // Simulate redirect
      console.log('Would redirect to Stripe Connect onboarding');
      
      if (onConnect) {
        onConnect();
      }
    } catch (error) {
      console.error('Error connecting Stripe:', error);
      toast.error('Failed to connect Stripe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Fetch account status from backend
      // const response = await fetch(`/api/stripe/connect/status/${salonId}`);
      // const status = await response.json();
      // setAccountStatus(status);
      
      // Mock for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAccountStatus({
        chargesEnabled: true,
        payoutsEnabled: true,
        requirementsNeeded: [],
      });
      
      toast.success('Status updated');
    } catch (error) {
      console.error('Error fetching status:', error);
      toast.error('Failed to fetch status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Stripe account? You will not be able to accept online payments.')) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement disconnect
      // await fetch(`/api/stripe/connect/disconnect/${salonId}`, {
      //   method: 'POST'
      // });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Stripe account disconnected');
      
      if (onDisconnect) {
        onDisconnect();
      }
    } catch (error) {
      console.error('Error disconnecting Stripe:', error);
      toast.error('Failed to disconnect');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    // Not connected - show connect button
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">
              Connect Your Stripe Account
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Connect Stripe to start accepting deposits and online payments directly to your bank account.
              Your customers will pay you directly - we never hold your money.
            </p>
            
            {/* Benefits */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Accept credit/debit cards online</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Get paid directly to your bank account</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Protect your salon from no-shows</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Secure & PCI compliant</span>
              </div>
            </div>

            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Connect with Stripe
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>ℹ️ What happens next?</strong><br />
                You'll be redirected to Stripe to complete a quick setup (2-3 minutes).
                You'll need your business details and bank account information.
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Connected - show status
  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            Stripe Connected
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              ✓ Active
            </span>
          </h3>
          
          <p className="text-sm text-gray-700 mb-3">
            Your Stripe account is connected and ready to accept payments.
          </p>

          {/* Account Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="font-medium">Account ID:</span>
              <code className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">
                {stripeAccountId?.substring(0, 20)}...
              </code>
            </div>
            
            {accountStatus && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${accountStatus.chargesEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-700">
                    Charges: {accountStatus.chargesEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${accountStatus.payoutsEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-700">
                    Payouts: {accountStatus.payoutsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleRefreshStatus}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh Status
            </Button>
            
            <Button
              onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              Open Stripe Dashboard
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleDisconnect}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Disconnect
            </Button>
          </div>

          {/* Requirements */}
          {accountStatus && accountStatus.requirementsNeeded.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 mb-2">
                <strong>⚠️ Action Required:</strong>
              </p>
              <ul className="text-xs text-yellow-800 space-y-1 ml-4 list-disc">
                {accountStatus.requirementsNeeded.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
              <Button
                size="sm"
                className="mt-2 bg-yellow-600 hover:bg-yellow-700"
                onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
              >
                Complete Setup
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
