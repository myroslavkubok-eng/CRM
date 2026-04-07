import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Building2, Shield, Crown, Calendar, BarChart3, Settings, ArrowRight, Lock } from 'lucide-react';

export function DashboardSelector() {
  const navigate = useNavigate();

  const dashboards = [
    {
      id: 'client',
      title: 'Client Dashboard',
      description: 'Manage your bookings, favorites, and rewards',
      icon: User,
      color: 'from-purple-500 to-pink-500',
      path: '/client?demo=true',
      features: ['View Bookings', 'Track Rewards', 'Manage Favorites', 'Payment Methods'],
    },
    {
      id: 'salon',
      title: 'Salon Dashboard',
      description: 'Manage your salon, bookings, and services',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      path: '/owner?demo=true',
      features: ['Calendar Management', 'Client Management', 'Service Setup', 'Analytics'],
    },
    {
      id: 'admin',
      title: 'Admin Dashboard',
      description: 'Advanced salon management and team control',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      path: '/admin?demo=true',
      features: ['Full Calendar Access', 'Staff Management', 'Client Database', 'Reports'],
    },
    {
      id: 'superadmin',
      title: 'Super Admin Dashboard',
      description: 'Platform-wide control and management',
      icon: Crown,
      color: 'from-yellow-500 to-amber-600',
      path: '/superadmin?demo=true',
      features: ['All Salons', 'Lead Management', 'Platform Analytics', 'Email Campaigns'],
    },
    {
      id: 'blocked',
      title: 'Blocked Salon View',
      description: '🔒 Demo: Auto-blocked salon scenarios',
      icon: Lock,
      color: 'from-red-500 to-orange-500',
      path: '/blocked-demo',
      features: ['Payment Failed', 'Refund Processed', 'Expired Subscription', 'Data Safe for 90 Days'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Choose Your Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Select the dashboard type you want to explore
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {dashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            return (
              <Card
                key={dashboard.id}
                className="p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${dashboard.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {dashboard.title}
                    </h3>
                    <p className="text-gray-600">
                      {dashboard.description}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-6 space-y-2">
                  {dashboard.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate(dashboard.path)}
                  className={`w-full bg-gradient-to-r ${dashboard.color} hover:opacity-90`}
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="border-2 border-gray-300 hover:border-purple-600"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}