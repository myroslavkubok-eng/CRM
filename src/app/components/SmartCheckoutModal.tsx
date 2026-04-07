import { useState, useEffect } from 'react';
import { X, Plus, CreditCard, DollarSign, Link as LinkIcon, Percent, CheckCircle, AlertCircle, Clock, Receipt, Gift, Sparkles, ShoppingBag, Scissors } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useCurrency } from '../../contexts/CurrencyContext';

interface PaymentInfo {
  depositPaid: boolean;
  depositAmount: number;
  depositMethod: 'card' | 'cash' | 'link';
  depositPaidAt?: Date;
  depositTransactionId?: string;
  
  fullPaymentPaid: boolean;
  totalPaid: number;
  
  remainingAmount: number;
  
  paymentHistory: {
    id: string;
    amount: number;
    method: 'card' | 'cash' | 'link';
    type: 'deposit' | 'full_payment' | 'partial_payment';
    paidAt: Date;
    transactionId?: string;
    note?: string;
  }[];
}

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

interface SmartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  // Booking info
  bookingId: string;
  clientId: string;
  clientName: string;
  
  // Services
  services: ServiceItem[];
  onAddService?: () => void;
  
  // Payment
  onPaymentComplete: (payment: {
    method: 'card' | 'cash' | 'link';
    amount: number;
    discount?: number;
  }) => void;
}

