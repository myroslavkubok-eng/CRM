import { useState } from 'react';
import { X, Package, DollarSign, Upload, Image as ImageIcon, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCurrency, CURRENCIES } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: NewProduct) => void;
}

export interface NewProduct {
  name: string;
  price: number;
  currency: string;
  description: string;
  stock: number;
  image?: string;
}

export function AddProductModal({ isOpen, onClose, onSubmit }: AddProductModalProps) {
  const { currency, setCurrency, formatPrice } = useCurrency();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (!isOpen) return null;

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
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newProduct: NewProduct = {
      name,
      price: parseFloat(price),
      currency: currency.code,
      description,
      stock: parseInt(stock),
      image: imagePreview,
    };

    onSubmit(newProduct);
    
    // Reset form
    setName('');
    setPrice('');
    setDescription('');
    setStock('');
    setImagePreview('');
    setImageFile(null);
    
    toast.success('Product added successfully! 🎉');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setPrice('');
    setDescription('');
    setStock('');
    setImagePreview('');
    setImageFile(null);
    onClose();
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New Product</h2>
                <p className="text-purple-100 text-sm">Add a new product to your inventory</p>
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
            <p className="text-xs text-gray-500 mt-1">Optional: Add a product image</p>
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

          {/* Price with Currency Selector */}
          <div>
            <Label htmlFor="price" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Price <span className="text-red-500">*</span>
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
            {price && (
              <p className="text-xs text-gray-500 mt-1">
                Preview: {formatPrice(parseFloat(price))}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <Label htmlFor="stock" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4 text-purple-600" />
              Stock <span className="text-red-500">*</span>
            </Label>
            <Input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 100"
              min="0"
              className="h-11"
              required
            />
          </div>

          {/* Description */}
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
            <p className="text-xs text-gray-500 mt-1">Add detailed information about this product</p>
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
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}