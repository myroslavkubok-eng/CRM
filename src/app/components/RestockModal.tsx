import { useState } from 'react';
import { X, Package, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    stock: number;
    image?: string;
  } | null;
  onRestock: (productId: string, quantity: number) => void;
}

export function RestockModal({ isOpen, onClose, product, onRestock }: RestockModalProps) {
  const [quantity, setQuantity] = useState('');
  const [isAdding, setIsAdding] = useState(true); // true = add, false = remove

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const qty = parseInt(quantity);
    
    if (!qty || qty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    const finalQuantity = isAdding ? qty : -qty;

    // Check if removing more than available
    if (!isAdding && qty > product.stock) {
      toast.error(`Cannot remove ${qty} items. Only ${product.stock} available.`);
      return;
    }

    onRestock(product.id, finalQuantity);
    
    // Reset form
    setQuantity('');
    setIsAdding(true);
    
    const message = isAdding 
      ? `Added ${qty} items to ${product.name}! 📦` 
      : `Removed ${qty} items from ${product.name}`;
    toast.success(message);
    
    onClose();
  };

  const handleClose = () => {
    setQuantity('');
    setIsAdding(true);
    onClose();
  };

  const newStock = isAdding 
    ? product.stock + parseInt(quantity || '0')
    : product.stock - parseInt(quantity || '0');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Manage Stock</h2>
                <p className="text-purple-100 text-sm">Update inventory levels</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">Current stock: <span className="font-semibold text-gray-900">{product.stock}</span></p>
            </div>
          </div>

          {/* Add/Remove Toggle */}
          <div>
            <Label className="text-gray-700 font-medium mb-2">Action</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isAdding
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Plus className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Add Stock</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  !isAdding
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Minus className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Remove Stock</span>
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <Label htmlFor="quantity" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              Quantity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="1"
              max={!isAdding ? product.stock : undefined}
              className="h-11"
              required
            />
            {!isAdding && parseInt(quantity || '0') > product.stock && (
              <p className="text-xs text-red-500 mt-1">
                ⚠️ Cannot remove more than available stock ({product.stock})
              </p>
            )}
          </div>

          {/* Preview */}
          {quantity && parseInt(quantity) > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">Current stock:</span>
                <span className="font-bold text-blue-900">{product.stock}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-blue-700">{isAdding ? 'Adding:' : 'Removing:'}</span>
                <span className={`font-bold ${isAdding ? 'text-green-600' : 'text-red-600'}`}>
                  {isAdding ? '+' : '-'}{quantity}
                </span>
              </div>
              <div className="h-px bg-blue-200 my-2"></div>
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">New stock:</span>
                <span className={`text-lg font-bold ${
                  newStock < 10 ? 'text-red-600' : 
                  newStock < 20 ? 'text-orange-600' : 
                  'text-green-600'
                }`}>
                  {newStock}
                </span>
              </div>
              {newStock < 10 && newStock >= 0 && (
                <p className="text-xs text-orange-600 mt-2">⚠️ Low stock warning</p>
              )}
              {newStock < 0 && (
                <p className="text-xs text-red-600 mt-2">❌ Stock cannot be negative</p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 h-11 ${
                isAdding
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
              } text-white`}
              disabled={newStock < 0}
            >
              {isAdding ? 'Add to Stock' : 'Remove from Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
