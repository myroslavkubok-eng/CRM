import { useState } from 'react';
import { 
  X, 
  Calendar, 
  Users, 
  Heart, 
  Package, 
  Rss, 
  BarChart3, 
  DollarSign, 
  Settings,
  Bot,
  Scissors,
  Mail,
  TrendingUp,
  Trophy,
  UserPlus,
  Lock,
  Share2,
  Menu as MenuIcon,
  ChevronRight,
  Building2,
  ChevronDown,
  Clock,
  Star,
  Gift,
  AlertCircle,
  Bell
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CalendarTab } from './CalendarTab';
import { ClientsTab } from './ClientsTab';
import { MastersTab } from './MastersTab';
import { ServicesTab } from './ServicesTab';
import { ProductsTab } from './ProductsTab';
import { BeautyFeedTab } from './BeautyFeedTab';
import { MarketingTab } from './MarketingTab';
import { AnalyticsTab } from './AnalyticsTab';
import { FinanceTab } from './FinanceTab';
import { SalonSettingsTab } from './SalonSettingsTab';
import { AIToolsTab } from './AIToolsTab';
import { InventoryTab } from './InventoryTab';
import { AttendanceTab } from './AttendanceTab';
import { ReviewsTab } from './ReviewsTab';
import { ExpenseTab } from './ExpenseTab';
import { LoyaltyTab } from './LoyaltyTab';
import { AdvancedAnalyticsTab } from './AdvancedAnalyticsTab';
import { NotificationsCenter } from './NotificationsCenter';
import { NotificationsFullPage } from './NotificationsFullPage';
import { WaitingListTab } from './WaitingListTab';
import { MasterDashboard } from '../pages/MasterDashboard';
import { useCurrency, CURRENCIES } from '../../contexts/CurrencyContext';

