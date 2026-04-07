import React, { useState, useEffect } from 'react';
import { X, Gift, Plus, Trash2, Percent, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useServices, type Service } from '../../contexts/ServicesContext';

export interface NewPackage {
  name: string;
  description: string;
  services: { serviceId: string; quantity: number }[];
  discountType: 'percentage' | 'amount';
  discountValue: number;
  validityDays: number;
}

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (packageData: NewPackage) => void;
}

export function AddPackageModal({ isOpen, onClose, onSubmit }: AddPackageModalProps) {
  const { formatPrice, convertPrice } = useCurrency();
  const { services } = useServices();

  const [packageName, setPackageName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedServices, setSelectedServices] = useState<{ serviceId: string; quantity: number }[]>([]);
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [validityDays, setValidityDays] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))];

  // Filter services by category
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  // Calculate original total price
  const calculateOriginalPrice = (): number => {
    return selectedServices.reduce((total, item) => {
      const service = services.find(s => s.id === item.serviceId);
      return total + (service ? service.price * item.quantity : 0);
    }, 0);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (): number => {
    const originalPrice = calculateOriginalPrice();
    if (discountType === 'percentage') {
      return originalPrice * (1 - discountValue / 100);
    } else {
      return Math.max(0, originalPrice - discountValue);
    }
  };

  // Calculate actual discount percentage
  const calculateActualDiscount = (): number => {
    const original = calculateOriginalPrice();
    const discounted = calculateDiscountedPrice();
    if (original === 0) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  // Add service to package
  const handleAddService = (serviceId: string) => {
    const exists = selectedServices.find(s => s.serviceId === serviceId);
    if (exists) {
      setSelectedServices(
        selectedServices.map(s => 
          s.serviceId === serviceId 
            ? { ...s, quantity: s.quantity + 1 } 
            : s
        )
      );
    } else {
      setSelectedServices([...selectedServices, { serviceId, quantity: 1 }]);
    }
  };

  // Update service quantity
  const handleUpdateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedServices(selectedServices.filter(s => s.serviceId !== serviceId));
    } else {
      setSelectedServices(
        selectedServices.map(s => 
          s.serviceId === serviceId 
            ? { ...s, quantity } 
            : s
        )
      );
    }
  };

  // Remove service from package
  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.serviceId !== serviceId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!packageName || selectedServices.length === 0) {
      alert('Please fill in package name and select at least one service');
      return;
    }

    const newPackage: NewPackage = {
      name: packageName,
      description,
      services: selectedServices,
      discountType,
      discountValue,
      validityDays,
    };

    onSubmit(newPackage);
    handleClose();
  };

  const handleClose = () => {
    setPackageName('');
    setDescription('');
    setSelectedServices([]);
    setDiscountType('percentage');
    setDiscountValue(0);
    setValidityDays(30);
    setSelectedCategory('all');
    onClose();
  };

  if (!isOpen) return null;

  const originalPrice = calculateOriginalPrice();
  const discountedPrice = calculateDiscountedPrice();
  const actualDiscount = calculateActualDiscount();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Add New Package</h2>
              <p className="text-sm text-purple-100">Create a package deal for your salon</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Package Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Package Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="e.g. Manicure + Pedicure Bundle"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the package details..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Add more details about this package</p>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Select Services */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Services <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="grid gap-3">
                {filteredServices.map(service => {
                  const isSelected = selectedServices.find(s => s.serviceId === service.id);
                  return (
                    <div
                      key={service.id}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => handleAddService(service.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <p className="text-xs text-gray-500">{service.category} • {service.duration} min</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">{formatPrice(service.price)}</p>
                          {isSelected && (
                            <p className="text-xs text-green-600 font-semibold">
                              ✓ Added (x{isSelected.quantity})
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Services */}
          {selectedServices.length > 0 && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-600" />
                Selected Services ({selectedServices.length})
              </h3>
              <div className="space-y-2">
                {selectedServices.map(item => {
                  const service = services.find(s => s.id === item.serviceId);
                  if (!service) return null;
                  return (
                    <div key={item.serviceId} className="bg-white p-3 rounded-lg flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                        <p className="text-xs text-gray-500">{formatPrice(service.price)} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.serviceId, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.serviceId, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold text-purple-600 min-w-[80px] text-right">
                          {formatPrice(service.price * item.quantity)}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(item.serviceId)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Discount Settings */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDiscountType('percentage')}
                  className={`px-4 py-3 border-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    discountType === 'percentage'
                      ? 'border-purple-500 bg-purple-50 text-purple-600'
                      : 'border-gray-300 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  <Percent className="w-4 h-4" />
                  Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('amount')}
                  className={`px-4 py-3 border-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    discountType === 'amount'
                      ? 'border-purple-500 bg-purple-50 text-purple-600'
                      : 'border-gray-300 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Amount
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  min="0"
                  max={discountType === 'percentage' ? 100 : originalPrice}
                  placeholder={discountType === 'percentage' ? 'e.g. 20' : 'e.g. 50'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  {discountType === 'percentage' ? '%' : 'AED'}
                </span>
              </div>
            </div>
          </div>

          {/* Validity Days */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Validity Period (Days) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={validityDays}
              onChange={(e) => setValidityDays(Number(e.target.value))}
              min="1"
              placeholder="e.g. 30"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">How many days is this package valid after purchase?</p>
          </div>

          {/* Price Summary */}
          {selectedServices.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-300 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">💰 Price Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Original Total:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(originalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-green-600">
                  <span>Discount ({actualDiscount}%):</span>
                  <span className="font-semibold">-{formatPrice(originalPrice - discountedPrice)}</span>
                </div>
                <div className="h-px bg-purple-300"></div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Package Price:</span>
                  <span className="text-2xl font-bold text-purple-600">{formatPrice(discountedPrice)}</span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Customers save {formatPrice(originalPrice - discountedPrice)} with this package!
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={!packageName || selectedServices.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
