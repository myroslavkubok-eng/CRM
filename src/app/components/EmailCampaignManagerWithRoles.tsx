import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Mail,
  Send,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  Plus,
  Gift,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Download,
  Copy,
  Star,
  Zap,
  Bell,
  Building2,
  UserPlus,
  LayoutDashboard,
  Crown,
  Shield,
  Scissors,
  Info,
  Image,
  Upload,
  X,
} from 'lucide-react';

interface EmailCampaign {
  id: number;
  name: string;
  type: 'holiday' | 'feature' | 'promo' | 'announcement';
  subject: string;
  recipients: number;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  scheduledDate?: string;
  sentDate?: string;
  openRate?: number;
  clickRate?: number;
  preview: string;
  audience: 'salons' | 'leads' | 'both';
  deliveryMethod: 'email' | 'dashboard' | 'both';
  roleTargeting: 'owners_only' | 'owners_admins' | 'all_staff' | 'owners_leads' | 'owners_admins_leads' | 'everyone';
  recipientsBreakdown?: {
    leads?: number;
    owners?: number;
    admins?: number;
    masters?: number;
  };
}

export function EmailCampaignManagerWithRoles() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [campaignType, setCampaignType] = useState<'holiday' | 'feature' | 'promo' | 'announcement'>('holiday');
  const [newCampaignDelivery, setNewCampaignDelivery] = useState<'email' | 'dashboard' | 'both'>('both');
  const [roleTargeting, setRoleTargeting] = useState<'owners_only' | 'owners_admins' | 'all_staff' | 'owners_leads' | 'owners_admins_leads' | 'everyone'>('owners_only');
  
  // Image states
  const [campaignImage, setCampaignImage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState('');

  // Demo data - realistic numbers
  const totalLeads = 456;
  const totalSalons = 1299;
  const avgMastersPerSalon = 3.5; // В среднем 3-4 мастера на салон
  const avgAdminsPerSalon = 1.2; // Не у всех есть админ

  const totalOwners = totalSalons; // 1299
  const totalAdmins = Math.round(totalSalons * avgAdminsPerSalon); // ~1559
  const totalMasters = Math.round(totalSalons * avgMastersPerSalon); // ~4547

  // Demo campaigns with ROLE TARGETING
  const [campaigns] = useState<EmailCampaign[]>([
    {
      id: 1,
      name: '🎄 Christmas Greetings to All',
      type: 'holiday',
      subject: 'Merry Christmas from Katia Team! 🎁',
      recipients: totalOwners + totalAdmins + totalMasters + totalLeads, // Everyone!
      status: 'scheduled',
      scheduledDate: '2024-12-25 09:00',
      preview: 'Wishing you joy and success this holiday season! Thank you for being part of Katia family...',
      audience: 'both',
      deliveryMethod: 'both',
      roleTargeting: 'everyone',
      recipientsBreakdown: {
        leads: totalLeads,
        owners: totalOwners,
        admins: totalAdmins,
        masters: totalMasters,
      },
    },
    {
      id: 2,
      name: '✨ New AI Features - Owners Only',
      type: 'feature',
      subject: 'New Business Features: AI Analytics & Revenue Forecasting 📊',
      recipients: totalOwners + totalLeads,
      status: 'sent',
      sentDate: '2024-12-20',
      openRate: 72.5,
      clickRate: 28.3,
      preview: 'Exclusive for business owners: Advanced AI analytics, revenue forecasting, and financial insights...',
      audience: 'both',
      deliveryMethod: 'both',
      roleTargeting: 'owners_leads',
      recipientsBreakdown: {
        leads: totalLeads,
        owners: totalOwners,
      },
    },
    {
      id: 3,
      name: '📱 New Booking Features - Owners & Admins',
      type: 'feature',
      subject: 'Enhanced Booking System with SMS Reminders 🔔',
      recipients: totalOwners + totalAdmins + totalLeads,
      status: 'sent',
      sentDate: '2024-12-18',
      openRate: 68.8,
      clickRate: 24.7,
      preview: 'New features for managing bookings: automated SMS reminders, calendar sync, and more...',
      audience: 'both',
      deliveryMethod: 'both',
      roleTargeting: 'owners_admins_leads',
      recipientsBreakdown: {
        leads: totalLeads,
        owners: totalOwners,
        admins: totalAdmins,
      },
    },
    {
      id: 4,
      name: '💰 Subscription Price Change - Owners',
      type: 'announcement',
      subject: 'Important: Pricing Update from January 2025',
      recipients: totalOwners,
      status: 'draft',
      preview: 'We are updating our pricing structure. Lock in current rates by upgrading to annual plan...',
      audience: 'salons',
      deliveryMethod: 'both',
      roleTargeting: 'owners_only',
      recipientsBreakdown: {
        owners: totalOwners,
      },
    },
    {
      id: 5,
      name: '🎉 New Year Party Invite - All Staff',
      type: 'holiday',
      subject: 'You\'re Invited! Katia New Year Celebration 🎊',
      recipients: totalOwners + totalAdmins + totalMasters,
      status: 'scheduled',
      scheduledDate: '2024-12-28 10:00',
      preview: 'Join us for a special New Year celebration! All salon staff welcome...',
      audience: 'salons',
      deliveryMethod: 'both',
      roleTargeting: 'all_staff',
      recipientsBreakdown: {
        owners: totalOwners,
        admins: totalAdmins,
        masters: totalMasters,
      },
    },
  ]);

  // Calculate recipients based on role targeting
  const calculateRecipients = () => {
    let count = 0;
    const breakdown = { owners: 0, admins: 0, masters: 0, leads: 0 };

    switch (roleTargeting) {
      case 'owners_only':
        count = totalOwners;
        breakdown.owners = totalOwners;
        break;
      case 'owners_admins':
        count = totalOwners + totalAdmins;
        breakdown.owners = totalOwners;
        breakdown.admins = totalAdmins;
        break;
      case 'all_staff':
        count = totalOwners + totalAdmins + totalMasters;
        breakdown.owners = totalOwners;
        breakdown.admins = totalAdmins;
        breakdown.masters = totalMasters;
        break;
      case 'owners_leads':
        count = totalOwners + totalLeads;
        breakdown.owners = totalOwners;
        breakdown.leads = totalLeads;
        break;
      case 'owners_admins_leads':
        count = totalOwners + totalAdmins + totalLeads;
        breakdown.owners = totalOwners;
        breakdown.admins = totalAdmins;
        breakdown.leads = totalLeads;
        break;
      case 'everyone':
        count = totalOwners + totalAdmins + totalMasters + totalLeads;
        breakdown.owners = totalOwners;
        breakdown.admins = totalAdmins;
        breakdown.masters = totalMasters;
        breakdown.leads = totalLeads;
        break;
    }

    return { count, breakdown };
  };

  // Smart role suggestions based on campaign type
  const getRoleSuggestions = (type: string) => {
    switch (type) {
      case 'holiday':
        return {
          recommended: 'everyone',
          reason: '🎄 Праздничные поздравления лучше отправить всем сотрудникам салона и лидам',
        };
      case 'feature':
        return {
          recommended: 'owners_leads',
          reason: '✨ Новые функции интересны владельцам (они платят) и лидам (потенциальные клиенты)',
        };
      case 'promo':
        return {
          recommended: 'owners_admins_leads',
          reason: '💰 Промо-акции можно показать владельцам, админам и лидам',
        };
      case 'announcement':
        return {
          recommended: 'owners_only',
          reason: '📢 Важные объявления (особенно о тарифах) только для владельцев',
        };
      default:
        return {
          recommended: 'owners_only',
          reason: 'По умолчанию только владельцам',
        };
    }
  };

  const suggestion = getRoleSuggestions(campaignType);
  const { count: recipientCount, breakdown } = calculateRecipients();

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filterType !== 'all' && campaign.type !== filterType) return false;
    if (searchQuery) {
      return (
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const stats = {
    total: campaigns.length,
    scheduled: campaigns.filter((c) => c.status === 'scheduled').length,
    sent: campaigns.filter((c) => c.status === 'sent').length,
    avgOpenRate:
      campaigns.filter((c) => c.openRate).reduce((sum, c) => sum + (c.openRate || 0), 0) /
        campaigns.filter((c) => c.openRate).length || 0,
  };

  const getRoleTargetingBadge = (role: string) => {
    switch (role) {
      case 'owners_only':
        return (
          <Badge className="bg-amber-100 text-amber-700 text-xs">
            <Crown className="w-3 h-3 mr-1" />
            Owners Only
          </Badge>
        );
      case 'owners_admins':
        return (
          <Badge className="bg-purple-100 text-purple-700 text-xs">
            <Crown className="w-3 h-3 mr-1" />
            Owners + Admins
          </Badge>
        );
      case 'all_staff':
        return (
          <Badge className="bg-green-100 text-green-700 text-xs">
            <Users className="w-3 h-3 mr-1" />
            All Staff
          </Badge>
        );
      case 'owners_leads':
        return (
          <Badge className="bg-blue-100 text-blue-700 text-xs">
            <Crown className="w-3 h-3 mr-1" />
            Owners + Leads
          </Badge>
        );
      case 'owners_admins_leads':
        return (
          <Badge className="bg-indigo-100 text-indigo-700 text-xs">
            <Users className="w-3 h-3 mr-1" />
            Owners + Admins + Leads
          </Badge>
        );
      case 'everyone':
        return (
          <Badge className="bg-pink-100 text-pink-700 text-xs">
            <Users className="w-3 h-3 mr-1" />
            Everyone
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Email Campaign Manager
              </h2>
              <p className="text-gray-600">👤 Role-based targeting | 📧 Email + 📱 Dashboard</p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-5 border-2 border-blue-200 bg-blue-50">
            <Mail className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Total Campaigns</p>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </Card>
          <Card className="p-5 border-2 border-amber-200 bg-amber-50">
            <Clock className="w-8 h-8 text-amber-600 mb-2" />
            <p className="text-sm text-gray-600">Scheduled</p>
            <p className="text-3xl font-bold text-amber-600">{stats.scheduled}</p>
          </Card>
          <Card className="p-5 border-2 border-green-200 bg-green-50">
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Sent</p>
            <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
          </Card>
          <Card className="p-5 border-2 border-purple-200 bg-purple-50">
            <Eye className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">Avg Open Rate</p>
            <p className="text-3xl font-bold text-purple-600">{stats.avgOpenRate.toFixed(1)}%</p>
          </Card>
        </div>
      </div>

      {/* FILTERS */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">Type:</span>
            {[
              { value: 'all', label: 'All', icon: Filter },
              { value: 'holiday', label: 'Holiday', icon: Gift },
              { value: 'feature', label: 'Features', icon: Sparkles },
              { value: 'promo', label: 'Promo', icon: TrendingUp },
              { value: 'announcement', label: 'News', icon: Star },
            ].map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  size="sm"
                  variant={filterType === type.value ? 'default' : 'outline'}
                  onClick={() => setFilterType(type.value)}
                  className={filterType === type.value ? 'bg-purple-600' : ''}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* CAMPAIGNS LIST */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className={`p-6 border-2 transition-all hover:shadow-lg ${
              campaign.status === 'scheduled'
                ? 'border-blue-200 bg-blue-50/30'
                : campaign.status === 'sent'
                ? 'border-green-200 bg-green-50/30'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        campaign.type === 'holiday'
                          ? 'bg-red-100'
                          : campaign.type === 'feature'
                          ? 'bg-purple-100'
                          : campaign.type === 'promo'
                          ? 'bg-green-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      {campaign.type === 'holiday' && <Gift className="w-5 h-5" />}
                      {campaign.type === 'feature' && <Sparkles className="w-5 h-5" />}
                      {campaign.type === 'promo' && <TrendingUp className="w-5 h-5" />}
                      {campaign.type === 'announcement' && <Star className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getRoleTargetingBadge(campaign.roleTargeting)}
                        {campaign.deliveryMethod === 'both' && (
                          <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                            <Bell className="w-3 h-3 mr-1" />
                            Email + Dashboard
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {campaign.status === 'scheduled' && (
                    <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>
                  )}
                  {campaign.status === 'sent' && (
                    <Badge className="bg-green-100 text-green-700">Sent</Badge>
                  )}
                  {campaign.status === 'draft' && (
                    <Badge className="bg-gray-100 text-gray-700">Draft</Badge>
                  )}
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{campaign.preview}</p>

                {/* Recipients Breakdown */}
                {campaign.recipientsBreakdown && (
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-bold text-purple-600">{campaign.recipients.toLocaleString()}</p>
                    </div>
                    {campaign.recipientsBreakdown.owners && (
                      <div className="text-center p-2 bg-amber-50 rounded-lg">
                        <p className="text-xs text-gray-500">👑 Owners</p>
                        <p className="font-bold text-amber-600">
                          {campaign.recipientsBreakdown.owners.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {campaign.recipientsBreakdown.admins && (
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-500">🛡️ Admins</p>
                        <p className="font-bold text-purple-600">
                          {campaign.recipientsBreakdown.admins.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {campaign.recipientsBreakdown.masters && (
                      <div className="text-center p-2 bg-pink-50 rounded-lg">
                        <p className="text-xs text-gray-500">✂️ Masters</p>
                        <p className="font-bold text-pink-600">
                          {campaign.recipientsBreakdown.masters.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {campaign.recipientsBreakdown.leads && (
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-500">🎯 Leads</p>
                        <p className="font-bold text-blue-600">
                          {campaign.recipientsBreakdown.leads.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-4 text-sm">
                  {campaign.scheduledDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">Scheduled</p>
                        <p className="font-bold text-blue-600">{campaign.scheduledDate}</p>
                      </div>
                    </div>
                  )}
                  {campaign.sentDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500">Sent</p>
                        <p className="font-bold text-green-600">{campaign.sentDate}</p>
                      </div>
                    </div>
                  )}
                  {campaign.openRate && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="text-xs text-gray-500">Open Rate</p>
                        <p className="font-bold text-purple-600">{campaign.openRate}%</p>
                      </div>
                    </div>
                  )}
                  {campaign.clickRate && (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <div>
                        <p className="text-xs text-gray-500">Click Rate</p>
                        <p className="font-bold text-amber-600">{campaign.clickRate}%</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 min-w-[120px]">
                <Button size="sm" variant="outline">
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                {campaign.status === 'draft' && (
                  <>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Send className="w-3 h-3 mr-1" />
                      Send
                    </Button>
                  </>
                )}
                {campaign.status === 'sent' && (
                  <>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3 mr-1" />
                      Report
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="w-3 h-3 mr-1" />
                      Duplicate
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Create New Campaign</h2>
              <p className="text-sm text-purple-100">🎯 Smart role-based targeting</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Campaign Type */}
              <div>
                <label className="block text-sm font-bold mb-2">Campaign Type</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: 'holiday', label: 'Holiday', icon: Gift, color: 'red' },
                    { value: 'feature', label: 'Features', icon: Sparkles, color: 'purple' },
                    { value: 'promo', label: 'Promo', icon: TrendingUp, color: 'green' },
                    { value: 'announcement', label: 'News', icon: Star, color: 'blue' },
                  ].map((type) => {
                    const Icon = type.icon;
                    const isSelected = campaignType === type.value;
                    return (
                      <button
                        key={type.value}
                        onClick={() => {
                          setCampaignType(type.value as any);
                          // Auto-select recommended role targeting
                          const rec = getRoleSuggestions(type.value);
                          setRoleTargeting(rec.recommended as any);
                        }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? `border-${type.color}-500 bg-${type.color}-100`
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <p className="text-sm font-bold">{type.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Smart Suggestion */}
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-900">Рекомендация:</p>
                    <p className="text-sm text-blue-700">{suggestion.reason}</p>
                  </div>
                </div>
              </div>

              {/* Role Targeting - MAIN FEATURE */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-200">
                <label className="block text-sm font-bold mb-3">👥 Target Roles</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: 'owners_only',
                      icon: Crown,
                      label: 'Owners Only',
                      desc: 'Только владельцы салонов',
                      recipients: totalOwners,
                    },
                    {
                      value: 'owners_admins',
                      icon: Shield,
                      label: 'Owners + Admins',
                      desc: 'Владельцы и администраторы',
                      recipients: totalOwners + totalAdmins,
                    },
                    {
                      value: 'all_staff',
                      icon: Users,
                      label: 'All Salon Staff',
                      desc: 'Владельцы, админы, мастера',
                      recipients: totalOwners + totalAdmins + totalMasters,
                    },
                    {
                      value: 'owners_leads',
                      icon: UserPlus,
                      label: 'Owners + Leads',
                      desc: 'Владельцы и потенциальные клиенты',
                      recipients: totalOwners + totalLeads,
                    },
                    {
                      value: 'owners_admins_leads',
                      icon: Building2,
                      label: 'Owners + Admins + Leads',
                      desc: 'Бизнес-аудитория',
                      recipients: totalOwners + totalAdmins + totalLeads,
                    },
                    {
                      value: 'everyone',
                      icon: Users,
                      label: 'Everyone',
                      desc: 'Все пользователи системы',
                      recipients: totalOwners + totalAdmins + totalMasters + totalLeads,
                    },
                  ].map((role) => {
                    const Icon = role.icon;
                    const isSelected = roleTargeting === role.value;
                    const isRecommended = suggestion.recommended === role.value;
                    return (
                      <button
                        key={role.value}
                        onClick={() => setRoleTargeting(role.value as any)}
                        className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                          isSelected
                            ? 'border-purple-500 bg-purple-100 shadow-md'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        {isRecommended && (
                          <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                            ✨ Recommended
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-purple-600" />
                          <div className="flex-1">
                            <p className="font-bold text-sm">{role.label}</p>
                            <p className="text-xs text-gray-600">{role.desc}</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-purple-600">{role.recipients.toLocaleString()}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipients Breakdown */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold">Total Recipients:</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {recipientCount.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {breakdown.owners > 0 && (
                    <div className="text-center p-2 bg-amber-100 rounded">
                      <p className="text-xs">👑 Owners</p>
                      <p className="font-bold text-amber-700">{breakdown.owners.toLocaleString()}</p>
                    </div>
                  )}
                  {breakdown.admins > 0 && (
                    <div className="text-center p-2 bg-purple-100 rounded">
                      <p className="text-xs">🛡️ Admins</p>
                      <p className="font-bold text-purple-700">{breakdown.admins.toLocaleString()}</p>
                    </div>
                  )}
                  {breakdown.masters > 0 && (
                    <div className="text-center p-2 bg-pink-100 rounded">
                      <p className="text-xs">✂️ Masters</p>
                      <p className="font-bold text-pink-700">{breakdown.masters.toLocaleString()}</p>
                    </div>
                  )}
                  {breakdown.leads > 0 && (
                    <div className="text-center p-2 bg-blue-100 rounded">
                      <p className="text-xs">🎯 Leads</p>
                      <p className="font-bold text-blue-700">{breakdown.leads.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Method */}
              <div>
                <label className="block text-sm font-bold mb-2">Delivery Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'email', label: 'Email Only', icon: Mail },
                    { value: 'dashboard', label: 'Dashboard Only', icon: LayoutDashboard },
                    { value: 'both', label: 'Email + Dashboard', icon: Bell },
                  ].map((delivery) => {
                    const Icon = delivery.icon;
                    const isSelected = newCampaignDelivery === delivery.value;
                    return (
                      <button
                        key={delivery.value}
                        onClick={() => setNewCampaignDelivery(delivery.value as any)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-100'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <p className="text-sm font-bold">{delivery.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-bold mb-2">Campaign Name</label>
                <Input placeholder="e.g., Christmas 2024 Greetings" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Subject Line</label>
                <Input placeholder="e.g., 🎄 Merry Christmas from Katia Team!" />
              </div>

              {/* Image Upload Section - NEW */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-xl border-2 border-pink-200">
                <label className="block text-sm font-bold mb-3">📸 Campaign Image (Optional)</label>
                
                {!campaignImage ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Upload from Computer */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-all cursor-pointer bg-white">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="image-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setCampaignImage(event.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                          <Upload className="w-8 h-8 text-purple-600 mb-2" />
                          <p className="text-sm font-bold text-gray-700">Upload Image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF</p>
                        </label>
                      </div>

                      {/* Search Unsplash */}
                      <button
                        onClick={() => setShowImagePicker(!showImagePicker)}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-all bg-white"
                      >
                        <Image className="w-8 h-8 text-purple-600 mb-2 mx-auto" />
                        <p className="text-sm font-bold text-gray-700">Browse Stock Photos</p>
                        <p className="text-xs text-gray-500 mt-1">Powered by Unsplash</p>
                      </button>
                    </div>

                    {/* Unsplash Search */}
                    {showImagePicker && (
                      <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                        <div className="flex gap-2 mb-3">
                          <Input
                            placeholder="Search images... (e.g., christmas, sale, beauty)"
                            value={unsplashQuery}
                            onChange={(e) => setUnsplashQuery(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && unsplashQuery) {
                                // Demo: Set a placeholder image
                                setCampaignImage(`https://source.unsplash.com/800x400/?${unsplashQuery}`);
                                setUnsplashQuery('');
                                setShowImagePicker(false);
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              if (unsplashQuery) {
                                setCampaignImage(`https://source.unsplash.com/800x400/?${unsplashQuery}`);
                                setUnsplashQuery('');
                                setShowImagePicker(false);
                              }
                            }}
                            className="bg-purple-600"
                          >
                            <Search className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {['christmas', 'beauty salon', 'new year', 'promotion', 'discount', 'spa'].map((keyword) => (
                            <button
                              key={keyword}
                              onClick={() => {
                                setCampaignImage(`https://source.unsplash.com/800x400/?${keyword}`);
                                setShowImagePicker(false);
                              }}
                              className="px-3 py-2 text-xs bg-purple-100 hover:bg-purple-200 rounded-lg transition-all"
                            >
                              {keyword}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-600 text-center">
                      💡 Images increase email open rates by up to 42%
                    </p>
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={campaignImage}
                      alt="Campaign"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setCampaignImage(null);
                        setShowImagePicker(false);
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                      ✓ Image Added
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Message Content</label>
                <textarea
                  className="w-full p-3 border-2 border-gray-300 rounded-lg min-h-[120px]"
                  placeholder="Write your message here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Schedule</label>
                  <select className="w-full p-3 border-2 border-gray-300 rounded-lg">
                    <option>Send Immediately</option>
                    <option>Schedule for later</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Priority</label>
                  <select className="w-full p-3 border-2 border-gray-300 rounded-lg">
                    <option>Normal</option>
                    <option>High (with 🔔 bell)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => {
                    alert(
                      `✅ Campaign created!\n\n` +
                        `Type: ${campaignType}\n` +
                        `Role Targeting: ${roleTargeting}\n` +
                        `Delivery: ${newCampaignDelivery}\n` +
                        `Total Recipients: ${recipientCount.toLocaleString()}\n\n` +
                        `Breakdown:\n` +
                        `👑 Owners: ${breakdown.owners.toLocaleString()}\n` +
                        `🛡️ Admins: ${breakdown.admins.toLocaleString()}\n` +
                        `✂️ Masters: ${breakdown.masters.toLocaleString()}\n` +
                        `🎯 Leads: ${breakdown.leads.toLocaleString()}`
                    );
                    setShowCreateModal(false);
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Create & Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}