import { useState } from 'react';
import { TrendingUp, Plus, Sparkles, Target, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Campaign {
  id: string;
  name: string;
  type: string;
  message: string;
  icon: string;
  enabled: boolean;
}

interface BoostPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  badge?: string;
  badgeColor?: string;
  color: string;
  promotion?: string;
}

export function MarketingTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Birthday Special',
      type: 'Birthday Campaign',
      message: '"Happy Birthday {name}! Enjoy 20% off your next visit valid for 7 days. 🎉"',
      icon: '🎂',
      enabled: true
    },
    {
      id: '2',
      name: 'We Miss You',
      type: 'Retention Campaign',
      message: '',
      icon: '⏰',
      enabled: false
    },
    {
      id: '3',
      name: 'Review Request',
      type: 'General Campaign',
      message: '"Thanks for visiting {name}! How was your experience? Leave a review 🌟 ✨"',
      icon: '⭐',
      enabled: true
    }
  ]);

  const boostPackages: BoostPackage[] = [
    {
      id: 'top-placement',
      name: 'Top Placement',
      description: 'Be #1 on Homepage & Search',
      price: 19,
      period: 'week',
      features: [
        'Top of main slider',
        '1st in search results',
        '5x more views'
      ],
      badge: 'PREMIUM',
      badgeColor: 'bg-yellow-500',
      color: 'from-purple-600 to-purple-500',
      promotion: 'First Week $1'
    },
    {
      id: 'smart-spot',
      name: 'Smart Spot',
      description: 'Frequent visibility in list',
      price: 9,
      period: 'week',
      features: [
        '"Recommended" section',
        '2x more views',
        'Highlighted badge'
      ],
      badge: 'RECOMMENDED',
      badgeColor: 'bg-cyan-500',
      color: 'from-blue-600 to-blue-500'
    },
    {
      id: 'holiday-spotlight',
      name: 'Holiday Spotlight',
      description: 'Get booked for the holidays!',
      price: 15,
      period: '3 days',
      features: [
        'Perfect for filling last-minute slots before major holidays',
        '(New Year, Valentine\'s, etc)'
      ],
      badge: 'NEW',
      badgeColor: 'bg-pink-500',
      color: 'from-pink-600 to-pink-500'
    }
  ];

  const toggleCampaign = (id: string) => {
    setCampaigns(prev => 
      prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c)
    );
  };

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      {/* Left Column - Campaigns */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Marketing Notifications</h2>
          <p className="text-sm text-gray-500">Engage your clients</p>
        </div>

        {/* Campaign Performance */}
        <Card className="bg-gray-50 border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Campaign Performance</h3>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="text-xs text-gray-500 mb-1">Impressions</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-2xl font-bold text-gray-900">12.5k</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Clicks</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-2xl font-bold text-gray-900">840</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Bookings</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-2xl font-bold text-gray-900">42</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Revenue</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-2xl font-bold text-gray-900">$1260</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns List */}
        <div className="space-y-3">
          {campaigns.map(campaign => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                      {campaign.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{campaign.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{campaign.type}</p>
                      {campaign.message && (
                        <p className="text-sm text-gray-600 italic">{campaign.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleCampaign(campaign.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      campaign.enabled ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        campaign.enabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Campaign Button */}
        <button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Create Campaign
        </button>
      </div>

      {/* Right Column - Boost Visibility */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Boost Visibility</h2>
          </div>
          <p className="text-sm text-gray-500">Get more bookings by promoting your salon</p>
        </div>

        {boostPackages.map(pkg => (
          <Card key={pkg.id} className={`overflow-hidden border-none bg-gradient-to-br ${pkg.color} text-white`}>
            <CardContent className="p-6">
              {/* Header with Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {pkg.id === 'top-placement' && <Crown className="w-5 h-5 text-yellow-300" />}
                  {pkg.id === 'smart-spot' && <Target className="w-5 h-5 text-cyan-300" />}
                  {pkg.id === 'holiday-spotlight' && <Sparkles className="w-5 h-5 text-pink-300" />}
                  <h3 className="font-bold text-lg">{pkg.name}</h3>
                </div>
                {pkg.badge && (
                  <span className={`${pkg.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                    {pkg.badge}
                  </span>
                )}
              </div>

              <p className="text-sm text-white/90 mb-4">{pkg.description}</p>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">${pkg.price}</span>
                  <span className="text-sm text-white/80">/ {pkg.period}</span>
                </div>
                {pkg.promotion && (
                  <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mt-2">
                    {pkg.promotion}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1 h-1 rounded-full bg-white mt-2 flex-shrink-0" />
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium"
                size="lg"
              >
                {pkg.id === 'top-placement' ? 'Boost Now →' : 
                 pkg.id === 'smart-spot' ? 'Activate →' : 
                 'Enable Spotlight ✨'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