const logo = "/icons/logo.svg";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeRole, setActiveRole] = useState('owner');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'business'>('basic');
  const [selectedSalon, setSelectedSalon] = useState('Glamour Downtown');
  const [isSalonDropdownOpen, setIsSalonDropdownOpen] = useState(false);
  const { currency, setCurrency, formatPrice } = useCurrency();

  if (!isOpen) return null;

  const plans = [
    { id: 'basic' as const, name: 'Basic Start', multiSalonEnabled: false },
    { id: 'standard' as const, name: 'Standard Growth', multiSalonEnabled: false },
    { id: 'business' as const, name: 'Business Pro', multiSalonEnabled: true }
  ];

  const salons = [
    { id: '1', name: 'Glamour Downtown', address: '123 Main St' },
    { id: '2', name: 'Glamour Mall', address: 'Westfield Mall, L2' },
    { id: '3', name: 'Glamour Express', address: '45 Station Rd' }
  ];

  const canSwitchSalon = selectedPlan === 'business';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'clients', label: 'Clients' },
    { id: 'masters', label: 'Masters' },
    { id: 'services', label: 'menu/Services' },
    { id: 'products', label: 'products' },
    { id: 'feed', label: 'Beauty Feed' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'finance', label: 'Finance' },
    { id: 'settings', label: 'Salon Settings' },
    { id: 'ai-tools', label: 'AI Tools' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'expense', label: 'Expense' },
    { id: 'loyalty', label: 'Loyalty' },
    { id: 'advanced-analytics', label: 'Advanced Analytics' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'waiting-list', label: 'Waiting List' }
  ];

  const roles = [
    { id: 'owner', label: 'Owner', icon: Trophy },
    { id: 'admin', label: 'Admin', icon: UserPlus },
    { id: 'master', label: 'Master', icon: Scissors }
  ];

  // Plan-based feature availability
  const planFeatures = {
    basic: ['overview', 'calendar', 'clients', 'masters', 'services', 'feed', 'settings', 'attendance', 'reviews', 'notifications', 'waiting-list'],
    standard: ['overview', 'calendar', 'clients', 'masters', 'services', 'feed', 'settings', 'marketing', 'products', 'attendance', 'reviews', 'inventory', 'notifications', 'waiting-list'],
    business: ['overview', 'calendar', 'clients', 'masters', 'services', 'feed', 'settings', 'marketing', 'products', 'analytics', 'finance', 'ai-tools', 'inventory', 'attendance', 'reviews', 'expense', 'loyalty', 'advanced-analytics', 'notifications', 'waiting-list']
  };

  // Role-based restrictions
  const roleRestrictions = {
    owner: [], // Owner has access to everything in the plan
    admin: ['analytics', 'finance', 'settings', 'marketing', 'expense', 'loyalty', 'advanced-analytics'], // Admin can't see these even on Business plan
    master: [] // Master has separate dashboard
  };

  const isFeatureAvailable = (featureId: string) => {
    // First check if feature is in the plan
    if (!planFeatures[selectedPlan].includes(featureId)) {
      return false;
    }
    
    // Then check role restrictions
    if (roleRestrictions[activeRole as keyof typeof roleRestrictions]?.includes(featureId)) {
      return false;
    }
    
    return true;
  };

  const getFeatureLockMessage = (featureId: string) => {
    if (planFeatures.standard.includes(featureId) && !planFeatures.basic.includes(featureId)) {
      return '🔒 Available on Standard Growth+';
    }
    if (planFeatures.business.includes(featureId) && !planFeatures.standard.includes(featureId)) {
      return '🔒 Available on Business Pro only';
    }
    return '🔒 Upgrade to unlock';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
      {activeRole === 'master' ? (
        // Full Master Dashboard View
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-500 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Master Dashboard Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <MasterDashboard onBack={() => setActiveRole('owner')} />
          </div>
        </div>
      ) : (
        // Standard Owner/Admin Dashboard View
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Katia Booking" className="w-10 h-10 rounded-xl" />
              <div>
                <h2 className="font-bold text-gray-900">Katia Booking</h2>
                <p className="text-xs text-gray-500">Demo Environment</p>
              </div>
            </div>

            {/* Top Navigation */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <button className="flex items-center gap-2 text-gray-700 hover:text-purple-600">
                <MenuIcon className="w-4 h-4" />
                Browse by Category
              </button>
              <button className="text-purple-600 hover:text-purple-700">
                Become a Partner
              </button>
              <button className="text-gray-700 hover:text-purple-600">
                Feed
              </button>
              <button className="text-gray-700 hover:text-purple-600">
                Support
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Salon Header */}
          <div className="bg-gray-50 border-b border-gray-200 p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <button className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-purple-600">
                  Client View Preview
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  Subscribe Now
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Glamour Downtown</h1>
                <p className="text-sm text-gray-600">📍 123 Main St • Welcome back, Boris</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Role Switcher */}
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                  {roles.map(role => (
                    <button
                      key={role.id}
                      onClick={() => setActiveRole(role.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        activeRole === role.id
                          ? 'bg-purple-100 text-purple-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <role.icon className="w-4 h-4" />
                      {role.label}
                    </button>
                  ))}
                </div>

                {/* Salon Switcher - Only for Business Pro */}
                <div className="relative group">
                  <button
                    disabled={!canSwitchSalon}
                    onClick={() => canSwitchSalon && setIsSalonDropdownOpen(!isSalonDropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      canSwitchSalon
                        ? 'bg-white border-gray-200 hover:border-purple-300 cursor-pointer'
                        : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{selectedSalon}</span>
                    {canSwitchSalon && <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isSalonDropdownOpen && canSwitchSalon && (
                    <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[250px] py-2">
                      {salons.map((salon) => (
                        <button
                          key={salon.id}
                          onClick={() => {
                            setSelectedSalon(salon.name);
                            setIsSalonDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex items-start gap-3 ${
                            selectedSalon === salon.name ? 'bg-purple-50' : ''
                          }`}
                        >
                          <Building2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            selectedSalon === salon.name ? 'text-purple-600' : 'text-gray-400'
                          }`} />
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${
                              selectedSalon === salon.name ? 'text-purple-900' : 'text-gray-900'
                            }`}>
                              {salon.name}
                            </div>
                            <div className="text-xs text-gray-500">{salon.address}</div>
                          </div>
                          {selectedSalon === salon.name && (
                            <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {!canSwitchSalon && (
                    <div className="hidden group-hover:block absolute top-full mt-2 left-0 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                      🔒 Multi-salon available on Business Pro
                    </div>
                  )}
                </div>

                {/* Plan Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">PLAN</span>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value as 'basic' | 'standard' | 'business')}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currency Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">CURRENCY</span>
                  <select
                    value={currency.code}
                    onChange={(e) => {
                      const selectedCurrency = CURRENCIES.find(c => c.code === e.target.value);
                      if (selectedCurrency) setCurrency(selectedCurrency);
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {CURRENCIES.map((cur) => (
                      <option key={cur.code} value={cur.code}>
                        {cur.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Fixed, always visible */}
          <div className="bg-white border-b border-gray-200 overflow-x-auto flex-shrink-0 shadow-sm">
            <div className="flex gap-6 px-4 min-w-max">
              {tabs.map((tab) => {
                const available = isFeatureAvailable(tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => available && setActiveTab(tab.id)}
                    disabled={!available}
                    className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap relative group ${
                      available
                        ? activeTab === tab.id
                          ? 'border-purple-600 text-purple-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                        : 'border-transparent text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {tab.label}
                    {!available && (
                      <>
                        <Lock className="w-3 h-3 inline-block ml-1 opacity-50" />
                        <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                          {getFeatureLockMessage(tab.id)}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content - Scrollable area */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6">
              {/* Admin Notification Banner */}
              {activeRole === 'admin' && (
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-yellow-900 mb-1">Viewing as Administrator</h3>
                      <p className="text-sm text-yellow-800">
                        Admins have restricted access to financial settings and sensitive data.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Live Demo Banner */}
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWF1dHklMjBzYWxvbnxlbnwxfHx8fDE3NjYzNDk3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Salon"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                      <div className="inline-flex items-center gap-2 bg-green-500 rounded-full px-3 py-1 text-xs font-medium mb-3 w-fit">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Live Demo Active
                      </div>
                      <h2 className="text-3xl font-bold mb-2">
                        See how the demo salon works in real-time
                      </h2>
                      <p className="text-white/90">
                        Experience the power of AI-driven booking and management.
                      </p>
                    </div>
                  </div>

                  {/* Monthly Goal */}
                  <Card className="border-none bg-gradient-to-r from-purple-600 to-purple-500 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold mb-1">Salon Monthly Goal</h3>
                          <p className="text-sm text-purple-100">Keep pushing! You are doing great.</p>
                        </div>
                        <Trophy className="w-10 h-10 text-yellow-300" />
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Progress ($23122 / $45630)</span>
                          <span className="font-bold">62%</span>
                        </div>
                        <div className="w-full bg-purple-400 rounded-full h-3">
                          <div className="bg-white rounded-full h-3" style={{ width: '62%' }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Revenue - Only for Owner */}
                    {activeRole !== 'admin' && (
                      <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                              <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
                          <div className="text-3xl font-bold text-gray-900">{formatPrice(12334)}</div>
                          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                            <div>
                              <div className="text-gray-500">Card</div>
                              <div className="font-medium">{formatPrice(6939)}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Cash</div>
                              <div className="font-medium">{formatPrice(4112)}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Tips</div>
                              <div className="font-medium">{formatPrice(2284)}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mb-1">New Clients</div>
                        <div className="text-3xl font-bold text-gray-900">42</div>
                        <div className="text-xs text-green-600 mt-2">↑ +6% vs last month</div>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mb-1">AI Booking</div>
                        <div className="text-3xl font-bold text-gray-900">24</div>
                        <div className="text-xs text-gray-500 mt-2">🔒 High Offered</div>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                            <Share2 className="w-6 h-6 text-pink-600" />
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mb-1">Saves & Shares</div>
                        <div className="text-3xl font-bold text-gray-900">171</div>
                        <div className="text-xs text-red-600 mt-2">↑ high interest</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Calendar */}
                    <button
                      onClick={() => isFeatureAvailable('calendar') && setActiveTab('calendar')}
                      disabled={!isFeatureAvailable('calendar')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('calendar')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('calendar') ? 'bg-blue-100' : 'bg-gray-200'
                      }`}>
                        <Calendar className={`w-6 h-6 ${isFeatureAvailable('calendar') ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('calendar') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Calendar
                      </h3>
                      <p className="text-sm text-gray-500">Manage bookings</p>
                      {!isFeatureAvailable('calendar') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('calendar')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Masters */}
                    <button
                      onClick={() => isFeatureAvailable('masters') && setActiveTab('masters')}
                      disabled={!isFeatureAvailable('masters')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('masters')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('masters') ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        <Scissors className={`w-6 h-6 ${isFeatureAvailable('masters') ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('masters') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Masters
                      </h3>
                      <p className="text-sm text-gray-500">Manage staff</p>
                      {!isFeatureAvailable('masters') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('masters')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Client Database */}
                    <button
                      onClick={() => isFeatureAvailable('clients') && setActiveTab('clients')}
                      disabled={!isFeatureAvailable('clients')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('clients')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('clients') ? 'bg-pink-100' : 'bg-gray-200'
                      }`}>
                        <Heart className={`w-6 h-6 ${isFeatureAvailable('clients') ? 'text-pink-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('clients') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Client Database
                      </h3>
                      <p className="text-sm text-gray-500">History & Favorites</p>
                      {!isFeatureAvailable('clients') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('clients')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* menu/Services */}
                    <button
                      onClick={() => isFeatureAvailable('services') && setActiveTab('services')}
                      disabled={!isFeatureAvailable('services')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('services')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('services') ? 'bg-purple-100' : 'bg-gray-200'
                      }`}>
                        <Scissors className={`w-6 h-6 ${isFeatureAvailable('services') ? 'text-purple-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('services') ? 'text-gray-900' : 'text-gray-400'}`}>
                        menu/Services
                      </h3>
                      <p className="text-sm text-gray-500">Manage services</p>
                      {!isFeatureAvailable('services') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('services')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Beauty Feed */}
                    <button
                      onClick={() => isFeatureAvailable('feed') && setActiveTab('feed')}
                      disabled={!isFeatureAvailable('feed')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('feed')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('feed') ? 'bg-pink-100' : 'bg-gray-200'
                      }`}>
                        <Rss className={`w-6 h-6 ${isFeatureAvailable('feed') ? 'text-pink-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('feed') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Beauty Feed
                      </h3>
                      <p className="text-sm text-gray-500">Showcase Work</p>
                      {!isFeatureAvailable('feed') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('feed')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Marketing */}
                    <button
                      onClick={() => isFeatureAvailable('marketing') && setActiveTab('marketing')}
                      disabled={!isFeatureAvailable('marketing')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('marketing')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('marketing') ? 'bg-blue-100' : 'bg-gray-200'
                      }`}>
                        <Mail className={`w-6 h-6 ${isFeatureAvailable('marketing') ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('marketing') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Marketing
                      </h3>
                      <p className="text-sm text-gray-500">Promote salon</p>
                      {!isFeatureAvailable('marketing') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('marketing')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Analytics */}
                    <button
                      onClick={() => isFeatureAvailable('analytics') && setActiveTab('analytics')}
                      disabled={!isFeatureAvailable('analytics')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('analytics')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('analytics') ? 'bg-indigo-100' : 'bg-gray-200'
                      }`}>
                        <BarChart3 className={`w-6 h-6 ${isFeatureAvailable('analytics') ? 'text-indigo-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('analytics') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Analytics
                      </h3>
                      <p className="text-sm text-gray-500">View reports</p>
                      {!isFeatureAvailable('analytics') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('analytics')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* AI Tools */}
                    <button
                      onClick={() => isFeatureAvailable('ai-tools') && setActiveTab('ai-tools')}
                      disabled={!isFeatureAvailable('ai-tools')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('ai-tools')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('ai-tools') ? 'bg-purple-100' : 'bg-gray-200'
                      }`}>
                        <Bot className={`w-6 h-6 ${isFeatureAvailable('ai-tools') ? 'text-purple-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('ai-tools') ? 'text-gray-900' : 'text-gray-400'}`}>
                        AI Tools
                      </h3>
                      <p className="text-sm text-gray-500">Configure AI</p>
                      {!isFeatureAvailable('ai-tools') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('ai-tools')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Finance */}
                    <button
                      onClick={() => isFeatureAvailable('finance') && setActiveTab('finance')}
                      disabled={!isFeatureAvailable('finance')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('finance')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('finance') ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        <DollarSign className={`w-6 h-6 ${isFeatureAvailable('finance') ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('finance') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Finance
                      </h3>
                      <p className="text-sm text-gray-500">Manage finances</p>
                      {!isFeatureAvailable('finance') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('finance')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Products */}
                    <button
                      onClick={() => isFeatureAvailable('products') && setActiveTab('products')}
                      disabled={!isFeatureAvailable('products')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('products')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('products') ? 'bg-cyan-100' : 'bg-gray-200'
                      }`}>
                        <Package className={`w-6 h-6 ${isFeatureAvailable('products') ? 'text-cyan-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('products') ? 'text-gray-900' : 'text-gray-400'}`}>
                        products
                      </h3>
                      <p className="text-sm text-gray-500">manage/marketplace</p>
                      {!isFeatureAvailable('products') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('products')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Salon Settings */}
                    <button
                      onClick={() => isFeatureAvailable('settings') && setActiveTab('settings')}
                      disabled={!isFeatureAvailable('settings')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('settings')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('settings') ? 'bg-slate-100' : 'bg-gray-200'
                      }`}>
                        <Settings className={`w-6 h-6 ${isFeatureAvailable('settings') ? 'text-slate-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('settings') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Salon Settings
                      </h3>
                      <p className="text-sm text-gray-500">Profile & Photos</p>
                      {!isFeatureAvailable('settings') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('settings')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Inventory */}
                    <button
                      onClick={() => isFeatureAvailable('inventory') && setActiveTab('inventory')}
                      disabled={!isFeatureAvailable('inventory')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('inventory')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('inventory') ? 'bg-amber-100' : 'bg-gray-200'
                      }`}>
                        <Package className={`w-6 h-6 ${isFeatureAvailable('inventory') ? 'text-amber-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('inventory') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Inventory
                      </h3>
                      <p className="text-sm text-gray-500">Manage stock</p>
                      {!isFeatureAvailable('inventory') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('inventory')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Attendance */}
                    <button
                      onClick={() => isFeatureAvailable('attendance') && setActiveTab('attendance')}
                      disabled={!isFeatureAvailable('attendance')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('attendance')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('attendance') ? 'bg-teal-100' : 'bg-gray-200'
                      }`}>
                        <Users className={`w-6 h-6 ${isFeatureAvailable('attendance') ? 'text-teal-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('attendance') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Attendance
                      </h3>
                      <p className="text-sm text-gray-500">Track staff</p>
                      {!isFeatureAvailable('attendance') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('attendance')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Reviews */}
                    <button
                      onClick={() => isFeatureAvailable('reviews') && setActiveTab('reviews')}
                      disabled={!isFeatureAvailable('reviews')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('reviews')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('reviews') ? 'bg-yellow-100' : 'bg-gray-200'
                      }`}>
                        <Star className={`w-6 h-6 ${isFeatureAvailable('reviews') ? 'text-yellow-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('reviews') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Reviews
                      </h3>
                      <p className="text-sm text-gray-500">Manage feedback</p>
                      {!isFeatureAvailable('reviews') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('reviews')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Expense */}
                    <button
                      onClick={() => isFeatureAvailable('expense') && setActiveTab('expense')}
                      disabled={!isFeatureAvailable('expense')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('expense')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('expense') ? 'bg-red-100' : 'bg-gray-200'
                      }`}>
                        <DollarSign className={`w-6 h-6 ${isFeatureAvailable('expense') ? 'text-red-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('expense') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Expense
                      </h3>
                      <p className="text-sm text-gray-500">Track costs</p>
                      {!isFeatureAvailable('expense') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('expense')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Loyalty */}
                    <button
                      onClick={() => isFeatureAvailable('loyalty') && setActiveTab('loyalty')}
                      disabled={!isFeatureAvailable('loyalty')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('loyalty')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('loyalty') ? 'bg-fuchsia-100' : 'bg-gray-200'
                      }`}>
                        <Gift className={`w-6 h-6 ${isFeatureAvailable('loyalty') ? 'text-fuchsia-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('loyalty') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Loyalty
                      </h3>
                      <p className="text-sm text-gray-500">Reward clients</p>
                      {!isFeatureAvailable('loyalty') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('loyalty')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Advanced Analytics */}
                    <button
                      onClick={() => isFeatureAvailable('advanced-analytics') && setActiveTab('advanced-analytics')}
                      disabled={!isFeatureAvailable('advanced-analytics')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('advanced-analytics')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('advanced-analytics') ? 'bg-emerald-100' : 'bg-gray-200'
                      }`}>
                        <BarChart3 className={`w-6 h-6 ${isFeatureAvailable('advanced-analytics') ? 'text-emerald-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('advanced-analytics') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Advanced Analytics
                      </h3>
                      <p className="text-sm text-gray-500">Deep dive into data</p>
                      {!isFeatureAvailable('advanced-analytics') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('advanced-analytics')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Notifications */}
                    <button
                      onClick={() => isFeatureAvailable('notifications') && setActiveTab('notifications')}
                      disabled={!isFeatureAvailable('notifications')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('notifications')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('notifications') ? 'bg-orange-100' : 'bg-gray-200'
                      }`}>
                        <Bell className={`w-6 h-6 ${isFeatureAvailable('notifications') ? 'text-orange-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('notifications') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Notifications
                      </h3>
                      <p className="text-sm text-gray-500">Stay informed</p>
                      {!isFeatureAvailable('notifications') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('notifications')}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Waiting List */}
                    <button
                      onClick={() => isFeatureAvailable('waiting-list') && setActiveTab('waiting-list')}
                      disabled={!isFeatureAvailable('waiting-list')}
                      className={`rounded-xl p-6 text-left transition-all border relative group ${
                        isFeatureAvailable('waiting-list')
                          ? 'bg-white hover:shadow-lg border-gray-100 cursor-pointer'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isFeatureAvailable('waiting-list') ? 'bg-rose-100' : 'bg-gray-200'
                      }`}>
                        <Clock className={`w-6 h-6 ${isFeatureAvailable('waiting-list') ? 'text-rose-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`font-bold mb-1 ${isFeatureAvailable('waiting-list') ? 'text-gray-900' : 'text-gray-400'}`}>
                        Waiting List
                      </h3>
                      <p className="text-sm text-gray-500">Manage reservations</p>
                      {!isFeatureAvailable('waiting-list') && (
                        <>
                          <Lock className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                          <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            {getFeatureLockMessage('waiting-list')}
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Other Tabs - Coming Soon */}
              {activeTab === 'calendar' && (
                <CalendarTab onNewBooking={() => console.log('New booking')} />
              )}

              {activeTab === 'clients' && (
                <ClientsTab userRole={activeRole as 'owner' | 'admin' | 'master'} />
              )}

              {activeTab === 'masters' && (
                <MastersTab userRole={activeRole as 'owner' | 'admin' | 'master'} />
              )}

              {activeTab === 'services' && (
                <ServicesTab />
              )}

              {activeTab === 'products' && (
                <ProductsTab />
              )}

              {activeTab === 'feed' && (
                <BeautyFeedTab />
              )}

              {activeTab === 'marketing' && (
                <MarketingTab />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsTab />
              )}

              {activeTab === 'finance' && (
                <FinanceTab />
              )}

              {activeTab === 'settings' && (
                <SalonSettingsTab 
                  salonId="demo-salon-id"
                  initialIsPublished={false}
                />
              )}

              {activeTab === 'ai-tools' && (
                <AIToolsTab />
              )}

              {activeTab === 'inventory' && (
                <InventoryTab userRole={activeRole as 'owner' | 'admin' | 'master'} />
              )}

              {activeTab === 'attendance' && (
                <AttendanceTab userRole={activeRole as 'owner' | 'admin' | 'master'} />
              )}

              {activeTab === 'reviews' && (
                <ReviewsTab userRole={activeRole as 'owner' | 'admin' | 'master'} />
              )}

              {activeTab === 'expense' && (
                <ExpenseTab />
              )}

              {activeTab === 'loyalty' && (
                <LoyaltyTab />
              )}

              {activeTab === 'advanced-analytics' && (
                <AdvancedAnalyticsTab />
              )}

              {activeTab === 'notifications' && (
                <NotificationsFullPage userRole={activeRole as 'owner' | 'admin' | 'master'} />
              )}

              {activeTab === 'waiting-list' && (
                <WaitingListTab userRole={activeRole as 'owner' | 'admin' | 'master'} />
              )}

              {activeTab !== 'overview' && activeTab !== 'calendar' && activeTab !== 'clients' && activeTab !== 'masters' && activeTab !== 'services' && activeTab !== 'products' && activeTab !== 'feed' && activeTab !== 'marketing' && activeTab !== 'analytics' && activeTab !== 'finance' && activeTab !== 'settings' && activeTab !== 'ai-tools' && activeTab !== 'inventory' && activeTab !== 'attendance' && activeTab !== 'reviews' && activeTab !== 'expense' && activeTab !== 'loyalty' && activeTab !== 'advanced-analytics' && activeTab !== 'notifications' && activeTab !== 'waiting-list' && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
                    <ChevronRight className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    This section is interactive in the full demo.<br />
                    Subscribe to explore all features!
                  </p>
                  <Button 
                    onClick={onClose}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}