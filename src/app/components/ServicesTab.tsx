import { useState } from 'react';
import { Plus, Edit, Trash2, Search, DollarSign, Clock, Package, Gift, Users, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useServices, type Service } from '../../contexts/ServicesContext';
import { AddServiceModal, type NewService } from './AddServiceModal';
import { ServiceDetailsModal } from './ServiceDetailsModal';
import { AddPackageModal, type NewPackage } from './AddPackageModal';
import { EditPackageModal, type UpdatedPackage } from './EditPackageModal';
import { useNavigate } from 'react-router-dom';

export interface PackageDeal {
  id: string;
  name: string;
  description: string;
  services: { serviceId: string; quantity: number }[];
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  validityDays: number;
  isActive: boolean;
}

export function ServicesTab() {
  const { formatPrice } = useCurrency();
  const { services, addService, updateService, deleteService } = useServices();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isAddPackageModalOpen, setIsAddPackageModalOpen] = useState(false);
  const [isEditPackageModalOpen, setIsEditPackageModalOpen] = useState(false);
  const [isServiceDetailsModalOpen, setIsServiceDetailsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageDeal | null>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'packages' | 'group'>('services');
  
  // Group Booking Settings
  const [groupBookingSettings, setGroupBookingSettings] = useState({
    tier1: { minPeople: 2, maxPeople: 3, discount: 5 },
    tier2: { minPeople: 4, maxPeople: 5, discount: 10 },
    tier3: { minPeople: 6, maxPeople: 99, discount: 15 },
  });
  const [isEditingGroupBooking, setIsEditingGroupBooking] = useState(false);
  
  // Mock package deals (replace with context later)
  const [packageDeals, setPackageDeals] = useState<PackageDeal[]>([
    {
      id: '1',
      name: '💅 Manicure + Pedicure Bundle',
      description: 'Get both services with 20% discount',
      services: [
        { serviceId: '1', quantity: 1 }, // Manicure
        { serviceId: '2', quantity: 1 }, // Pedicure
      ],
      originalPrice: 120,
      discountedPrice: 96,
      discount: 20,
      validityDays: 30,
      isActive: true,
    },
    {
      id: '2',
      name: '💆 Monthly Beauty Package',
      description: '4 sessions per month - any service',
      services: [
        { serviceId: '1', quantity: 4 },
      ],
      originalPrice: 240,
      discountedPrice: 180,
      discount: 25,
      validityDays: 30,
      isActive: true,
    },
  ]);

  const handleAddService = (newService: NewService) => {
    const serviceToAdd: Service = {
      id: (services.length + 1).toString(),
      name: newService.name,
      category: newService.category,
      price: newService.price,
      duration: newService.duration,
      description: newService.description
    };
    addService(serviceToAdd);
  };

  const handleAddPackage = (newPackage: NewPackage) => {
    // Calculate prices
    const originalPrice = newPackage.services.reduce((total, item) => {
      const service = services.find(s => s.id === item.serviceId);
      return total + (service ? service.price * item.quantity : 0);
    }, 0);

    let discountedPrice = originalPrice;
    if (newPackage.discountType === 'percentage') {
      discountedPrice = originalPrice * (1 - newPackage.discountValue / 100);
    } else {
      discountedPrice = Math.max(0, originalPrice - newPackage.discountValue);
    }

    const actualDiscount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

    const packageToAdd: PackageDeal = {
      id: (packageDeals.length + 1).toString(),
      name: newPackage.name,
      description: newPackage.description,
      services: newPackage.services,
      originalPrice,
      discountedPrice,
      discount: actualDiscount,
      validityDays: newPackage.validityDays,
      isActive: true,
    };

    setPackageDeals([...packageDeals, packageToAdd]);
    console.log('✅ Package added successfully:', packageToAdd);
  };

  const handleUpdateService = (updatedService: Service) => {
    updateService(updatedService);
    setIsServiceDetailsModalOpen(false);
  };

  const handleUpdatePackage = (updatedPackage: UpdatedPackage) => {
    if (!selectedPackage) return;

    // Calculate prices
    const originalPrice = updatedPackage.services.reduce((total, item) => {
      const service = services.find(s => s.id === item.serviceId);
      return total + (service ? service.price * item.quantity : 0);
    }, 0);

    let discountedPrice = originalPrice;
    if (updatedPackage.discountType === 'percentage') {
      discountedPrice = originalPrice * (1 - updatedPackage.discountValue / 100);
    } else {
      discountedPrice = Math.max(0, originalPrice - updatedPackage.discountValue);
    }

    const actualDiscount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

    const packageToUpdate: PackageDeal = {
      ...selectedPackage,
      name: updatedPackage.name,
      description: updatedPackage.description,
      services: updatedPackage.services,
      originalPrice,
      discountedPrice,
      discount: actualDiscount,
      validityDays: updatedPackage.validityDays,
    };

    setPackageDeals(packageDeals.map(p => p.id === selectedPackage.id ? packageToUpdate : p));
    setIsEditPackageModalOpen(false);
    console.log('✅ Package updated successfully:', packageToUpdate);
  };

  const categories = Array.from(new Set(services.map(s => s.category)));

  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">menu/Services</h2>
          <p className="text-sm text-gray-500">Manage Services & Package Deals</p>
        </div>
        <Button 
          className="bg-gray-900 hover:bg-gray-800 text-white gap-2" 
          onClick={() => {
            if (activeTab === 'services') {
              setIsAddServiceModalOpen(true);
            } else if (activeTab === 'packages') {
              setIsAddPackageModalOpen(true);
            } else if (activeTab === 'group') {
              setIsEditingGroupBooking(!isEditingGroupBooking);
            }
          }}
        >
          {activeTab === 'group' && isEditingGroupBooking ? (
            <>
              <X className="w-4 h-4" />
              Cancel Edit
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              {activeTab === 'services' ? 'Add Service' : activeTab === 'packages' ? 'Add Package' : 'Edit Settings'}
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-4 px-1 border-b-2 transition-colors ${
              activeTab === 'services'
                ? 'border-purple-600 text-purple-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Individual Services
            </div>
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`pb-4 px-1 border-b-2 transition-colors ${
              activeTab === 'packages'
                ? 'border-purple-600 text-purple-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Package Deals
            </div>
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`pb-4 px-1 border-b-2 transition-colors ${
              activeTab === 'group'
                ? 'border-purple-600 text-purple-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Group Booking
            </div>
          </button>
        </div>
      </div>

      {activeTab === 'services' ? (
        <>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {services
              .filter(service =>
                service.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(service => (
                <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-sm text-gray-500">{service.category}</p>
                    </div>
                    {service.discount && service.discount > 0 && (
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{service.discount}%
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-start">
                        {service.originalPrice && service.originalPrice > service.price && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(service.originalPrice)}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-purple-600">{formatPrice(service.price)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {service.duration} min
                      </div>
                    </div>

                    {service.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => {
                      setSelectedService(service);
                      setIsServiceDetailsModalOpen(true);
                    }}>
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}

            {/* Add Service Card */}
            <button 
              onClick={() => setIsAddServiceModalOpen(true)}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Add Service</span>
            </button>
          </div>
        </>
      ) : activeTab === 'packages' ? (
        <>
          {/* Package Deals Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {packageDeals.map(packageDeal => (
              <Card key={packageDeal.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{packageDeal.name}</h3>
                    <p className="text-sm text-gray-500">{packageDeal.description}</p>
                  </div>
                  {packageDeal.discount && packageDeal.discount > 0 && (
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{packageDeal.discount}%
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      {packageDeal.originalPrice && packageDeal.originalPrice > packageDeal.discountedPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(packageDeal.originalPrice)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-purple-600">{formatPrice(packageDeal.discountedPrice)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {packageDeal.validityDays} days
                    </div>
                  </div>

                  {packageDeal.services.map(service => (
                    <p key={service.serviceId} className="text-sm text-gray-600 line-clamp-2">
                      {services.find(s => s.id === service.serviceId)?.name} x {service.quantity}
                    </p>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => {
                    setSelectedPackage(packageDeal);
                    setIsEditPackageModalOpen(true);
                  }}>
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}

            {/* Add Package Card */}
            <button 
              onClick={() => setIsAddPackageModalOpen(true)}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Add Package</span>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Group Booking Settings */}
          <Card className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Group Booking Discounts</h3>
                  <p className="text-sm text-gray-600">
                    {isEditingGroupBooking ? 'Edit discount tiers below' : 'Configure automatic discounts for group bookings'}
                  </p>
                </div>
              </div>
              {isEditingGroupBooking && (
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setIsEditingGroupBooking(false);
                    console.log('✅ Group booking settings saved:', groupBookingSettings);
                    // Save to localStorage
                    localStorage.setItem('groupBookingSettings', JSON.stringify(groupBookingSettings));
                  }}
                >
                  Save Changes
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Tier 1 - Small Group */}
              <Card className={`p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 ${isEditingGroupBooking ? 'border-green-500' : 'border-green-200'}`}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                    {isEditingGroupBooking ? (
                      <span className="text-sm">{groupBookingSettings.tier1.minPeople}-{groupBookingSettings.tier1.maxPeople}</span>
                    ) : (
                      `${groupBookingSettings.tier1.minPeople}-${groupBookingSettings.tier1.maxPeople}`
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Small Group</h4>
                  {isEditingGroupBooking ? (
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 justify-center">
                        <input
                          type="number"
                          value={groupBookingSettings.tier1.minPeople}
                          onChange={(e) => setGroupBookingSettings({
                            ...groupBookingSettings,
                            tier1: { ...groupBookingSettings.tier1, minPeople: parseInt(e.target.value) || 0 }
                          })}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                          min="1"
                        />
                        <span className="text-xs text-gray-500">to</span>
                        <input
                          type="number"
                          value={groupBookingSettings.tier1.maxPeople}
                          onChange={(e) => setGroupBookingSettings({
                            ...groupBookingSettings,
                            tier1: { ...groupBookingSettings.tier1, maxPeople: parseInt(e.target.value) || 0 }
                          })}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                          min="1"
                        />
                      </div>
                      <p className="text-xs text-gray-600">people</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-3">{groupBookingSettings.tier1.minPeople}-{groupBookingSettings.tier1.maxPeople} people</p>
                  )}
                  {isEditingGroupBooking ? (
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        type="number"
                        value={groupBookingSettings.tier1.discount}
                        onChange={(e) => setGroupBookingSettings({
                          ...groupBookingSettings,
                          tier1: { ...groupBookingSettings.tier1, discount: parseInt(e.target.value) || 0 }
                        })}
                        className="w-20 px-3 py-2 border-2 border-green-400 rounded-lg text-center text-2xl font-bold text-green-600"
                        min="0"
                        max="100"
                      />
                      <span className="text-2xl font-bold text-green-600">% OFF</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-green-600">{groupBookingSettings.tier1.discount}% OFF</div>
                  )}
                </div>
              </Card>

              {/* Tier 2 - Medium Group */}
              <Card className={`p-6 bg-gradient-to-br from-blue-50 to-sky-50 border-2 ${isEditingGroupBooking ? 'border-blue-500' : 'border-blue-200'}`}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                    {isEditingGroupBooking ? (
                      <span className="text-sm">{groupBookingSettings.tier2.minPeople}-{groupBookingSettings.tier2.maxPeople}</span>
                    ) : (
                      `${groupBookingSettings.tier2.minPeople}-${groupBookingSettings.tier2.maxPeople}`
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Medium Group</h4>
                  {isEditingGroupBooking ? (
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 justify-center">
                        <input
                          type="number"
                          value={groupBookingSettings.tier2.minPeople}
                          onChange={(e) => setGroupBookingSettings({
                            ...groupBookingSettings,
                            tier2: { ...groupBookingSettings.tier2, minPeople: parseInt(e.target.value) || 0 }
                          })}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                          min="1"
                        />
                        <span className="text-xs text-gray-500">to</span>
                        <input
                          type="number"
                          value={groupBookingSettings.tier2.maxPeople}
                          onChange={(e) => setGroupBookingSettings({
                            ...groupBookingSettings,
                            tier2: { ...groupBookingSettings.tier2, maxPeople: parseInt(e.target.value) || 0 }
                          })}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                          min="1"
                        />
                      </div>
                      <p className="text-xs text-gray-600">people</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-3">{groupBookingSettings.tier2.minPeople}-{groupBookingSettings.tier2.maxPeople} people</p>
                  )}
                  {isEditingGroupBooking ? (
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        type="number"
                        value={groupBookingSettings.tier2.discount}
                        onChange={(e) => setGroupBookingSettings({
                          ...groupBookingSettings,
                          tier2: { ...groupBookingSettings.tier2, discount: parseInt(e.target.value) || 0 }
                        })}
                        className="w-20 px-3 py-2 border-2 border-blue-400 rounded-lg text-center text-2xl font-bold text-blue-600"
                        min="0"
                        max="100"
                      />
                      <span className="text-2xl font-bold text-blue-600">% OFF</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-blue-600">{groupBookingSettings.tier2.discount}% OFF</div>
                  )}
                </div>
              </Card>

              {/* Tier 3 - Large Group */}
              <Card className={`p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 ${isEditingGroupBooking ? 'border-purple-500' : 'border-purple-200'}`}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                    {groupBookingSettings.tier3.minPeople}+
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Large Group</h4>
                  {isEditingGroupBooking ? (
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 justify-center">
                        <input
                          type="number"
                          value={groupBookingSettings.tier3.minPeople}
                          onChange={(e) => setGroupBookingSettings({
                            ...groupBookingSettings,
                            tier3: { ...groupBookingSettings.tier3, minPeople: parseInt(e.target.value) || 0 }
                          })}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                          min="1"
                        />
                        <span className="text-xs text-gray-500">+ people</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-3">{groupBookingSettings.tier3.minPeople}+ people</p>
                  )}
                  {isEditingGroupBooking ? (
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        type="number"
                        value={groupBookingSettings.tier3.discount}
                        onChange={(e) => setGroupBookingSettings({
                          ...groupBookingSettings,
                          tier3: { ...groupBookingSettings.tier3, discount: parseInt(e.target.value) || 0 }
                        })}
                        className="w-20 px-3 py-2 border-2 border-purple-400 rounded-lg text-center text-2xl font-bold text-purple-600"
                        min="0"
                        max="100"
                      />
                      <span className="text-2xl font-bold text-purple-600">% OFF</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-purple-600">{groupBookingSettings.tier3.discount}% OFF</div>
                  )}
                </div>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-xl border-2 border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                How Group Booking Works
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Clients can book for multiple people at the same time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Discounts apply automatically based on group size</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Multiple masters assigned to serve the group simultaneously</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Perfect for weddings, birthdays, corporate events</span>
                </li>
              </ul>
            </div>
          </Card>
        </>
      )}

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        onSubmit={handleAddService}
      />

      {/* Add Package Modal */}
      <AddPackageModal
        isOpen={isAddPackageModalOpen}
        onClose={() => setIsAddPackageModalOpen(false)}
        onSubmit={handleAddPackage}
      />

      {/* Service Details Modal */}
      <ServiceDetailsModal
        isOpen={isServiceDetailsModalOpen}
        onClose={() => setIsServiceDetailsModalOpen(false)}
        service={selectedService}
        onSave={handleUpdateService}
      />

      {/* Edit Package Modal */}
      <EditPackageModal
        isOpen={isEditPackageModalOpen}
        onClose={() => setIsEditPackageModalOpen(false)}
        packageDeal={selectedPackage}
        onSave={handleUpdatePackage}
      />
    </div>
  );
}