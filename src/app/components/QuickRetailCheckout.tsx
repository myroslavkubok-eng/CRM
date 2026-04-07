import { useState } from 'react';
import { ShoppingBag, Gift, Search, User, Sparkles, Plus, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

interface QuickRetailCheckoutProps {
  salonId: string;
  products: Product[];
  onCheckoutComplete: (sale: {
    items: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
    total: number;
    paymentMethod: 'card' | 'cash' | 'link';
    certificateUsed?: {
      code: string;
      amount: number;
    };
    clientId?: string;
  }) => void;
}

export function QuickRetailCheckout({
  salonId,
  products,
  onCheckoutComplete,
}: QuickRetailCheckoutProps) {
  const { formatPrice } = useCurrency();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<Map<string, { product: Product; quantity: number }>>(new Map());
  const [clientPhone, setClientPhone] = useState('');
  const [certificateCode, setCertificateCode] = useState('');
  const [certificateApplied, setCertificateApplied] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'link'>('cash');
  const [showProducts, setShowProducts] = useState(false);

  // Filter products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const subtotal = Array.from(cart.values()).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const certificateAmount = certificateApplied?.isValid 
    ? Math.min(certificateApplied.currentBalance, subtotal) 
    : 0;

  const totalToPay = subtotal - certificateAmount;

  // Add to cart
  const addToCart = (product: Product) => {
    const newCart = new Map(cart);
    const existing = newCart.get(product.id);
    
    if (existing) {
      if (existing.quantity < product.stock) {
        newCart.set(product.id, {
          product,
          quantity: existing.quantity + 1,
        });
      } else {
        toast.error('Not enough stock');
        return;
      }
    } else {
      newCart.set(product.id, { product, quantity: 1 });
    }
    
    setCart(newCart);
    toast.success(`Added ${product.name}`);
  };

  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    const newCart = new Map(cart);
    const item = newCart.get(productId);
    
    if (item) {
      if (quantity <= 0) {
        newCart.delete(productId);
      } else if (quantity <= item.product.stock) {
        newCart.set(productId, { ...item, quantity });
      } else {
        toast.error('Not enough stock');
        return;
      }
    }
    
    setCart(newCart);
  };

  // Check certificate
  const handleCheckCertificate = async () => {
    if (!certificateCode.trim()) {
      toast.error('Enter certificate code');
      return;
    }

    try {
      const response = await fetch('/api/certificates/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: certificateCode,
          salonId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCertificateApplied(data.certificate);
        toast.success(`Certificate applied! Balance: ${formatPrice(data.certificate.currentBalance)}`);
      } else {
        toast.error(data.error || 'Invalid certificate');
      }
    } catch (error) {
      toast.error('Failed to check certificate');
    }
  };

  // Complete sale
  const handleCompleteSale = async () => {
    if (cart.size === 0) {
      toast.error('Cart is empty');
      return;
    }

    const items = Array.from(cart.values()).map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    onCheckoutComplete({
      items,
      total: totalToPay,
      paymentMethod,
      certificateUsed: certificateApplied?.isValid ? {
        code: certificateCode,
        amount: certificateAmount,
      } : undefined,
      clientId: clientPhone ? undefined : undefined, // TODO: lookup by phone
    });

    // Reset
    setCart(new Map());
    setCertificateCode('');
    setCertificateApplied(null);
    setClientPhone('');
    setShowProducts(false);
    
    toast.success('Sale completed! 🎉');
  };

  return (
    <div className="bg-white border-b-2 border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Quick Retail Checkout</h3>
              <p className="text-xs text-gray-600">Sell products without booking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Cart summary */}
            {cart.size > 0 && (
              <div className="px-4 py-2 bg-white rounded-lg border-2 border-purple-200 flex items-center gap-3">
                <div className="text-sm">
                  <span className="text-gray-600">Cart:</span>
                  <span className="font-bold text-purple-600 ml-2">
                    {Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0)} items
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-purple-600 ml-2">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            )}

            {/* Toggle button */}
            <Button
              onClick={() => setShowProducts(!showProducts)}
              className={`gap-2 ${
                showProducts
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {showProducts ? 'Hide Products' : 'Sell Products'}
              {cart.size > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-purple-500 text-white rounded-full text-xs font-bold">
                  {cart.size}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Expandable content */}
      {showProducts && (
        <div className="p-4 space-y-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            {/* Left: Products */}
            <div className="col-span-2 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 h-12"
                />
              </div>

              {/* Products grid */}
              <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto bg-white p-3 rounded-lg border border-gray-200">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      product.stock === 0
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-purple-400 hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-2 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-600 truncate mb-1">
                      {product.category}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Cart & Checkout */}
            <div className="space-y-3">
              {/* Client info */}
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Client (Optional)</span>
                </div>
                <Input
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Phone number"
                  className="h-10"
                />
              </Card>

              {/* Cart */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Cart Items</span>
                  {cart.size > 0 && (
                    <button
                      onClick={() => setCart(new Map())}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {cart.size === 0 ? (
                    <div className="text-center py-8 text-sm text-gray-500">
                      Cart is empty
                    </div>
                  ) : (
                    Array.from(cart.values()).map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {formatPrice(product.price)} × {quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-6 h-6 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-6 h-6 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-sm font-bold text-gray-900 w-20 text-right">
                          {formatPrice(product.price * quantity)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Certificate */}
              {cart.size > 0 && (
                <Card className="p-3 bg-gradient-to-r from-yellow-50 to-pink-50 border-2 border-yellow-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-semibold text-gray-900">Gift Certificate</span>
                  </div>

                  {!certificateApplied ? (
                    <div className="flex gap-2">
                      <Input
                        value={certificateCode}
                        onChange={(e) => setCertificateCode(e.target.value.toUpperCase())}
                        placeholder="Code"
                        className="flex-1 h-9 text-sm uppercase font-mono"
                        maxLength={12}
                      />
                      <Button
                        onClick={handleCheckCertificate}
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white h-9"
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-2 bg-white rounded border border-green-200">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-green-900">✅ Applied</span>
                          <button
                            onClick={() => {
                              setCertificateApplied(null);
                              setCertificateCode('');
                            }}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-xs space-y-0.5">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Code:</span>
                            <span className="font-mono font-semibold">{certificateCode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Balance:</span>
                            <span className="font-semibold text-green-600">
                              {formatPrice(certificateApplied.currentBalance)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Using:</span>
                            <span className="font-bold text-green-600">
                              {formatPrice(certificateAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Payment method */}
              {cart.size > 0 && (
                <Card className="p-3">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Payment Method</div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['card', 'cash', 'link'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-2 rounded border-2 transition-all capitalize text-xs font-medium ${
                          paymentMethod === method
                            ? 'border-purple-600 bg-purple-50 text-purple-600'
                            : 'border-gray-300 text-gray-600 hover:border-purple-300'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Totals & Checkout */}
              {cart.size > 0 && (
                <Card className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    {certificateAmount > 0 && (
                      <div className="flex items-center justify-between text-sm text-yellow-200">
                        <span>Certificate:</span>
                        <span className="font-semibold">-{formatPrice(certificateAmount)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-white/30">
                      <span>Total:</span>
                      <span>{formatPrice(totalToPay)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCompleteSale}
                    className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold h-12"
                  >
                    {totalToPay === 0 ? '✅ Complete (Paid with Certificate)' : `💳 Charge ${formatPrice(totalToPay)}`}
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
