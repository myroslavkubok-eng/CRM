import { useState } from 'react';
import { Package, Plus, Edit2, Trash2, Sparkles, TrendingUp, Users, Calendar, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
}

interface PackageDeal {
  id: string;
  name: string;
  description: string;
  services: Service[];
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  savings: number;
  icon: string;
  color: string;
  isActive: boolean;
  validUntil?: string;
  bookingsCount: number;
  totalRevenue: number;
}

const mockServices: Service[] = [
  { id: '1', name: 'Classic Manicure', price: 80, duration: 45, category: 'manicure' },
  { id: '2', name: 'Classic Pedicure', price: 100, duration: 60, category: 'pedicure' },
  { id: '3', name: 'Gel Polish', price: 120, duration: 60, category: 'manicure' },
  { id: '4', name: 'Haircut', price: 150, duration: 45, category: 'hair' },
  { id: '5', name: 'Hair Coloring', price: 300, duration: 120, category: 'hair' },
  { id: '6', name: 'Blow Dry', price: 80, duration: 30, category: 'hair' },
  { id: '7', name: 'Eyebrow Shaping', price: 50, duration: 20, category: 'brows' },
  { id: '8', name: 'Eyelash Extensions', price: 200, duration: 90, category: 'lashes' },
  { id: '9', name: 'Massage 60min', price: 250, duration: 60, category: 'massage' },
  { id: '10', name: 'Facial Treatment', price: 180, duration: 60, category: 'face' },
];

const mockPackages: PackageDeal[] = [
  {
    id: '1',
    name: 'Mani + Pedi Combo',
    description: 'Perfect combination for hands and feet',
    services: [
      { id: '1', name: 'Classic Manicure', price: 80, duration: 45, category: 'manicure' },
      { id: '2', name: 'Classic Pedicure', price: 100, duration: 60, category: 'pedicure' },
    ],
    originalPrice: 180,
    discountedPrice: 153,
    discountPercentage: 15,
    savings: 27,
    icon: '💅',
    color: 'pink',
    isActive: true,
    bookingsCount: 234,
    totalRevenue: 35802,
  },
  {
    id: '2',
    name: 'Full Hair Transformation',
    description: 'Cut, color, and style - complete makeover',
    services: [
      { id: '4', name: 'Haircut', price: 150, duration: 45, category: 'hair' },
      { id: '5', name: 'Hair Coloring', price: 300, duration: 120, category: 'hair' },
      { id: '6', name: 'Blow Dry', price: 80, duration: 30, category: 'hair' },
    ],
    originalPrice: 530,
    discountedPrice: 424,
    discountPercentage: 20,
    savings: 106,
    icon: '✂️',
    color: 'purple',
    isActive: true,
    validUntil: '2025-01-31',
    bookingsCount: 156,
    totalRevenue: 66144,
  },
  {
    id: '3',
    name: 'Bridal Beauty Package',
    description: 'Everything you need for your special day',
    services: [
      { id: '4', name: 'Haircut', price: 150, duration: 45, category: 'hair' },
      { id: '6', name: 'Blow Dry', price: 80, duration: 30, category: 'hair' },
      { id: '7', name: 'Eyebrow Shaping', price: 50, duration: 20, category: 'brows' },
      { id: '8', name: 'Eyelash Extensions', price: 200, duration: 90, category: 'lashes' },
      { id: '1', name: 'Classic Manicure', price: 80, duration: 45, category: 'manicure' },
    ],
    originalPrice: 560,
    discountedPrice: 448,
    discountPercentage: 20,
    savings: 112,
    icon: '👰',
    color: 'rose',
    isActive: true,
    bookingsCount: 89,
    totalRevenue: 39872,
  },
];