export function SmartCheckoutModal({
  isOpen,
  onClose,
  bookingId,
  clientId,
  clientName,
  services,
  onAddService,
  onPaymentComplete,
}: SmartCheckoutModalProps) {
  const { formatPrice, currency } = useCurrency();
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'cash' | 'link'>('card');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [discountValue, setDiscountValue] = useState(0);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  
  // Calculate totals
  const subtotal = services.reduce((sum, s) => sum + s.price * (s.quantity || 1), 0);
  const discountAmount = discountType === 'percent' 
    ? (subtotal * discountValue) / 100 
    : discountValue;
  const totalToPay = subtotal - discountAmount;

  // Fetch payment info when modal opens
  useEffect(() => {
    if (isOpen && bookingId) {
      fetchPaymentInfo();
    }
  }, [isOpen, bookingId]);

  const fetchPaymentInfo = async () => {
    setLoading(true);
    try {
      // Fetch from backend
      const response = await fetch(`/api/bookings/${bookingId}/payment-info`);
      const data = await response.json();
      
      setPaymentInfo(data.paymentInfo);
    } catch (error) {
      console.error('Error fetching payment info:', error);
      toast.error('Failed to load payment information');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    const amountToPay = paymentInfo?.remainingAmount || totalToPay;

    // Validate
    if (amountToPay <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    // Process payment
    onPaymentComplete({
      method: selectedMethod,
      amount: amountToPay,
      discount: discountAmount > 0 ? discountAmount : undefined,
    });

    toast.success('Payment processed successfully! ✅');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            <p className="text-sm text-gray-600">
              Complete payment for {clientName}'s visit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Order #{bookingId.slice(-6)}</span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment Status Alert */}
          {loading ? (
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="animate-pulse">Loading payment information...</div>
            </div>
          ) : paymentInfo ? (
            <div className="space-y-3">
              {/* Deposit Status */}
              {paymentInfo.depositPaid && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-green-900 mb-1">
                        ✅ Deposit Paid
                      </div>
                      <div className="text-sm text-green-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Amount:</span>
                          <span className="font-semibold">{formatPrice(paymentInfo.depositAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Method:</span>
                          <span className="font-semibold capitalize">{paymentInfo.depositMethod}</span>
                        </div>
                        {paymentInfo.depositPaidAt && (
                          <div className="flex items-center justify-between">
                            <span>Paid at:</span>
                            <span className="text-xs">
                              {new Date(paymentInfo.depositPaidAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {paymentInfo.depositTransactionId && (
                          <div className="text-xs text-green-700 mt-1">
                            Transaction: {paymentInfo.depositTransactionId}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Payment Status */}
              {paymentInfo.fullPaymentPaid ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-blue-900 mb-1">
                        ✅ Fully Paid
                      </div>
                      <div className="text-sm text-blue-800">
                        <div className="flex items-center justify-between">
                          <span>Total paid:</span>
                          <span className="font-bold text-lg">{formatPrice(paymentInfo.totalPaid)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-orange-900 mb-1">
                        ⏳ Payment Pending
                      </div>
                      <div className="text-sm text-orange-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Already paid:</span>
                          <span className="font-semibold">{formatPrice(paymentInfo.totalPaid)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Remaining:</span>
                          <span className="font-bold text-lg text-orange-600">
                            {formatPrice(paymentInfo.remainingAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment History Button */}
              {paymentInfo.paymentHistory.length > 0 && (
                <button
                  onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                  className="w-full p-3 text-left text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    View Payment History ({paymentInfo.paymentHistory.length} transactions)
                  </span>
                  <span>{showPaymentHistory ? '▲' : '▼'}</span>
                </button>
              )}

              {/* Payment History */}
              {showPaymentHistory && paymentInfo.paymentHistory.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="font-semibold text-gray-900 mb-2">Payment History</div>
                  {paymentInfo.paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-3 bg-white rounded border border-gray-200 text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">
                          {formatPrice(payment.amount)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(payment.paidAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="capitalize">{payment.method}</span>
                        <span>•</span>
                        <span className="capitalize">{payment.type.replace('_', ' ')}</span>
                      </div>
                      {payment.transactionId && (
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {payment.transactionId}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  No payment information available. This is a new booking.
                </div>
              </div>
            </div>
          )}

          {/* Services & Products */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">SERVICES & PRODUCTS</h3>
            <div className="space-y-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600 font-bold">
                      {service.quantity || 1}
                    </div>
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(service.price * (service.quantity || 1))}
                  </span>
                </div>
              ))}

              {onAddService && (
                <button
                  onClick={onAddService}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Service / Product
                </button>
              )}
            </div>
          </div>

          {/* Payment Method & Discount */}
          <div className="grid grid-cols-2 gap-4">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedMethod('card')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    selectedMethod === 'card'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${
                    selectedMethod === 'card' ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedMethod === 'card' ? 'text-purple-600' : 'text-gray-700'
                  }`}>
                    Card
                  </span>
                </button>

                <button
                  onClick={() => setSelectedMethod('cash')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    selectedMethod === 'cash'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <DollarSign className={`w-6 h-6 ${
                    selectedMethod === 'cash' ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedMethod === 'cash' ? 'text-purple-600' : 'text-gray-700'
                  }`}>
                    Cash
                  </span>
                </button>

                <button
                  onClick={() => setSelectedMethod('link')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    selectedMethod === 'link'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <LinkIcon className={`w-6 h-6 ${
                    selectedMethod === 'link' ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedMethod === 'link' ? 'text-purple-600' : 'text-gray-700'
                  }`}>
                    Link
                  </span>
                </button>
              </div>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Discount
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDiscountType('percent')}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all ${
                    discountType === 'percent'
                      ? 'border-purple-600 bg-purple-600 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  <Percent className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDiscountType('amount')}
                  className={`flex-shrink-0 px-4 h-12 rounded-lg flex items-center justify-center border-2 transition-all font-semibold ${
                    discountType === 'amount'
                      ? 'border-purple-600 bg-purple-600 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  {currency}
                </button>
                <Input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  placeholder="0"
                  className="flex-1 h-12 text-center text-lg font-semibold"
                  min="0"
                  max={discountType === 'percent' ? 100 : subtotal}
                />
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <span>Discount ({discountType === 'percent' ? `${discountValue}%` : formatPrice(discountValue)})</span>
                <span className="font-semibold">-{formatPrice(discountAmount)}</span>
              </div>
            )}

            {paymentInfo && paymentInfo.totalPaid > 0 && (
              <div className="flex items-center justify-between text-blue-600">
                <span>Already Paid</span>
                <span className="font-semibold">-{formatPrice(paymentInfo.totalPaid)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-2xl font-bold pt-3 border-t border-gray-200">
              <span className="text-gray-900">Total To Pay</span>
              <span className="text-purple-600">
                {formatPrice(
                  paymentInfo?.remainingAmount !== undefined 
                    ? paymentInfo.remainingAmount 
                    : totalToPay
                )}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={
                paymentInfo?.fullPaymentPaid ||
                (paymentInfo?.remainingAmount !== undefined && paymentInfo.remainingAmount <= 0)
              }
              className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold"
            >
              {paymentInfo?.fullPaymentPaid 
                ? '✅ Already Paid' 
                : `Charge ${formatPrice(
                    paymentInfo?.remainingAmount !== undefined 
                      ? paymentInfo.remainingAmount 
                      : totalToPay
                  )}`
              }
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}