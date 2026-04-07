import { useState } from 'react';
import { BlockedSalonView } from '../components/BlockedSalonView';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BlockedSalonDemo() {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState<'payment_failed' | 'refund_processed' | 'subscription_expired' | 'manual_block'>('payment_failed');

  const demoSalons = {
    payment_failed: {
      id: 1,
      name: 'Beauty Corner',
      owner: 'Maria Ivanova',
      email: 'maria@beauty.com',
      phone: '+971501234567',
      blockReason: 'payment_failed' as const,
      blockedDate: '2024-12-20',
      lastPaymentDate: '2024-11-20',
      subscriptionPlan: 'Basic',
      amountDue: 99,
    },
    refund_processed: {
      id: 2,
      name: 'Glamour Studio',
      owner: 'Victoria Laurent',
      email: 'victoria@glamour.com',
      phone: '+971501111111',
      blockReason: 'refund_processed' as const,
      blockedDate: '2024-12-22',
      lastPaymentDate: '2024-12-15',
      subscriptionPlan: 'Standard',
      amountDue: 299,
    },
    subscription_expired: {
      id: 3,
      name: 'Quick Cuts',
      owner: 'John Smith',
      email: 'john@cuts.com',
      phone: '+971507654321',
      blockReason: 'subscription_expired' as const,
      blockedDate: '2024-12-15',
      lastPaymentDate: '2023-12-15',
      subscriptionPlan: 'Basic',
      amountDue: 99,
    },
    manual_block: {
      id: 4,
      name: 'Suspicious Salon',
      owner: 'Test User',
      email: 'test@example.com',
      phone: '+971501234567',
      blockReason: 'manual_block' as const,
      blockedDate: '2024-12-10',
      subscriptionPlan: 'Standard',
    },
  };

  const handleReactivate = () => {
    alert('Redirecting to payment page... (Demo mode)');
    setTimeout(() => {
      if (confirm('Salon reactivated successfully! Return to owner dashboard?')) {
        navigate('/owner?demo=true');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo Controls */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard Selector
            </Button>
            <Badge className="bg-blue-600 text-white">DEMO MODE</Badge>
          </div>
          
          <Card className="p-4">
            <h3 className="font-bold mb-3">🔒 Demo: Blocked Salon Scenarios</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a scenario to see how the blocked salon view looks for different reasons:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant={selectedReason === 'payment_failed' ? 'default' : 'outline'}
                onClick={() => setSelectedReason('payment_failed')}
                className={selectedReason === 'payment_failed' ? 'bg-red-600' : ''}
                size="sm"
              >
                💳 Payment Failed
              </Button>
              <Button
                variant={selectedReason === 'refund_processed' ? 'default' : 'outline'}
                onClick={() => setSelectedReason('refund_processed')}
                className={selectedReason === 'refund_processed' ? 'bg-orange-600' : ''}
                size="sm"
              >
                💸 Refund Processed
              </Button>
              <Button
                variant={selectedReason === 'subscription_expired' ? 'default' : 'outline'}
                onClick={() => setSelectedReason('subscription_expired')}
                className={selectedReason === 'subscription_expired' ? 'bg-amber-600' : ''}
                size="sm"
              >
                📅 Subscription Expired
              </Button>
              <Button
                variant={selectedReason === 'manual_block' ? 'default' : 'outline'}
                onClick={() => setSelectedReason('manual_block')}
                className={selectedReason === 'manual_block' ? 'bg-gray-600' : ''}
                size="sm"
              >
                🚫 Manual Block
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Blocked Salon View */}
      <BlockedSalonView
        salon={demoSalons[selectedReason]}
        onReactivate={handleReactivate}
      />
    </div>
  );
}