export function PackageDealsTab() {
  const [packages, setPackages] = useState<PackageDeal[]>(mockPackages);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageDeal | null>(null);
  const { formatPrice } = useCurrency();

  // New package form state
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    selectedServices: [] as Service[],
    discountPercentage: 15,
    icon: '🎁',
  });

  const handleCreatePackage = () => {
    if (!newPackage.name || newPackage.selectedServices.length < 2) {
      toast.error('Invalid package', {
        description: 'Package must have a name and at least 2 services',
      });
      return;
    }

    const originalPrice = newPackage.selectedServices.reduce((sum, s) => sum + s.price, 0);
    const discountedPrice = originalPrice * (1 - newPackage.discountPercentage / 100);
    const savings = originalPrice - discountedPrice;

    const packageDeal: PackageDeal = {
      id: Date.now().toString(),
      name: newPackage.name,
      description: newPackage.description,
      services: newPackage.selectedServices,
      originalPrice,
      discountedPrice,
      discountPercentage: newPackage.discountPercentage,
      savings,
      icon: newPackage.icon,
      color: 'blue',
      isActive: true,
      bookingsCount: 0,
      totalRevenue: 0,
    };

    setPackages([packageDeal, ...packages]);
    setIsCreating(false);
    setNewPackage({
      name: '',
      description: '',
      selectedServices: [],
      discountPercentage: 15,
      icon: '🎁',
    });

    toast.success('Package created!', {
      description: `${packageDeal.name} is now available for booking`,
    });
  };

  const toggleServiceInPackage = (service: Service) => {
    const isSelected = newPackage.selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setNewPackage({
        ...newPackage,
        selectedServices: newPackage.selectedServices.filter(s => s.id !== service.id),
      });
    } else {
      setNewPackage({
        ...newPackage,
        selectedServices: [...newPackage.selectedServices, service],
      });
    }
  };

  const togglePackageStatus = (packageId: string) => {
    setPackages(packages.map(pkg => 
      pkg.id === packageId ? { ...pkg, isActive: !pkg.isActive } : pkg
    ));
    toast.success('Package status updated');
  };

  const deletePackage = (packageId: string) => {
    setPackages(packages.filter(pkg => pkg.id !== packageId));
    toast.success('Package deleted');
  };

  const totalRevenue = packages.reduce((sum, pkg) => sum + pkg.totalRevenue, 0);
  const totalBookings = packages.reduce((sum, pkg) => sum + pkg.bookingsCount, 0);
  const averageDiscount = packages.length > 0 
    ? packages.reduce((sum, pkg) => sum + pkg.discountPercentage, 0) / packages.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-7 h-7 text-purple-600" />
            Package Deals
          </h2>
          <p className="text-gray-600 mt-1">Create bundles to increase average order value</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Package
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-purple-600" />
            <Badge variant="secondary">{packages.length}</Badge>
          </div>
          <div className="text-2xl font-bold text-purple-900">{packages.length}</div>
          <div className="text-sm text-purple-700">Active Packages</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{formatPrice(totalRevenue)}</div>
          <div className="text-sm text-green-700">Total Revenue</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalBookings}</div>
          <div className="text-sm text-blue-700">Total Bookings</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-900">{averageDiscount.toFixed(0)}%</div>
          <div className="text-sm text-orange-700">Avg Discount</div>
        </div>
      </div>

      {/* Create Package Modal/Form */}
      {isCreating && (
        <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Create New Package</h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Package Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
              <Input
                value={newPackage.name}
                onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                placeholder="e.g., Summer Glow Package"
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Input
                value={newPackage.description}
                onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                placeholder="Brief description of the package"
                className="w-full"
              />
            </div>

            {/* Icon Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <div className="flex gap-2">
                {['🎁', '💅', '✂️', '💆', '👰', '🌟', '💝', '🎀', '🌸', '✨'].map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewPackage({ ...newPackage, icon })}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl transition-all ${
                      newPackage.icon === icon 
                        ? 'border-purple-500 bg-purple-50 scale-110' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Services Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Services (minimum 2)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                {mockServices.map(service => {
                  const isSelected = newPackage.selectedServices.some(s => s.id === service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleServiceInPackage(service)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500">{service.duration} min</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{formatPrice(service.price)}</span>
                          {isSelected && <Check className="w-5 h-5 text-purple-600" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Discount Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage: {newPackage.discountPercentage}%
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={newPackage.discountPercentage}
                onChange={(e) => setNewPackage({ ...newPackage, discountPercentage: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Price Preview */}
            {newPackage.selectedServices.length >= 2 && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Original Price:</span>
                  <span className="text-lg line-through text-gray-500">
                    {formatPrice(newPackage.selectedServices.reduce((sum, s) => sum + s.price, 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Discount ({newPackage.discountPercentage}%):</span>
                  <span className="text-lg text-green-600 font-bold">
                    -{formatPrice(newPackage.selectedServices.reduce((sum, s) => sum + s.price, 0) * newPackage.discountPercentage / 100)}
                  </span>
                </div>
                <div className="border-t border-purple-200 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Final Price:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatPrice(newPackage.selectedServices.reduce((sum, s) => sum + s.price, 0) * (1 - newPackage.discountPercentage / 100))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreatePackage}
                disabled={!newPackage.name || newPackage.selectedServices.length < 2}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Create Package
              </Button>
              <Button
                onClick={() => setIsCreating(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Packages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
              pkg.isActive ? 'border-purple-200' : 'border-gray-200 opacity-60'
            }`}
          >
            {/* Package Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl">{pkg.icon}</div>
                <Badge variant={pkg.isActive ? 'default' : 'secondary'} className="bg-white/20 text-white border-0">
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <h3 className="font-bold text-lg mb-1">{pkg.name}</h3>
              <p className="text-sm text-white/90">{pkg.description}</p>
            </div>

            {/* Package Content */}
            <div className="p-4">
              {/* Services */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Included Services
                </div>
                <div className="space-y-1">
                  {pkg.services.map(service => (
                    <div key={service.id} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{service.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Regular Price:</span>
                  <span className="text-sm line-through text-gray-500">{formatPrice(pkg.originalPrice)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">You Save {pkg.discountPercentage}%:</span>
                  <span className="text-sm font-bold text-green-600">{formatPrice(pkg.savings)}</span>
                </div>
                <div className="border-t border-purple-200 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Package Price:</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatPrice(pkg.discountedPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">{pkg.bookingsCount}</div>
                  <div className="text-xs text-gray-600">Bookings</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">{formatPrice(pkg.totalRevenue)}</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
              </div>

              {/* Valid Until */}
              {pkg.validUntil && (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-2 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Valid until {new Date(pkg.validUntil).toLocaleDateString()}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => togglePackageStatus(pkg.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {pkg.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  onClick={() => setEditingPackage(pkg)}
                  variant="outline"
                  size="sm"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => deletePackage(pkg.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No packages yet</h3>
          <p className="text-gray-600 mb-4">Create your first package deal to increase revenue</p>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Package
          </Button>
        </div>
      )}
    </div>
  );
}
