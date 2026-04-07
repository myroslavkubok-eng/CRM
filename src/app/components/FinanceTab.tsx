import { BarChart3, CreditCard, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function FinanceTab() {
  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      {/* Left Column - Financial Overview */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Financial Overview</h2>
          <p className="text-sm text-gray-500">Track your revenue and payments</p>
        </div>

        {/* Revenue Chart Placeholder */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-12 flex flex-col items-center justify-center min-h-[400px] bg-gray-50">
            <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center mb-4">
              <BarChart3 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Revenue Chart Visualization</h3>
            <p className="text-gray-500 text-center max-w-md">
              Connect your payment method to start tracking revenue, transactions, and financial analytics
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Payment Settings */}
      <div>
        <Card className="bg-gray-900 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Payment Settings</h3>
                <p className="text-sm text-gray-400">Direct payments to your account</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Platform Fee</div>
                  <div className="text-2xl font-bold text-green-400">0% Commission</div>
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                  0% Fee
                </div>
              </div>
              <p className="text-xs text-gray-400">
                We don't take any cut from your bookings. You keep 100% of your earnings.
              </p>
            </div>

            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium mb-4"
              size="lg"
            >
              Connect Stripe
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Secure payments powered by Stripe</p>
              <p className="text-xs text-gray-500">Funds deposited directly to your bank</p>
            </div>

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-green-400 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">Instant Payouts</div>
                  <div className="text-xs text-gray-400">
                    Get paid instantly after each booking
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-green-400 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">All Payment Methods</div>
                  <div className="text-xs text-gray-400">
                    Accept cards, Apple Pay, Google Pay
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-green-400 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">Fraud Protection</div>
                  <div className="text-xs text-gray-400">
                    Advanced security and chargeback protection
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Saved in Fees</span>
                </div>
                <div className="text-xl font-bold">$0</div>
                <div className="text-xs text-gray-500">vs 15% standard</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Total Revenue</span>
                </div>
                <div className="text-xl font-bold">$0</div>
                <div className="text-xs text-gray-500">Connect to track</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
