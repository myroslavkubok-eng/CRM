import { useState } from 'react';
import { CheckoutModal } from '../components/CheckoutModal';
import { Button } from '../components/ui/button';
import { CreditCard } from 'lucide-react';

export function CheckoutDemoPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleComplete = (paymentMethod: string, total: number) => {
    alert(`Payment completed!\n\nMethod: ${paymentMethod}\nTotal: $${total.toFixed(2)}\n\nThank you for your payment!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Checkout Modal Demo
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Complete payment for salon services and products
          </p>
          
          <Button
            onClick={() => setIsCheckoutOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 h-auto"
          >
            <CreditCard className="w-6 h-6 mr-3" />
            Open Checkout
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-3">✨ Features</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Add services and products</li>
              <li>✓ Search functionality with tabs</li>
              <li>✓ Multiple payment methods (Card, Cash, Link)</li>
              <li>✓ Discount in % or $ amount</li>
              <li>✓ Real-time total calculation</li>
              <li>✓ Remove items from cart</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-3">🎯 Use Cases</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Complete client checkout</li>
              <li>• Add extra services during visit</li>
              <li>• Sell retail products</li>
              <li>• Apply discounts and promotions</li>
              <li>• Accept multiple payment types</li>
              <li>• Track order totals</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-3">💰 Pricing</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Services: $10 - $55</li>
              <li>• Products: $15 - $55</li>
              <li>• Automatic currency conversion</li>
              <li>• Multi-currency support</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-3">🛡️ Security</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Secure payment processing</li>
              <li>• Order tracking with unique ID</li>
              <li>• Real-time validation</li>
              <li>• Audit trail for all transactions</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-purple-100 rounded-2xl border-2 border-purple-300">
          <h3 className="font-bold text-purple-900 mb-2">📋 How It Works</h3>
          <ol className="space-y-2 text-sm text-purple-800">
            <li>1. Click "Add Service / Product" to browse available items</li>
            <li>2. Switch between Services and Products tabs</li>
            <li>3. Use search to find specific items quickly</li>
            <li>4. Click items to add them to the checkout</li>
            <li>5. Select payment method (Card, Cash, or Link)</li>
            <li>6. Apply discount in % or $ if needed</li>
            <li>7. Review total and click "Charge" to complete</li>
          </ol>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        orderId="12345"
        clientName="Sarah Johnson"
        initialItems={[
          { id: 'initial-1', name: 'Haircut & Styling', price: 65, type: 'service' }
        ]}
        onComplete={handleComplete}
      />
    </div>
  );
}
