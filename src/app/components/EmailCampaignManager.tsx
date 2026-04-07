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
  Heart,
  Zap,
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
  audience?: 'salons' | 'leads' | 'both';
  deliveryMethod?: 'email' | 'dashboard' | 'both';
  recipientsBreakdown?: {
    leads?: number;
    salons?: number;
    basic?: number;
    standard?: number;
    business?: number;
  };
}

export function EmailCampaignManager() {
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New campaign form states
  const [newCampaignAudience, setNewCampaignAudience] = useState<'salons' | 'leads' | 'both'>('salons');
  const [newCampaignDelivery, setNewCampaignDelivery] = useState<'email' | 'dashboard' | 'both'>('email');
  const [selectedPlan, setSelectedPlan] = useState('all');

  // Demo campaigns
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: 1,
      name: '🎄 Christmas Special Offer',
      type: 'holiday',
      subject: '25% OFF Holiday Promo - Spread Joy This Christmas! 🎁',
      recipients: 1299,
      status: 'scheduled',
      scheduledDate: '2024-12-25 09:00',
      preview: 'Celebrate this Christmas with exclusive 25% discount on all annual plans...',
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
      preview: 'We\'re excited to announce our new AI assistant that helps automate bookings...',
    },
    {
      id: 3,
      name: '🎉 New Year 2025 Campaign',
      type: 'holiday',
      subject: 'New Year, New Features! Start 2025 with Katia 🎊',
      recipients: 1299,
      status: 'draft',
      preview: 'Ring in the new year with exclusive features and special pricing...',
    },
    {
      id: 4,
      name: '���� Black Friday Deal',
      type: 'promo',
      subject: 'BLACK FRIDAY: 40% OFF Annual Plans! Limited Time ⚡',
      recipients: 1299,
      status: 'sent',
      sentDate: '2024-11-29',
      openRate: 82.3,
      clickRate: 45.7,
      preview: 'Our biggest sale of the year! Get 40% off all annual subscriptions...',
    },
    {
      id: 5,
      name: '📱 Mobile App Release',
      type: 'announcement',
      subject: 'Katia Mobile App is Now Live! 📲',
      recipients: 1299,
      status: 'scheduled',
      scheduledDate: '2025-01-15 10:00',
      preview: 'Manage your salon on the go! Download our new mobile app today...',
    },
  ]);

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'holiday':
        return <Gift className="w-4 h-4" />;
      case 'feature':
        return <Sparkles className="w-4 h-4" />;
      case 'promo':
        return <TrendingUp className="w-4 h-4" />;
      case 'announcement':
        return <Star className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>;
      case 'sending':
        return <Badge className="bg-amber-100 text-amber-700">Sending...</Badge>;
      case 'sent':
        return <Badge className="bg-green-100 text-green-700">Sent</Badge>;
      default:
        return null;
    }
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
              <p className="text-gray-600">Send holiday greetings, new features & promotions</p>
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
        {filteredCampaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No campaigns found</p>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => {
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
                          {Icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">{campaign.subject}</p>
                        </div>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>

                    {/* Preview */}
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{campaign.preview}</p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Recipients</p>
                          <p className="font-bold">{campaign.recipients.toLocaleString()}</p>
                        </div>
                      </div>

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
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
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

                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Create New Campaign</h2>
              <p className="text-sm text-purple-100">Send emails to all salon owners</p>
            </div>

            <div className="p-6 space-y-4">
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
                        className={`p-4 rounded-lg border-2 border-gray-200 ${type.color} transition-all flex items-center gap-3`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Campaign Name</label>
                <Input placeholder="e.g., Christmas 2024 Special" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Email Subject</label>
                <Input placeholder="e.g., 🎄 25% OFF Holiday Promo!" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Email Content</label>
                <textarea
                  className="w-full p-3 border-2 border-gray-300 rounded-lg min-h-[150px]"
                  placeholder="Write your email content here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Recipients</label>
                  <select className="w-full p-2 border-2 border-gray-300 rounded-lg">
                    <option>All Salon Owners (1,299)</option>
                    <option>Basic Plan Only (687)</option>
                    <option>Standard Plan Only (243)</option>
                    <option>Business Plan Only (369)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Schedule</label>
                  <select className="w-full p-2 border-2 border-gray-300 rounded-lg">
                    <option>Send Immediately</option>
                    <option>Schedule for later</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => {
                    alert('Campaign created! (Demo mode)');
                    setShowCreateModal(false);
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}