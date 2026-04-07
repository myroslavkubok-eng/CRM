import { useState, useEffect } from 'react';
import { X, Edit, DollarSign, Upload, Image as ImageIcon, Percent, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCurrency, CURRENCIES } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: EditableProduct | null;
  onSubmit: (product: EditableProduct) => void;
}

export interface EditableProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  currency?: string;
  discount: number;
  stock: number;
  description: string;
  image?: string;
}

export function EditProductModal({ isOpen, onClose, product, onSubmit }: EditProductModalProps) {
  const { currency, setCurrency, formatPrice } = useCurrency();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  // Populate form when product changes
  useEffect(() => {
    if (product && isOpen) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price.toString());
      setDiscount(product.discount?.toString() || '0');
      setDescription(product.description);
      setImagePreview(product.image || '');
      setHasImageChanged(false);
      
      if (product.currency) {
        const productCurrency = CURRENCIES.find(c => c.code === product.currency);
        if (productCurrency) setCurrency(productCurrency);
      }
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setImageFile(file);
      setHasImageChanged(true);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const discountValue = parseFloat(discount || '0');
    if (discountValue < 0 || discountValue > 100) {
      toast.error('Discount must be between 0 and 100');
      return;
    }

    const updatedProduct: EditableProduct = {
      id: product.id,
      name,
      category,
      price: parseFloat(price),
      currency: currency.code,
      discount: discountValue,
      stock: product.stock, // Keep current stock
      description,
      image: hasImageChanged ? imagePreview : product.image,
    };

    onSubmit(updatedProduct);
    
    toast.success('Product updated successfully! ✨');
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
    setHasImageChanged(true);
  };

  const originalPrice = parseFloat(price || '0');
  const discountAmount = originalPrice * (parseFloat(discount || '0') / 100);
  const finalPrice = originalPrice - discountAmount;
  const hasDiscount = parseFloat(discount || '0') > 0;

  const categories = [
    'Hair Care',
    'Skin Care',
    'Nail Care',
    'Makeup',
    'Tools & Equipment',
    'Spa & Wellness',
    'General'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Edit className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit Product</h2>
                <p className="text-purple-100 text-sm">Update product information and pricing</p>
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
          <div className="grid md:grid-cols-2 gap-5">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Image Upload */}
              <div>
                <Label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  Product Photo
                </Label>
                
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 right-2">
                      <label className="w-full bg-white/90 hover:bg-white text-gray-700 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-center gap-2 transition-colors">
                        <Upload className="w-3 h-3" />
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Click to upload image</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  Category <span className="text-red-500">*</span>
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Product Name */}
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hair Styling Gel"
                  className="h-11"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Price with Currency */}
              <div>
                <Label htmlFor="price" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  Original Price <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 25"
                      min="0"
                      step="0.01"
                      className="h-11"
                      required
                    />
                  </div>
                  <select
                    value={currency.code}
                    onChange={(e) => {
                      const selectedCurrency = CURRENCIES.find(c => c.code === e.target.value);
                      if (selectedCurrency) setCurrency(selectedCurrency);
                    }}
                    className="h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[120px]"
                  >
                    {CURRENCIES.map((cur) => (
                      <option key={cur.code} value={cur.code}>
                        {cur.flag} {cur.code} ({cur.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Discount */}
              <div>
                <Label htmlFor="discount" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-purple-600" />
                  Discount (%)
                </Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="e.g. 20"
                  min="0"
                  max="100"
                  step="1"
                  className="h-11"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty or 0 for no discount</p>
              </div>

              {/* Price Preview */}
              {price && parseFloat(price) > 0 && (
                <div className={`p-4 rounded-lg border-2 ${
                  hasDiscount ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="text-xs font-medium text-gray-500 mb-2">PRICE PREVIEW</div>
                  {hasDiscount ? (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                        <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                          -{discount}%
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(finalPrice)}
                      </div>
                      <div className="text-xs text-green-700 mt-1">
                        Save {formatPrice(discountAmount)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(originalPrice)}
                    </div>
                  )}
                </div>
              )}

              {/* Stock Info (Read-only) */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-medium">Current Stock:</span>
                  <span className="text-lg font-bold text-blue-900">{product.stock}</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">Use the stock button to manage inventory</p>
              </div>
            </div>
          </div>

          {/* Description (Full Width) */}
          <div>
            <Label htmlFor="description" className="text-gray-700 font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product details, benefits, ingredients, etc..."
              className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
          </div>

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
              className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
