import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Calendar as CalendarComponent } from '@/app/components/ui/calendar';
import { 
  Calendar as CalendarIcon, Users, DollarSign, TrendingUp,
  BarChart3, Target, Scissors, Camera, MessageSquare, Sparkles,
  Package, Settings, Gift, Star, UserPlus, Clock, Bell
} from 'lucide-react';
import type { TabProps } from '../../components/sideDashboard/types'
import { PERMISSIONS } from '../../../types/roles';

interface OverviewTabProps extends TabProps {
  onTabChange: (tab: string) => void;
}

export function OverviewTab({ currentUser, currentSalon, isDemo, onTabChange }: OverviewTabProps) {
  const permissions = PERMISSIONS[currentUser.role];

  // Mock data - replace with real data from backend
  const stats = {
    todayBookings: 12,
    weekRevenue: 3250,
    totalClients: 245,
    growthRate: 15.3,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentUser.role === 'master' ? 'My Dashboard' : 'Overview'}
        </h1>
        <p className="text-gray-600">
          {currentUser.role === 'master' 
            ? 'View your appointments and schedule'
            : `Welcome back, ${currentUser.firstName}! Here's what's happening today.`
          }
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CalendarIcon className="w-10 h-10 text-purple-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.todayBookings}</div>
                <div className="text-xs text-gray-500">Today's Bookings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {permissions.canViewAnalytics && (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-10 h-10 text-green-600" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${stats.weekRevenue}</div>
                    <div className="text-xs text-gray-500">This Week</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-10 h-10 text-blue-600" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalClients}</div>
                    <div className="text-xs text-gray-500">Total Clients</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-10 h-10 text-orange-600" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">+{stats.growthRate}%</div>
                    <div className="text-xs text-gray-500">Growth Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Calendar Section */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-gray-900">Calendar</h3>
        </CardHeader>
        <CardContent>
          <CalendarComponent
            mode="single"
            selected={new Date()}
            onSelect={(date) => console.log('Selected date:', date)}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-gray-900">
            {currentUser.role === 'master' ? 'My Upcoming Appointments' : 'Recent Bookings'}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No bookings to display</p>
            <p className="text-sm text-gray-400 mt-1">
              {currentUser.role === 'master' 
                ? 'Your appointments will appear here'
                : 'New bookings will appear here'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Modules */}
      {currentUser.role !== 'master' && (
        <Card>
          <CardHeader>
            <h3 className="font-bold text-gray-900">Quick Access</h3>
            <p className="text-sm text-gray-500">Navigate to key features</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Calendar */}
              <button
                onClick={() => onTabChange('calendar')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-blue-100">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">Calendar</h3>
                <p className="text-sm text-gray-500">Manage bookings</p>
              </button>

              {/* Masters */}
              {(currentUser.role === 'owner' || currentUser.role === 'admin') && (
                <button
                  onClick={() => onTabChange('masters')}
                  className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-green-100">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold mb-1 text-gray-900">Masters</h3>
                  <p className="text-sm text-gray-500">Manage staff</p>
                </button>
              )}

              {/* Clients */}
              <button
                onClick={() => onTabChange('clients')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-pink-100">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">Client Database</h3>
                <p className="text-sm text-gray-500">History & Favorites</p>
              </button>

              {/* Services */}
              <button
                onClick={() => onTabChange('services')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-purple-100">
                  <Scissors className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">menu/Services</h3>
                <p className="text-sm text-gray-500">Manage services</p>
              </button>

              {/* Beauty Feed */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => onTabChange('beauty-feed')}
                  className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-pink-100">
                    <Camera className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="font-bold mb-1 text-gray-900">Beauty Feed</h3>
                  <p className="text-sm text-gray-500">Showcase Work</p>
                </button>
              )}

              {/* Marketing */}
              <button
                onClick={() => onTabChange('marketing')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-blue-100">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">Marketing</h3>
                <p className="text-sm text-gray-500">Promote salon</p>
              </button>

              {/* Analytics */}
              <button
                onClick={() => onTabChange('analytics')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-indigo-100">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-500">View reports</p>
              </button>

              {/* AI Tools */}
              <button
                onClick={() => onTabChange('ai-tools')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-purple-100">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">AI Tools</h3>
                <p className="text-sm text-gray-500">Configure AI</p>
              </button>

              {/* Finance */}
              {currentUser.role === 'owner' && (
                <button
                  onClick={() => onTabChange('finance')}
                  className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-green-100">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold mb-1 text-gray-900">Finance</h3>
                  <p className="text-sm text-gray-500">Manage finances</p>
                </button>
              )}

              {/* Products */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => onTabChange('products')}
                  className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-cyan-100">
                    <Package className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h3 className="font-bold mb-1 text-gray-900">products</h3>
                  <p className="text-sm text-gray-500">manage/marketplace</p>
                </button>
              )}

              {/* Salon Settings */}
              <button
                onClick={() => onTabChange('settings')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-slate-100">
                  <Settings className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">Salon Settings</h3>
                <p className="text-sm text-gray-500">Profile & Photos</p>
              </button>

              {/* Inventory */}
              <button
                onClick={() => onTabChange('inventory')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-amber-100">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">Inventory</h3>
                <p className="text-sm text-gray-500">Manage stock</p>
              </button>

              {/* Attendance */}
              <button
                onClick={() => onTabChange('attendance')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-teal-100">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">Attendance</h3>
                <p className="text-sm text-gray-500">Track staff</p>
              </button>

              {/* Reviews */}
              <button
                onClick={() => onTabChange('reviews')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-yellow-100">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">Reviews</h3>
                <p className="text-sm text-gray-500">Manage feedback</p>
              </button>

              {/* Expense */}
              {currentUser.role === 'owner' && (
                <button
                  onClick={() => onTabChange('expense')}
                  className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-red-100">
                    <DollarSign className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-bold mb-1 text-gray-900">Expense</h3>
                  <p className="text-sm text-gray-500">Track costs</p>
                </button>
              )}

              {/* Loyalty */}
              {currentUser.role === 'owner' && (
                <button
                  onClick={() => onTabChange('loyalty')}
                  className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-fuchsia-100">
                    <Gift className="w-6 h-6 text-fuchsia-600" />
                  </div>
                  <h3 className="font-bold mb-1 text-gray-900">Loyalty</h3>
                  <p className="text-sm text-gray-500">Reward clients</p>
                </button>
              )}

              {/* Advanced Analytics */}
              {currentUser.role === 'owner' && (
                <button
                  onClick={() => onTabChange('advanced-analytics')}
                  className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-emerald-100">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold mb-1 text-gray-900">Advanced Analytics</h3>
                  <p className="text-sm text-gray-500">Deep dive into data</p>
                </button>
              )}

              {/* Feed Analytics */}
              {currentUser.role === 'owner' && (
                <button
                  onClick={() => onTabChange('feed-analytics')}
                  className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-indigo-100">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-bold mb-1 text-gray-900">Feed Analytics</h3>
                  <p className="text-sm text-gray-500">Analyze feed performance</p>
                </button>
              )}

              {/* Notifications */}
              <button
                onClick={() => onTabChange('notifications')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-orange-100">
                  <Bell className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">Stay informed</p>
              </button>

              {/* Waiting List */}
              <button
                onClick={() => onTabChange('waiting-list')}
                className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-rose-100">
                  <Clock className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-bold mb-1 text-gray-900">Waiting List</h3>
                <p className="text-sm text-gray-500">Manage reservations</p>
              </button>

              {/* Package Deals */}
              {currentUser.role === 'owner' && (
                <button
                  onClick={() => onTabChange('package-deals')}
                  className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-indigo-100">
                    <Package className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-bold mb-1 text-gray-900">Package Deals</h3>
                  <p className="text-sm text-gray-500">Create and manage deals</p>
                </button>
              )}

              {/* Dynamic Pricing */}
              {currentUser.role === 'owner' && (
                <button
                  onClick={() => onTabChange('dynamic-pricing')}
                  className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-green-100">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold mb-1 text-gray-900">Dynamic Pricing</h3>
                  <p className="text-sm text-gray-500">Adjust prices in real-time</p>
                </button>
              )}

              {/* Referral Program */}
              {currentUser.role === 'owner' && (
                <button
                  onClick={() => onTabChange('referral-program')}
                  className="rounded-xl p-6 text-left transition-all border bg-white hover:shadow-lg border-gray-100 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-blue-100">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold mb-1 text-gray-900">Referral Program</h3>
                  <p className="text-sm text-gray-500">Encourage client referrals</p>
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
