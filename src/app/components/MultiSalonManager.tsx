import { useState } from 'react';
import { Plus, Store, ChevronRight, Settings, TrendingUp, Users, Calendar, DollarSign, Crown, Trash2, Edit2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';
import { AddSalonModal } from './AddSalonModal';

interface Salon {
  id: string;
  name: string;
  location: string;
  plan: 'starter' | 'professional' | 'business';
  billingPeriod: 'monthly' | 'semi-annual' | 'annual';
  nextBillingDate: string;
  status: 'active' | 'trial' | 'expired';
  image?: string;
  stats: {
    totalBookings: number;
    revenue: number;
    clients: number;
    upcomingAppointments: number;
  };
}

interface MultiSalonManagerProps {
  currentSalonId: string;
  onSalonSwitch: (salonId: string) => void;
}

export function MultiSalonManager({ currentSalonId, onSalonSwitch }: MultiSalonManagerProps) {
  const { formatPrice } = useCurrency();
  const [showAddSalon, setShowAddSalon] = useState(false);
  const [salons, setSalons] = useState<Salon[]>([
    {
      id: 'salon-1',
      name: 'Glamour Downtown',
      location: 'Dubai Marina, UAE',
      plan: 'business',
      billingPeriod: 'annual',
      nextBillingDate: '2025-12-24',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
      stats: {
        totalBookings: 1247,
        revenue: 45680,
        clients: 342,
        upcomingAppointments: 28
      }
    },
    {
      id: 'salon-2',
      name: 'Beauty Oasis',
      location: 'JBR, Dubai',
      plan: 'professional',
      billingPeriod: 'semi-annual',
      nextBillingDate: '2025-06-15',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
      stats: {
        totalBookings: 892,
        revenue: 32450,
        clients: 198,
        upcomingAppointments: 15
      }
    },
    {
      id: 'salon-3',
      name: 'Luxury Spa & Salon',
      location: 'Palm Jumeirah, Dubai',
      plan: 'starter',
      billingPeriod: 'monthly',
      nextBillingDate: '2025-01-24',
      status: 'trial',
      image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400',
      stats: {
        totalBookings: 124,
        revenue: 8950,
        clients: 67,
        upcomingAppointments: 8
      }
    }
  ]);

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'business':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white';
      case 'professional':
        return 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white';
      case 'starter':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'business':
        return 'Business';
      case 'professional':
        return 'Professional';
      case 'starter':
        return 'Starter';
      default:
        return plan;
    }
  };

  const getBillingPeriodLabel = (period: string) => {
    switch (period) {
      case 'annual':
        return 'Annual (30% OFF)';
      case 'semi-annual':
        return '6 Months (20% OFF)';
      case 'monthly':
        return 'Monthly';
      default:
        return period;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>;
      case 'trial':
        return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Trial</span>;
      case 'expired':
        return <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Expired</span>;
      default:
        return null;
    }
  };

  const handleAddSalon = (salonData: any) => {
    const newSalon: Salon = {
      id: `salon-${Date.now()}`,
      name: salonData.name,
      location: salonData.location,
      plan: salonData.plan,
      billingPeriod: salonData.billingPeriod,
      nextBillingDate: salonData.nextBillingDate,
      status: 'active',
      stats: {
        totalBookings: 0,
        revenue: 0,
        clients: 0,
        upcomingAppointments: 0
      }
    };

    setSalons([...salons, newSalon]);
    toast.success(`${salonData.name} added successfully! 🎉`);
    setShowAddSalon(false);
  };

  const handleDeleteSalon = (salonId: string) => {
    if (salons.length <= 1) {
      toast.error('You must have at least one salon');
      return;
    }

    if (!confirm('Are you sure you want to delete this salon? This action cannot be undone.')) {
      return;
    }

    setSalons(salons.filter(s => s.id !== salonId));
    
    if (currentSalonId === salonId) {
      onSalonSwitch(salons[0].id);
    }
    
    toast.success('Salon deleted successfully');
  };

  const currentSalon = salons.find(s => s.id === currentSalonId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🏪 My Salons</h2>
          <p className="text-gray-600">
            Manage all your salon locations from one dashboard
          </p>
        </div>
        <Button
          onClick={() => setShowAddSalon(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Salon
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Store className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-purple-600">{salons.length}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Total Salons</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(salons.reduce((sum, s) => sum + s.stats.revenue, 0))}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-blue-600">
                {salons.reduce((sum, s) => sum + s.stats.clients, 0)}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">Total Clients</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-orange-600">
                {salons.reduce((sum, s) => sum + s.stats.upcomingAppointments, 0)}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Salons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {salons.map((salon) => (
          <Card
            key={salon.id}
            className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
              salon.id === currentSalonId
                ? 'border-2 border-purple-600 shadow-md'
                : 'border border-gray-200'
            }`}
            onClick={() => onSalonSwitch(salon.id)}
          >
            {/* Salon Image */}
            {salon.image && (
              <div className="relative h-32 overflow-hidden">
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="w-full h-full object-cover"
                />
                {salon.id === currentSalonId && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Current
                  </div>
                )}
              </div>
            )}

            <CardContent className="p-6">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{salon.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      {salon.location}
                    </p>
                  </div>
                  {getStatusBadge(salon.status)}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getPlanBadgeColor(salon.plan)}`}>
                    {salon.plan === 'business' && <Crown className="w-3 h-3 inline mr-1" />}
                    {getPlanName(salon.plan)}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {getBillingPeriodLabel(salon.billingPeriod)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{salon.stats.totalBookings}</div>
                  <div className="text-xs text-gray-600">Total Bookings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{formatPrice(salon.stats.revenue)}</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{salon.stats.clients}</div>
                  <div className="text-xs text-gray-600">Clients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{salon.stats.upcomingAppointments}</div>
                  <div className="text-xs text-gray-600">Upcoming</div>
                </div>
              </div>

              {/* Billing Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Next billing:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(salon.nextBillingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSalonSwitch(salon.id);
                  }}
                >
                  {salon.id === currentSalonId ? (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4 mr-2" />
                      Switch
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSalon(salon.id);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upgrade Banner */}
      {salons.some(s => s.plan !== 'business') && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Upgrade to Business Plan for All Salons</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get unlimited features, advanced analytics, and priority support for all your locations. 
                  Save up to 30% with annual billing! 🎉
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Upgrade All Salons
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Salon Modal */}
      {showAddSalon && (
        <AddSalonModal
          onClose={() => setShowAddSalon(false)}
          onAdd={handleAddSalon}
        />
      )}
    </div>
  );
}
