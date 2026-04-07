import { useState } from 'react';
import { X, Upload, Image as ImageIcon, Percent, Zap, TrendingUp, Eye, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCurrency, CURRENCIES } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface ServicePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: NewServicePost) => void;
  salonName: string;
  salonAvatar?: string;
}

export interface NewServicePost {
  serviceName: string;
  serviceCategory: string;
  originalPrice: number;
  discount: number;
  currency: string;
  description: string;
  image: string;
  isLastMinute: boolean;
  isPromoted: boolean;
  duration: number;
}

export function ServicePostModal({ isOpen, onClose, onSubmit, salonName, salonAvatar }: ServicePostModalProps) {
  const { currency, setCurrency, formatPrice } = useCurrency();
  
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [duration, setDuration] = useState('60');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLastMinute, setIsLastMinute] = useState(false);
  const [isPromoted, setIsPromoted] = useState(false);

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

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !originalPrice || !serviceCategory || !description || !imagePreview) {
      toast.error('Please fill in all required fields');
      return;
    }

    const discountValue = parseFloat(discount || '0');
    if (discountValue < 0 || discountValue > 100) {
      toast.error('Discount must be between 0 and 100');
      return;
    }

    const newPost: NewServicePost = {
      serviceName,
      serviceCategory,
      originalPrice: parseFloat(originalPrice),
      discount: discountValue,
      currency: currency.code,
      description,
      image: imagePreview,
      isLastMinute,
      isPromoted,
      duration: parseInt(duration),
    };

    onSubmit(newPost);
    
    toast.success(isPromoted ? '🚀 Service promoted to main feed!' : '✨ Service posted successfully!');
    
    // Reset form
    setServiceName('');
    setServiceCategory('');
    setOriginalPrice('');
    setDiscount('');
    setDuration('60');
    setDescription('');
    setImagePreview('');
    setIsLastMinute(false);
    setIsPromoted(false);
    
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const removeImage = () => {
    setImagePreview('');
  };

  const price = parseFloat(originalPrice || '0');
  const discountAmount = price * (parseFloat(discount || '0') / 100);
  const finalPrice = price - discountAmount;
  const hasDiscount = parseFloat(discount || '0') > 0;

  const categories = [
    'Hair Styling',
    'Hair Coloring',
    'Manicure & Pedicure',
    'Facial Treatment',
    'Massage',
    'Makeup',
    'Waxing',
    'Eyelashes & Brows',
    'Spa Treatment'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Promote Service</h2>
                <p className="text-pink-100 text-sm">Share your service with the beauty community</p>
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Image & Preview */}
            <div className="space-y-5">
              {/* Image Upload */}
              <div>
                <Label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-pink-600" />
                  Service Photo <span className="text-red-500">*</span>
                </Label>
                
                {imagePreview ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
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
                  <label className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors">
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Click to upload service photo</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                    <span className="text-xs text-gray-500">High-quality photos get more bookings!</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Live Preview */}
              {imagePreview && serviceName && (
                <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-purple-900">FEED PREVIEW</span>
                  </div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Promoted Badge */}
                    {isPromoted && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 flex items-center gap-2 justify-center">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold">PROMOTED POST</span>
                      </div>
                    )}
                    
                    {/* Salon Info */}
                    <div className="p-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                        {salonAvatar || salonName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{salonName}</div>
                        <div className="text-xs text-gray-500">Just now</div>
                      </div>
                    </div>

                    {/* Image */}
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />

                    {/* Service Info */}
                    <div className="p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-sm flex-1">{serviceName}</h3>
                        <div className="flex gap-1">
                          {hasDiscount && (
                            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                              -{discount}%
                            </span>
                          )}
                          {isLastMinute && (
                            <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                              ⚡
                            </span>
                          )}
                        </div>
                      </div>
                      {hasDiscount ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 line-through">{formatPrice(price)}</span>
                          <span className="text-sm font-bold text-green-600">{formatPrice(finalPrice)}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-gray-900">{formatPrice(price)}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-5">
              {/* Service Name */}
              <div>
                <Label htmlFor="serviceName" className="text-gray-700 font-medium mb-2">
                  Service Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="serviceName"
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Balayage Hair Coloring"
                  className="h-11"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  Category <span className="text-red-500">*</span>
                </Label>
                <select
                  id="category"
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price & Currency */}
              <div>
                <Label htmlFor="price" className="text-gray-700 font-medium mb-2">
                  Price <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="price"
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 150"
                    min="0"
                    step="0.01"
                    className="h-11 flex-1"
                    required
                  />
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
                        {cur.flag} {cur.code}
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
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration" className="text-gray-700 font-medium mb-2">
                  Duration (minutes) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 60"
                  min="15"
                  step="15"
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
                  placeholder="Describe your service, what makes it special, what's included..."
                  className="w-full min-h-[80px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Options */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                {/* Last Minute */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isLastMinute}
                    onChange={(e) => setIsLastMinute(e.target.checked)}
                    className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="font-medium text-gray-900">Last Minute Booking</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Mark as urgent deal for today/tomorrow. Gets orange ⚡ badge.
                    </p>
                  </div>
                </label>

                {/* Promote to Feed */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isPromoted}
                    onChange={(e) => setIsPromoted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-gray-900">Promote to Main Feed</span>
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                        FEATURED
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Pin to top of main feed for maximum visibility! 🚀
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
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
              className="flex-1 h-11 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
            >
              {isPromoted ? '🚀 Promote to Feed' : '✨ Post Service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
