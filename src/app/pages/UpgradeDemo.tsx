import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { UpgradeCalculatorModal } from '../components/UpgradeCalculatorModal';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export function UpgradeDemo() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);

  const basePrices = {
    basic: 99,
    standard: 299,
    business: 499
  };

  // Demo scenarios
  const scenarios = [
    {
      name: 'Upgrade: Standard → Business (After 4 months)',
      type: 'upgrade',
      currentPlan: {
        id: 'standard',
        name: 'Standard Growth',
        price: 2243, // Annual with 25% discount
        billingPeriod: 'annual' as const,
        startDate: '2024-08-24T00:00:00Z', // 4 months ago
      },
      newPlan: {
        id: 'business',
        name: 'Business Pro',
        price: 4200, // Annual with 30% discount
        billingPeriod: 'annual' as const,
      }
    },
    {
      name: 'Downgrade: Business → Standard (After 3 months)',
      type: 'downgrade',
      currentPlan: {
        id: 'business',
        name: 'Business Pro',
        price: 4200,
        billingPeriod: 'annual' as const,
        startDate: '2024-09-24T00:00:00Z', // 3 months ago
      },
      newPlan: {
        id: 'standard',
        name: 'Standard Growth',
        price: 2243,
        billingPeriod: 'annual' as const,
      }
    },
    {
      name: 'Upgrade: Basic → Standard (Monthly to Annual)',
      type: 'upgrade',
      currentPlan: {
        id: 'basic',
        name: 'Basic Start',
        price: 99,
        billingPeriod: 'monthly' as const,
        startDate: '2024-12-04T00:00:00Z', // 20 days ago
      },
      newPlan: {
        id: 'standard',
        name: 'Standard Growth',
        price: 2243,
        billingPeriod: 'annual' as const,
      }
    },
    {
      name: 'Upgrade: Standard → Business (6 months plan, after 2 months)',
      type: 'upgrade',
      currentPlan: {
        id: 'standard',
        name: 'Standard Growth',
        price: 1522, // 6 months with 15% discount
        billingPeriod: 'semi-annual' as const,
        startDate: '2024-10-24T00:00:00Z', // 2 months ago
      },
      newPlan: {
        id: 'business',
        name: 'Business Pro',
        price: 2395, // 6 months with 20% discount
        billingPeriod: 'semi-annual' as const,
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade/Downgrade Calculator Demo
          </h1>
          <p className="text-lg text-gray-600">
            See how proration works in different scenarios
          </p>
        </div>

        {/* Scenarios */}
        <div className="space-y-4">
          {scenarios.map((scenario, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {scenario.type === 'upgrade' ? (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <ArrowUpCircle className="w-6 h-6 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <ArrowDownCircle className="w-6 h-6 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900">{scenario.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {scenario.currentPlan.name} → {scenario.newPlan.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Started: {new Date(scenario.currentPlan.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedScenario(scenario);
                    setIsUpgradeModalOpen(true);
                  }}
                  className={`${
                    scenario.type === 'upgrade'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  } text-white`}
                >
                  View Calculation
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <h3 className="font-bold text-green-900 mb-3">How Proration Works</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>✅ <strong>For Upgrades:</strong> You only pay the difference for the remaining time of your current plan</li>
            <li>✅ <strong>For Downgrades:</strong> Your remaining credit extends your new plan automatically</li>
            <li>✅ <strong>100% Fair:</strong> All calculations are done down to the day - you never lose money</li>
            <li>✅ <strong>Instant Effect:</strong> Upgrades activate immediately after payment</li>
            <li>✅ <strong>No Penalties:</strong> No cancellation fees or hidden charges</li>
          </ul>
        </Card>
      </div>

      {/* Upgrade Calculator Modal */}
      {selectedScenario && (
        <UpgradeCalculatorModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          currentPlan={selectedScenario.currentPlan}
          newPlan={selectedScenario.newPlan}
          basePrices={basePrices}
        />
      )}
    </div>
  );
}
