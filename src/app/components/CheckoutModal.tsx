import { useState } from 'react';
import { X, Plus, CreditCard, DollarSign, Link2, Search, Scissors, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  type: 'service' | 'product';
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  clientName: string;
  initialItems?: CheckoutItem[];
  onComplete: (paymentMethod: string, total: number) => void;
}

interface ServiceOrProduct {
  id: string;
  name: string;
  price: number;
  type: 'service' | 'product';
}

export function CheckoutModal({ 
  isOpen, 
  onClose, 
  orderId, 
  clientName,
  initialItems = [],
  onComplete 
}: CheckoutModalProps) {
  const { currency } = useCurrency();
  const [items, setItems] = useState<CheckoutItem[]>(initialItems);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'link'>('card');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [showAddItems, setShowAddItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');

  // Mock data - replace with real data from backend
  const availableServices: ServiceOrProduct[] = [
    { id: 's1', name: 'Conditioning Treatment', price: 25, type: 'service' },
    { id: 's2', name: 'Scalp Massage', price: 15, type: 'service' },
    { id: 's3', name: 'Beard Trim', price: 20, type: 'service' },
    { id: 's4', name: 'Eyebrow Shaping', price: 15, type: 'service' },
    { id: 's5', name: 'Nail Art', price: 10, type: 'service' },
    { id: 's6', name: 'Hair Mask', price: 30, type: 'service' },
    { id: 's7', name: 'Hot Towel Shave', price: 35, type: 'service' },
    { id: 's8', name: 'Face Scrub', price: 25, type: 'service' },
  ];

  const availableProducts: ServiceOrProduct[] = [
    { id: 'p1', name: 'Premium Shampoo', price: 30, type: 'product' },
    { id: 'p2', name: 'Hair Oil', price: 45, type: 'product' },
    { id: 'p3', name: 'Styling Gel', price: 20, type: 'product' },
    { id: 'p4', name: 'Face Cream', price: 55, type: 'product' },
    { id: 'p5', name: 'Beard Oil', price: 25, type: 'product' },
    { id: 'p6', name: 'Hairspray', price: 18, type: 'product' },
    { id: 'p7', name: 'Matte Clay', price: 22, type: 'product' },
    { id: 'p8', name: 'Comb Set', price: 15, type: 'product' },
  ];

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  
  const discountAmount = discountType === 'percent' 
    ? (subtotal * discountValue) / 100 
    : discountValue;
  
  const total = Math.max(0, subtotal - discountAmount);

  const handleAddItem = (item: ServiceOrProduct) => {
    setItems([...items, { ...item }]);
    setShowAddItems(false);
    setSearchQuery('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCharge = () => {
    onComplete(paymentMethod, total);
    onClose();
  };

  const filteredItems = (activeTab === 'services' ? availableServices : availableProducts)
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            <p className="text-sm text-gray-500">Complete payment for {clientName}'s visit.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Order #{orderId}</span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Services & Products Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              SERVICES & PRODUCTS
            </h3>

            {/* Items List */}
            <div className="space-y-2 mb-3">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-900">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      {currency.symbol}{item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Service / Product Button */}
            <button
              onClick={() => setShowAddItems(!showAddItems)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-gray-700 hover:text-purple-600"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Service / Product</span>
            </button>

            {/* Add Items Dropdown */}
            {showAddItems && (
              <Card className="mt-3 p-4 border-2 border-purple-200 animate-in slide-in-from-top-2">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services or products..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                  />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab('services')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                      activeTab === 'services'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Scissors className="w-4 h-4" />
                    Services
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                      activeTab === 'products'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Products
                  </button>
                </div>

                {/* Items List */}
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAddItem(item)}
                      className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-lg transition-colors text-left"
                    >
                      <span className="text-gray-900 font-medium">{item.name}</span>
                      <span className="text-gray-600">{currency.symbol}{item.price}</span>
                    </button>
                  ))}
                  {filteredItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No {activeTab} found</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Payment Method & Discount */}
          <div className="grid grid-cols-2 gap-6">
            {/* Payment Method */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Method</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 mx-auto mb-1 ${
                    paymentMethod === 'card' ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <div className={`text-xs font-medium ${
                    paymentMethod === 'card' ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    Card
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <DollarSign className={`w-6 h-6 mx-auto mb-1 ${
                    paymentMethod === 'cash' ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <div className={`text-xs font-medium ${
                    paymentMethod === 'cash' ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    Cash
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('link')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'link'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Link2 className={`w-6 h-6 mx-auto mb-1 ${
                    paymentMethod === 'link' ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <div className={`text-xs font-medium ${
                    paymentMethod === 'link' ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    Link
                  </div>
                </button>
              </div>
            </div>

            {/* Discount */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Discount</h3>
              <div className="flex gap-2">
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => setDiscountType('percent')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      discountType === 'percent'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    %
                  </button>
                  <button
                    onClick={() => setDiscountType('amount')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      discountType === 'amount'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {currency.symbol}
                  </button>
                </div>
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    {discountType === 'percent' ? '%' : currency.symbol}
                  </span>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                    placeholder="0"
                    min="0"
                    max={discountType === 'percent' ? 100 : subtotal}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold">{currency.symbol}{subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discountType === 'percent' ? `${discountValue}%` : `${currency.symbol}${discountValue}`})</span>
                <span className="font-semibold">-{currency.symbol}{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-xl font-bold text-gray-900">Total To Pay</span>
              <span className="text-3xl font-bold text-purple-600">
                {currency.symbol}{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-end gap-3 flex-shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCharge}
            disabled={items.length === 0}
            className="px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Charge {currency.symbol}{total.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
