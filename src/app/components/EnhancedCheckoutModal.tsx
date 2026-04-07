import { useState, useEffect } from 'react';
import { X, Plus, CreditCard, DollarSign, Link as LinkIcon, Percent, CheckCircle, AlertCircle, Gift, Sparkles, ShoppingBag, Scissors, Trash2, Info } from 'lucide-react';
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

interface GiftCertificate {
  code: string;
  originalAmount: number;
  currentBalance: number;
  expiresAt?: Date;
  isValid: boolean;
  errorMessage?: string;
}

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  type: 'service' | 'product';
  category?: string;
}

interface EnhancedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  // Booking info
  bookingId: string;
  clientId: string;
  clientName: string;
  
  // Items (services + products)
  initialItems?: ServiceItem[];
  
  // Callbacks
  onPaymentComplete: (payment: {
    method: 'card' | 'cash' | 'link';
    amount: number;
    discount?: number;
    certificateUsed?: {
      code: string;
      amountUsed: number;
      remainingBalance: number;
    };
    items: ServiceItem[];
  }) => void;
}

export function EnhancedCheckoutModal({
  isOpen,
  onClose,
  bookingId,
  clientId,
  clientName,
  initialItems = [],
  onPaymentComplete,
}: EnhancedCheckoutModalProps) {
  const { formatPrice, currency } = useCurrency();
  
  // Payment state
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'cash' | 'link'>('card');
  
  // Items state
  const [items, setItems] = useState<ServiceItem[]>(initialItems);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  
  // Discount state
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [discountValue, setDiscountValue] = useState(0);
  
  // Gift Certificate state
  const [certificateCode, setCertificateCode] = useState('');
  const [certificate, setCertificate] = useState<GiftCertificate | null>(null);
  const [checkingCertificate, setCheckingCertificate] = useState(false);

  // Calculate totals
  const servicesSubtotal = items
    .filter(i => i.type === 'service')
    .reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
  
  const productsSubtotal = items
    .filter(i => i.type === 'product')
    .reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
  
  const subtotal = servicesSubtotal + productsSubtotal;
  
  const discountAmount = discountType === 'percent' 
    ? (subtotal * discountValue) / 100 
    : discountValue;
  
  const afterDiscount = subtotal - discountAmount;
  
  const certificateApplied = certificate?.isValid ? Math.min(certificate.currentBalance, afterDiscount) : 0;
  
  const totalToPay = Math.max(0, afterDiscount - certificateApplied);

  // Fetch payment info
  useEffect(() => {
    if (isOpen && bookingId) {
      fetchPaymentInfo();
    }
  }, [isOpen, bookingId]);

  const fetchPaymentInfo = async () => {
    setLoading(true);
    try {
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

  // Check gift certificate
  const handleCheckCertificate = async () => {
    if (!certificateCode.trim()) {
      toast.error('Please enter certificate code');
      return;
    }

    setCheckingCertificate(true);
    
    try {
      const response = await fetch(`/api/certificates/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: certificateCode,
          clientId,
          salonId: 'salon-id', // TODO: Get from context
        }),
      });

      const data = await response.json();

      if (data.success && data.certificate) {
        setCertificate(data.certificate);
        toast.success(`✅ Certificate applied! Balance: ${formatPrice(data.certificate.currentBalance)}`);
      } else {
        setCertificate({
          code: certificateCode,
          originalAmount: 0,
          currentBalance: 0,
          isValid: false,
          errorMessage: data.error || 'Invalid certificate code',
        });
        toast.error(data.error || 'Invalid certificate code');
      }
    } catch (error) {
      console.error('Error checking certificate:', error);
      toast.error('Failed to check certificate');
    } finally {
      setCheckingCertificate(false);
    }
  };

  // Remove certificate
  const handleRemoveCertificate = () => {
    setCertificate(null);
    setCertificateCode('');
    toast.info('Certificate removed');
  };

  // Add item
  const handleAddItem = (item: ServiceItem) => {
    setItems(prev => [...prev, item]);
    setShowAddItemModal(false);
  };

  // Remove item
  const handleRemoveItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Update quantity
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
    ));
  };

  // Complete payment
  const handlePayment = async () => {
    if (items.length === 0) {
      toast.error('Please add at least one service or product');
      return;
    }

    if (totalToPay < 0) {
      toast.error('Invalid total amount');
      return;
    }

    // Process payment
    onPaymentComplete({
      method: selectedMethod,
      amount: totalToPay,
      discount: discountAmount > 0 ? discountAmount : undefined,
      certificateUsed: certificate?.isValid ? {
        code: certificate.code,
        amountUsed: certificateApplied,
        remainingBalance: certificate.currentBalance - certificateApplied,
      } : undefined,
      items,
    });

    toast.success('Payment completed! ✅');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            <p className="text-sm text-gray-600">
              Complete payment for {clientName}'s visit.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment Status */}
          {!loading && paymentInfo && paymentInfo.depositPaid && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-green-900 mb-1">
                    ✅ Deposit Paid: {formatPrice(paymentInfo.depositAmount)}
                  </div>
                  <div className="text-sm text-green-800">
                    Method: {paymentInfo.depositMethod} • {paymentInfo.depositPaidAt && new Date(paymentInfo.depositPaidAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                SERVICES ({items.filter(i => i.type === 'service').length})
              </h3>
              <span className="text-sm font-semibold text-gray-900">
                {formatPrice(servicesSubtotal)}
              </span>
            </div>
            <div className="space-y-2">
              {items.filter(i => i.type === 'service').map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center text-white font-bold">
                      <Scissors className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.category && (
                        <div className="text-xs text-gray-600">{item.category}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-2 py-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="text-gray-600 hover:text-gray-900 font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity || 1}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="text-gray-600 hover:text-gray-900 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-gray-900 w-24 text-right">
                      {formatPrice(item.price * (item.quantity || 1))}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {items.filter(i => i.type === 'service').length === 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No services added yet
                </div>
              )}
            </div>
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                PRODUCTS ({items.filter(i => i.type === 'product').length})
              </h3>
              <span className="text-sm font-semibold text-gray-900">
                {formatPrice(productsSubtotal)}
              </span>
            </div>
            <div className="space-y-2">
              {items.filter(i => i.type === 'product').map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-pink-50 border border-pink-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-10 h-10 bg-pink-600 rounded flex items-center justify-center text-white font-bold">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.category && (
                        <div className="text-xs text-gray-600">{item.category}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-2 py-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="text-gray-600 hover:text-gray-900 font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity || 1}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="text-gray-600 hover:text-gray-900 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-gray-900 w-24 text-right">
                      {formatPrice(item.price * (item.quantity || 1))}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {items.filter(i => i.type === 'product').length === 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No products added yet
                </div>
              )}
            </div>
          </div>

          {/* Add Service/Product Button */}
          <button
            onClick={() => setShowAddItemModal(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Service or Product
          </button>

          {/* Gift Certificate */}
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-pink-50 border-2 border-dashed border-yellow-300 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Gift Certificate</h3>
            </div>
            
            {!certificate ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={certificateCode}
                    onChange={(e) => setCertificateCode(e.target.value.toUpperCase())}
                    placeholder="Enter certificate code"
                    className="flex-1 uppercase font-mono"
                    maxLength={12}
                  />
                  <Button
                    onClick={handleCheckCertificate}
                    disabled={!certificateCode.trim() || checkingCertificate}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    {checkingCertificate ? 'Checking...' : 'Apply'}
                  </Button>
                </div>
                <div className="text-xs text-gray-600 flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Enter your gift certificate code to apply the balance to this purchase.
                  </span>
                </div>
              </div>
            ) : certificate.isValid ? (
              <div className="space-y-3">
                <div className="p-3 bg-white border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-green-900">✅ Certificate Applied</span>
                    <button
                      onClick={handleRemoveCertificate}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Code:</span>
                      <span className="font-mono font-semibold">{certificate.code}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Original Balance:</span>
                      <span className="font-semibold">{formatPrice(certificate.originalAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Balance:</span>
                      <span className="font-semibold text-green-600">{formatPrice(certificate.currentBalance)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Will be used:</span>
                      <span className="font-bold text-green-600">{formatPrice(certificateApplied)}</span>
                    </div>
                    {certificateApplied < certificate.currentBalance && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Remaining after:</span>
                        <span className="font-semibold text-blue-600">
                          {formatPrice(certificate.currentBalance - certificateApplied)}
                        </span>
                      </div>
                    )}
                    {certificate.expiresAt && (
                      <div className="text-xs text-gray-500 mt-2">
                        Expires: {new Date(certificate.expiresAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                
                {certificate.currentBalance - certificateApplied > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold mb-1">Balance Saved!</div>
                        <div>
                          You'll have <span className="font-bold">{formatPrice(certificate.currentBalance - certificateApplied)}</span> remaining 
                          on your certificate for your next visit.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-red-900">❌ Invalid Certificate</span>
                  <button
                    onClick={handleRemoveCertificate}
                    className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
                <div className="text-sm text-red-800">
                  {certificate.errorMessage}
                </div>
              </div>
            )}
          </div>

          {/* Payment Method & Discount */}
          <div className="grid grid-cols-2 gap-4">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['card', 'cash', 'link'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      selectedMethod === method
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {method === 'card' && <CreditCard className={`w-6 h-6 ${selectedMethod === method ? 'text-purple-600' : 'text-gray-600'}`} />}
                    {method === 'cash' && <DollarSign className={`w-6 h-6 ${selectedMethod === method ? 'text-purple-600' : 'text-gray-600'}`} />}
                    {method === 'link' && <LinkIcon className={`w-6 h-6 ${selectedMethod === method ? 'text-purple-600' : 'text-gray-600'}`} />}
                    <span className={`text-sm font-medium capitalize ${selectedMethod === method ? 'text-purple-600' : 'text-gray-700'}`}>
                      {method}
                    </span>
                  </button>
                ))}
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
          <div className="space-y-3 pt-4 border-t-2 border-gray-200">
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

            {certificateApplied > 0 && (
              <div className="flex items-center justify-between text-yellow-600">
                <span className="flex items-center gap-1">
                  <Gift className="w-4 h-4" />
                  Gift Certificate
                </span>
                <span className="font-semibold">-{formatPrice(certificateApplied)}</span>
              </div>
            )}

            {paymentInfo && paymentInfo.totalPaid > 0 && (
              <div className="flex items-center justify-between text-blue-600">
                <span>Already Paid</span>
                <span className="font-semibold">-{formatPrice(paymentInfo.totalPaid)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-2xl font-bold pt-3 border-t-2 border-gray-200">
              <span className="text-gray-900">Total To Pay</span>
              <span className="text-purple-600">
                {formatPrice(totalToPay)}
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
              disabled={items.length === 0 || totalToPay < 0}
              className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold"
            >
              {totalToPay === 0 
                ? '✅ Complete (Fully Paid)' 
                : `Charge ${formatPrice(totalToPay)}`
              }
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Item Modal (placeholder) */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add Service or Product</h3>
            <p className="text-sm text-gray-600 mb-4">
              This would open a modal to select from available services and products.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddItemModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Example: Add a demo item
                  handleAddItem({
                    id: `item-${Date.now()}`,
                    name: 'Demo Product',
                    price: 50,
                    quantity: 1,
                    type: 'product',
                    category: 'Hair Care',
                  });
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Add Item
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
