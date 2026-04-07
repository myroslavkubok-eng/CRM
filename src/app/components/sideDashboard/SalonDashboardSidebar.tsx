import { useState } from 'react';
import { PERMISSIONS } from '../../../types/roles';
import { SalonSwitcher } from '../SalonSwitcher';
import {
  BarChart3, Store, Calendar, Users, Target, Scissors, Package, TrendingUp,
  Gift, Brain, Zap, Settings, Camera, Star, UserPlus, DollarSign, Bell,
  Clock, Image as ImageIcon, MessageSquare, Sparkles, Download, LogOut,
  RefreshCw
} from 'lucide-react';
import type { SidebarProps } from './types';

export function SalonDashboardSidebar({
  currentUser,
  salons,
  currentSalonId,
  activeTab,
  onTabChange,
  onSalonChange,
  onAddSalon,
  onLogout,
}: SidebarProps) {
  const permissions = PERMISSIONS[currentUser.role];

  const menuItems = [
    { id: 'overview', icon: BarChart3, label: 'Overview', roles: ['owner', 'admin', 'master'] },
    { id: 'my-salons', icon: Store, label: '🏪 My Salons', roles: ['owner'] },
    { id: 'calendar', icon: Calendar, label: 'Calendar', roles: ['owner', 'admin'] },
    { id: 'my-schedule', icon: Calendar, label: 'My Schedule', roles: ['master'] },
    { id: 'clients', icon: Users, label: 'Clients', roles: ['owner', 'admin'] },
    { id: 'masters', icon: Target, label: 'Masters & Targets', roles: ['owner', 'admin'] },
    { id: 'services', icon: Scissors, label: 'Services', roles: ['owner', 'admin'] },
    
    // 🚀 GAME-CHANGING FEATURES
    { id: 'package-deals', icon: Package, label: '📦 Package Deals', roles: ['owner'] },
    { id: 'dynamic-pricing', icon: TrendingUp, label: '💰 Dynamic Pricing', roles: ['owner'] },
    { id: 'gift-cards', icon: Gift, label: '🎁 Gift Cards', roles: ['owner', 'admin'] },
    { id: 'referral-program', icon: Gift, label: '💝 Referral Program', roles: ['owner'] },
    { id: 'ai-smart-filling', icon: Brain, label: '🤖 AI Smart Filling', roles: ['owner'] },
    { id: 'advanced-forecasting', icon: Zap, label: '⚡ Forecasting', roles: ['owner'] },
    { id: 'booking-settings', icon: Settings, label: '⚙️ Booking Settings', roles: ['owner'] },
    
    { id: 'products', icon: Package, label: 'Products', roles: ['admin'] },
    { id: 'beauty-feed', icon: Camera, label: 'Beauty Feed', roles: ['admin'] },
    { id: 'inventory', icon: Package, label: 'Inventory', roles: ['owner', 'admin'] },
    { id: 'attendance', icon: Users, label: 'Attendance', roles: ['owner', 'admin'] },
    { id: 'reviews', icon: Star, label: 'Reviews', roles: ['owner', 'admin'] },
    { id: 'staff', icon: UserPlus, label: 'Staff Management', roles: ['owner'] },
    { id: 'expense', icon: DollarSign, label: 'Expenses', roles: ['owner'] },
    { id: 'loyalty', icon: Gift, label: 'Loyalty Program', roles: ['owner'] },
    { id: 'advanced-analytics', icon: BarChart3, label: 'Advanced Analytics', roles: ['owner'] },
    { id: 'feed-analytics', icon: TrendingUp, label: 'Feed Analytics', roles: ['owner', 'admin'] },
    { id: 'notifications', icon: Bell, label: 'Notifications', roles: ['owner', 'admin', 'master'] },
    { id: 'waiting-list', icon: Clock, label: 'Waiting List', roles: ['owner', 'admin'] },
    { id: 'media', icon: ImageIcon, label: 'Photos & Gallery', roles: ['owner'] },
    { id: 'marketing', icon: MessageSquare, label: 'Marketing', roles: ['owner', 'admin'] },
    { id: 'ai-tools', icon: Sparkles, label: 'AI Tools', roles: ['owner', 'admin'] },
    { id: 'export', icon: Download, label: 'Export Data', roles: ['owner'] },
    { id: 'settings', icon: Settings, label: 'Settings', roles: ['owner', 'admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      {/* User Info */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
            {currentUser.firstName[0]}{currentUser.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">
              {currentUser.firstName} {currentUser.lastName}
            </div>
            <div className="text-xs text-gray-500 capitalize">{currentUser.role}</div>
          </div>
        </div>

        {/* Salon Switcher (for owners with multiple salons) */}
        {permissions.canViewAllSalons && (
          <div className="mb-4">
            <SalonSwitcher
              salons={salons}
              currentSalonId={currentSalonId}
              onSwitch={onSalonChange}
              onAddNew={onAddSalon}
              onManage={() => onTabChange('my-salons')}
            />
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="space-y-1">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
