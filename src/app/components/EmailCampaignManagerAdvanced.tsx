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
  roleTargeting?: 'owners_only' | 'owners_admins' | 'owners_admins_masters' | 'owners_leads' | 'owners_admins_leads' | 'everyone';
  recipientsBreakdown?: {
    leads?: number;
    owners?: number;
    admins?: number;
    masters?: number;
    salons?: number;
    basic?: number;
    standard?: number;
    business?: number;
  };
}

export function EmailCampaignManagerAdvanced() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New campaign form states
  const [newCampaignAudience, setNewCampaignAudience] = useState<'salons' | 'leads' | 'both'>('salons');
  const [newCampaignDelivery, setNewCampaignDelivery] = useState<'email' | 'dashboard' | 'both'>('both');
  const [selectedPlan, setSelectedPlan] = useState('all');

  // Demo data
  const totalLeads = 456; // From SuperAdminLeadsPage
  const totalSalons = { basic: 687, standard: 243, business: 369, total: 1299 };

  // Demo campaigns with NEW fields
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: 1,
      name: '🎄 Christmas Special Offer',
      type: 'holiday',
      subject: '25% OFF Holiday Promo - Spread Joy This Christmas! 🎁',
      recipients: 1755, // 1299 salons + 456 leads
      status: 'scheduled',
      scheduledDate: '2024-12-25 09:00',
      preview: 'Celebrate this Christmas with exclusive 25% discount on all annual plans...',
      audience: 'both',
      deliveryMethod: 'both',
      recipientsBreakdown: {
        leads: 456,
        salons: 1299,
        basic: 687,
        standard: 243,
        business: 369,
      },
    },
    {
      id: 2,
      name: '✨ New AI Features Launch',
      type: 'feature',
      subject: 'Introducing AI-Powered Booking Assistant 🤖',
      recipients: 1299,
      status: 'sent',
      sentDate: '2024-12-20',
      openRate: 68.5,
      clickRate: 24.3,
      preview: 'We\'re excited to announce our new AI assistant...',
      audience: 'salons',
      deliveryMethod: 'both', // Email + Dashboard notification
      recipientsBreakdown: {
        salons: 1299,
        basic: 687,
        standard: 243,
        business: 369,
      },
    },
    {
      id: 3,
      name: '🚀 Welcome Leads to Katia',
      type: 'promo',
      subject: 'Special First-Time Offer: 40% OFF Your First Month! 🎉',
      recipients: 456,
      status: 'sent',
      sentDate: '2024-12-18',
      openRate: 78.2,
      clickRate: 35.8,
      preview: 'Thank you for your interest! Here\'s an exclusive offer just for you...',
      audience: 'leads',
      deliveryMethod: 'email', // Leads don't have dashboard access
      recipientsBreakdown: {
        leads: 456,
      },
    },
  ]);

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'holiday': return <Gift className="w-4 h-4" />;
      case 'feature': return <Sparkles className="w-4 h-4" />;
      case 'promo': return <TrendingUp className="w-4 h-4" />;
      case 'announcement': return <Star className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <Badge className="bg-gray-100 text-gray-700">Draft</Badge>;
      case 'scheduled': return <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>;
      case 'sending': return <Badge className="bg-amber-100 text-amber-700">Sending...</Badge>;
      case 'sent': return <Badge className="bg-green-100 text-green-700">Sent</Badge>;
      default: return null;
    }
  };

  const calculateRecipients = () => {
    let count = 0;
    
    if (newCampaignAudience === 'leads' || newCampaignAudience === 'both') {
      count += totalLeads;
    }
    
    if (newCampaignAudience === 'salons' || newCampaignAudience === 'both') {
      if (selectedPlan === 'all') {
        count += totalSalons.total;
      } else if (selectedPlan === 'basic') {
        count += totalSalons.basic;
      } else if (selectedPlan === 'standard') {
        count += totalSalons.standard;
      } else if (selectedPlan === 'business') {
        count += totalSalons.business;
      }
    }
    
    return count;
  };

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
    avgOpenRate: campaigns
      .filter((c) => c.openRate)
      .reduce((sum, c) => sum + (c.openRate || 0), 0) /
      campaigns.filter((c) => c.openRate).length || 0,
  };

  return (
    <div className="space-y-6">
      {/* HEADER & STATS */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Email Campaign Manager
              </h2>
              <p className="text-gray-600">📧 Send to Salons & Leads | 📱 Dashboard Notifications</p>
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

        {/* STATS CARDS */}
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
        {filteredCampaigns.map((campaign) => {
          const Icon = getCampaignTypeIcon(campaign.type);
          return (
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
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        campaign.type === 'holiday' ? 'bg-red-100' :
                        campaign.type === 'feature' ? 'bg-purple-100' :
                        campaign.type === 'promo' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {Icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">{campaign.subject}</p>
                        
                        {/* NEW: Audience & Delivery badges */}
                        <div className="flex items-center gap-2 mt-1">
                          {campaign.audience === 'salons' && (
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              <Building2 className="w-3 h-3 mr-1" />
                              Salons Only
                            </Badge>
                          )}
                          {campaign.audience === 'leads' && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              <UserPlus className="w-3 h-3 mr-1" />
                              Leads Only
                            </Badge>
                          )}
                          {campaign.audience === 'both' && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              Salons + Leads
                            </Badge>
                          )}
                          
                          {campaign.deliveryMethod === 'email' && (
                            <Badge className="bg-gray-100 text-gray-700 text-xs">
                              <Mail className="w-3 h-3 mr-1" />
                              Email
                            </Badge>
                          )}
                          {campaign.deliveryMethod === 'dashboard' && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">
                              <LayoutDashboard className="w-3 h-3 mr-1" />
                              Dashboard
                            </Badge>
                          )}
                          {campaign.deliveryMethod === 'both' && (
                            <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                              <Bell className="w-3 h-3 mr-1" />
                              Email + Dashboard
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(campaign.status)}
                  </div>

                  {/* Preview */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{campaign.preview}</p>

                  {/* NEW: Recipients Breakdown */}
                  {campaign.recipientsBreakdown && (
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-bold text-lg text-purple-600">{campaign.recipients}</p>
                      </div>
                      {campaign.recipientsBreakdown.leads && (
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-500">Leads</p>
                          <p className="font-bold text-blue-600">{campaign.recipientsBreakdown.leads}</p>
                        </div>
                      )}
                      {campaign.recipientsBreakdown.basic && (
                        <div className="text-center p-2 bg-purple-50 rounded-lg">
                          <p className="text-xs text-gray-500">Basic</p>
                          <p className="font-bold text-purple-600">{campaign.recipientsBreakdown.basic}</p>
                        </div>
                      )}
                      {campaign.recipientsBreakdown.standard && (
                        <div className="text-center p-2 bg-pink-50 rounded-lg">
                          <p className="text-xs text-gray-500">Standard</p>
                          <p className="font-bold text-pink-600">{campaign.recipientsBreakdown.standard}</p>
                        </div>
                      )}
                      {campaign.recipientsBreakdown.business && (
                        <div className="text-center p-2 bg-amber-50 rounded-lg">
                          <p className="text-xs text-gray-500">Business</p>
                          <p className="font-bold text-amber-600">{campaign.recipientsBreakdown.business}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metrics Grid */}
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
                        Send Now
                      </Button>
                    </>
                  )}

                  {campaign.status === 'scheduled' && (
                    <>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3 mr-1" />
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <XCircle className="w-3 h-3 mr-1" />
                        Cancel
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
          );
        })}
      </div>

      {/* CREATE MODAL - ENHANCED */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Create New Campaign</h2>
              <p className="text-sm text-purple-100">📧 Email + 📱 Dashboard Notifications</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Campaign Type */}
              <div>
                <label className="block text-sm font-bold mb-2">Campaign Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'holiday', label: 'Holiday Special', icon: Gift, color: 'bg-red-100 hover:bg-red-200' },
                    { value: 'feature', label: 'New Features', icon: Sparkles, color: 'bg-purple-100 hover:bg-purple-200' },
                    { value: 'promo', label: 'Promotion', icon: TrendingUp, color: 'bg-green-100 hover:bg-green-200' },
                    { value: 'announcement', label: 'Announcement', icon: Star, color: 'bg-blue-100 hover:bg-blue-200' },
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        className={`p-3 rounded-lg border-2 border-gray-200 ${type.color} transition-all flex items-center gap-2`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold text-sm">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Audience Selection - NEW */}
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <label className="block text-sm font-bold mb-3">🎯 Target Audience</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'salons', label: 'Salons Only', icon: Building2, count: totalSalons.total, color: 'purple' },
                    { value: 'leads', label: 'Leads Only', icon: UserPlus, count: totalLeads, color: 'blue' },
                    { value: 'both', label: 'Salons + Leads', icon: Users, count: totalSalons.total + totalLeads, color: 'green' },
                  ].map((audience) => {
                    const Icon = audience.icon;
                    const isSelected = newCampaignAudience === audience.value;
                    return (
                      <button
                        key={audience.value}
                        onClick={() => setNewCampaignAudience(audience.value as any)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? `border-${audience.color}-500 bg-${audience.color}-100`
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-bold">{audience.label}</p>
                        <p className="text-xs text-gray-600 mt-1">{audience.count} recipients</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Salon Plan Filter - Conditional */}
              {(newCampaignAudience === 'salons' || newCampaignAudience === 'both') && (
                <div>
                  <label className="block text-sm font-bold mb-2">💼 Salon Plan (Optional Filter)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'all', label: 'All Plans', count: totalSalons.total },
                      { value: 'basic', label: 'Basic', count: totalSalons.basic },
                      { value: 'standard', label: 'Standard', count: totalSalons.standard },
                      { value: 'business', label: 'Business', count: totalSalons.business },
                    ].map((plan) => (
                      <button
                        key={plan.value}
                        onClick={() => setSelectedPlan(plan.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedPlan === plan.value
                            ? 'border-purple-500 bg-purple-100'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <p className="text-sm font-bold">{plan.label}</p>
                        <p className="text-xs text-gray-600">{plan.count}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Method - NEW */}
              <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
                <label className="block text-sm font-bold mb-3">📬 Delivery Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { 
                      value: 'email', 
                      label: 'Email Only', 
                      icon: Mail, 
                      desc: 'Send to inbox',
                      disabled: newCampaignAudience === 'leads' ? false : false 
                    },
                    { 
                      value: 'dashboard', 
                      label: 'Dashboard', 
                      icon: LayoutDashboard, 
                      desc: 'In-app notification',
                      disabled: newCampaignAudience === 'leads' // Leads don't have dashboard
                    },
                    { 
                      value: 'both', 
                      label: 'Email + Dashboard', 
                      icon: Bell, 
                      desc: 'Maximum reach',
                      disabled: newCampaignAudience === 'leads'
                    },
                  ].map((delivery) => {
                    const Icon = delivery.icon;
                    const isSelected = newCampaignDelivery === delivery.value;
                    return (
                      <button
                        key={delivery.value}
                        onClick={() => !delivery.disabled && setNewCampaignDelivery(delivery.value as any)}
                        disabled={delivery.disabled}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          delivery.disabled
                            ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-100'
                            : isSelected
                            ? 'border-orange-500 bg-orange-100'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <p className="text-xs font-bold">{delivery.label}</p>
                        <p className="text-xs text-gray-500">{delivery.desc}</p>
                      </button>
                    );
                  })}
                </div>
                {newCampaignAudience === 'leads' && (
                  <p className="text-xs text-orange-700 mt-2">
                    ℹ️ Dashboard notifications only available for active salons
                  </p>
                )}
              </div>

              {/* Total Recipients Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-gray-700">Total Recipients:</span>
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {calculateRecipients().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-bold mb-2">Campaign Name</label>
                <Input placeholder="e.g., Christmas 2024 Special" />
              </div>

              {/* Email Subject */}
              <div>
                <label className="block text-sm font-bold mb-2">Subject Line</label>
                <Input placeholder="e.g., 🎄 25% OFF Holiday Promo!" />
              </div>

              {/* Email Content */}
              <div>
                <label className="block text-sm font-bold mb-2">Message Content</label>
                <textarea
                  className="w-full p-3 border-2 border-gray-300 rounded-lg min-h-[120px]"
                  placeholder="Write your message here... (will be used for both email and dashboard notification)"
                />
              </div>

              {/* Schedule */}
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
                    <option>High (with 🔔 bell icon)</option>
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
                    const recipientCount = calculateRecipients();
                    alert(
                      `✅ Campaign created!\n\n` +
                      `Audience: ${newCampaignAudience}\n` +
                      `Delivery: ${newCampaignDelivery}\n` +
                      `Recipients: ${recipientCount}\n\n` +
                      `(Demo mode - campaign would be sent now)`
                    );
                    setShowCreateModal(false);
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Create & Send Campaign
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}