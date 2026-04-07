import { useState } from 'react';
import { ArrowLeft, Calendar, ShoppingBag, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { QuickRetailCheckout } from '../components/QuickRetailCheckout';
import { EnhancedCheckoutModal } from '../components/EnhancedCheckoutModal';
import { DEMO_PRODUCTS } from '../data/demoProducts';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../contexts/CurrencyContext';

// Mock calendar events
const DEMO_BOOKINGS = [
  {
    id: 'booking-1',
    clientId: 'client-1',
    clientName: 'Sarah Johnson',
    serviceName: 'Haircut & Styling',
    servicePrice: 200,
    time: '10:00 AM',
    depositPaid: true,
    depositAmount: 50,
  },
  {
    id: 'booking-2',
    clientId: 'client-2',
    clientName: 'Emma Williams',
    serviceName: 'Manicure',
    servicePrice: 150,
    time: '2:00 PM',
    depositPaid: false,
    depositAmount: 0,
  },
  {
    id: 'booking-3',
    clientId: 'client-3',
    clientName: 'Olivia Brown',
    serviceName: 'Facial Treatment',
    servicePrice: 300,
    time: '4:30 PM',
    depositPaid: true,
    depositAmount: 100,
  },
];

export function QuickRetailDemo() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  const [retailSales, setRetailSales] = useState<any[]>([]);
  const [showEnhancedCheckout, setShowEnhancedCheckout] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const handleRetailSale = (sale: any) => {
    const newSale = {
      ...sale,
      id: `sale-${Date.now()}`,
      timestamp: new Date(),
      type: 'retail',
    };
    
    setRetailSales(prev => [newSale, ...prev]);
    
    toast.success(`🛍️ Retail sale completed!`, {
      description: `${sale.items.length} items sold - ${formatPrice(sale.total)}`,
    });
  };

  const handleBookingCheckout = (booking: any) => {
    setSelectedBooking(booking);
    setShowEnhancedCheckout(true);
  };

  const handleBookingPayment = (payment: any) => {
    const newSale = {
      ...payment,
      id: `booking-sale-${Date.now()}`,
      timestamp: new Date(),
      type: 'booking',
      bookingId: selectedBooking.id,
    };
    
    setRetailSales(prev => [newSale, ...prev]);
    
    toast.success(`✅ Booking payment completed!`, {
      description: `${selectedBooking.clientName} - ${formatPrice(payment.amount)}`,
    });
    
    setShowEnhancedCheckout(false);
    setSelectedBooking(null);
  };

  const totalRevenue = retailSales.reduce((sum, sale) => sum + sale.total, 0);
  const retailOnlyRevenue = retailSales
    .filter(s => s.type === 'retail')
    .reduce((sum, sale) => sum + sale.total, 0);
  const bookingRevenue = retailSales
    .filter(s => s.type === 'booking')
    .reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">🛍️ Quick Retail Checkout Demo</h1>
                <p className="text-purple-100 mt-1">
                  Sell products without booking + Enhanced checkout for appointments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Revenue Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(totalRevenue)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Retail Sales</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(retailOnlyRevenue)}
                </div>
                <div className="text-xs text-gray-500">
                  {retailSales.filter(s => s.type === 'retail').length} transactions
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Booking Revenue</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(bookingRevenue)}
                </div>
                <div className="text-xs text-gray-500">
                  {retailSales.filter(s => s.type === 'booking').length} bookings
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Quick Retail + Calendar */}
          <div className="space-y-6">
            {/* Quick Retail Checkout */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <QuickRetailCheckout
                salonId="demo-salon-123"
                products={DEMO_PRODUCTS}
                onCheckoutComplete={handleRetailSale}
              />
            </div>

            {/* Today's Bookings */}
            <Card>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Today's Bookings
                </h3>

                <div className="space-y-3">
                  {DEMO_BOOKINGS.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-all cursor-pointer"
                      onClick={() => handleBookingCheckout(booking)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">
                          {booking.clientName}
                        </div>
                        <div className="text-sm font-medium text-purple-600">
                          {booking.time}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {booking.serviceName}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatPrice(booking.servicePrice)}
                        </div>
                        {booking.depositPaid ? (
                          <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            💰 Deposit: {formatPrice(booking.depositAmount)}
                          </div>
                        ) : (
                          <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                            ⏳ No deposit
                          </div>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <Button
                          size="sm"
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookingCheckout(booking);
                          }}
                        >
                          💳 Open Checkout
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Sales History */}
          <Card>
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Sales History
                <span className="ml-auto text-sm font-normal text-gray-600">
                  {retailSales.length} transactions
                </span>
              </h3>

              {retailSales.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2">No sales yet</p>
                  <p className="text-sm text-gray-500">
                    Try selling some products or completing a booking checkout
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {retailSales.map((sale) => (
                    <div
                      key={sale.id}
                      className={`p-4 rounded-lg border-2 ${
                        sale.type === 'retail'
                          ? 'bg-pink-50 border-pink-200'
                          : 'bg-purple-50 border-purple-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {sale.type === 'retail' ? (
                            <>
                              <ShoppingBag className="w-4 h-4 text-pink-600" />
                              Retail Sale
                            </>
                          ) : (
                            <>
                              <Calendar className="w-4 h-4 text-purple-600" />
                              Booking Checkout
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(sale.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="space-y-1 text-sm mb-3">
                        {sale.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-gray-700">
                            <span>
                              {item.name} × {item.quantity || 1}
                            </span>
                            <span className="font-medium">
                              {formatPrice(item.price * (item.quantity || 1))}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Payment:</span>
                          <span className="text-sm font-medium capitalize px-2 py-0.5 bg-white rounded">
                            {sale.method}
                          </span>
                          {sale.certificateUsed && (
                            <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                              🎁 Certificate
                            </span>
                          )}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(sale.total)}
                        </div>
                      </div>

                      {sale.certificateUsed && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                          <div className="font-medium text-yellow-900 mb-1">
                            Certificate Used: {sale.certificateUsed.code}
                          </div>
                          <div className="text-yellow-700">
                            Amount: {formatPrice(sale.certificateUsed.amountUsed)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Enhanced Checkout Modal for Bookings */}
      {showEnhancedCheckout && selectedBooking && (
        <EnhancedCheckoutModal
          isOpen={showEnhancedCheckout}
          onClose={() => {
            setShowEnhancedCheckout(false);
            setSelectedBooking(null);
          }}
          bookingId={selectedBooking.id}
          clientId={selectedBooking.clientId}
          clientName={selectedBooking.clientName}
          initialItems={[
            {
              id: selectedBooking.id,
              name: selectedBooking.serviceName,
              price: selectedBooking.servicePrice,
              type: 'service' as const,
              quantity: 1,
            },
          ]}
          onPaymentComplete={handleBookingPayment}
        />
      )}
    </div>
  );
}
