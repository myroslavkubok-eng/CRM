import { useState } from 'react';
import { Gift, Trophy, Star, TrendingUp, Users, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';

interface LoyaltyMember {
  id: string;
  name: string;
  tier: 'Bronze' | 'Silver' | 'Gold';
  points: number;
  totalSpent: number;
  visits: number;
  joinDate: string;
  nextReward: string;
}

export function LoyaltyTab() {
  const { formatPrice } = useCurrency();
  const [activeView, setActiveView] = useState<'members' | 'settings'>('members');

  // Mock data
  const [members] = useState<LoyaltyMember[]>([
    {
      id: '1',
      name: 'Emma Watson',
      tier: 'Gold',
      points: 6450,
      totalSpent: 6450,
      visits: 28,
      joinDate: '2024-01-15',
      nextReward: '50 points to free haircut'
    },
    {
      id: '2',
      name: 'Sarah Martinez',
      tier: 'Silver',
      points: 2340,
      totalSpent: 2340,
      visits: 12,
      joinDate: '2024-03-20',
      nextReward: '160 points to Gold tier'
    },
    {
      id: '3',
      name: 'Maria Lopez',
      tier: 'Bronze',
      points: 680,
      totalSpent: 680,
      visits: 5,
      joinDate: '2024-10-01',
      nextReward: '320 points to Silver tier'
    },
    {
      id: '4',
      name: 'Jessica Brown',
      tier: 'Gold',
      points: 8920,
      totalSpent: 8920,
      visits: 42,
      joinDate: '2023-11-10',
      nextReward: 'VIP status unlocked!'
    },
    {
      id: '5',
      name: 'Lisa Taylor',
      tier: 'Silver',
      points: 1850,
      totalSpent: 1850,
      visits: 9,
      joinDate: '2024-05-12',
      nextReward: '650 points to Gold tier'
    }
  ]);

  const totalMembers = members.length;
  const goldMembers = members.filter(m => m.tier === 'Gold').length;
  const silverMembers = members.filter(m => m.tier === 'Silver').length;
  const bronzeMembers = members.filter(m => m.tier === 'Bronze').length;
  const totalPointsIssued = members.reduce((sum, m) => sum + m.points, 0);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🏆' };
      case 'Silver': return { bg: 'bg-gray-200', text: 'text-gray-700', icon: '🥈' };
      case 'Bronze': return { bg: 'bg-orange-100', text: 'text-orange-700', icon: '🥉' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '⭐' };
    }
  };

  const getTierDiscount = (tier: string) => {
    switch (tier) {
      case 'Gold': return '15%';
      case 'Silver': return '10%';
      case 'Bronze': return '5%';
      default: return '0%';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Gift className="w-8 h-8 text-purple-600" />
            Loyalty Program
          </h1>
          <p className="text-gray-500 mt-1">Reward loyal clients and boost retention</p>
        </div>
        <div className="flex items-center gap-2">
          {(['members', 'settings'] as const).map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === view
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Gold Members</p>
                <p className="text-2xl font-bold text-yellow-900">{goldMembers}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Points Issued</p>
                <p className="text-2xl font-bold text-gray-900">{totalPointsIssued.toLocaleString()}</p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Points/Member</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(totalPointsIssued / totalMembers)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {activeView === 'settings' ? (
        /* Loyalty Settings */
        <div className="space-y-6">
          {/* Tier Structure */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Membership Tiers</h3>
              <div className="space-y-4">
                {/* Gold Tier */}
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                      <h4 className="font-bold text-yellow-900">Gold Tier</h4>
                    </div>
                    <span className="text-sm font-medium text-yellow-700">5,000+ points</span>
                  </div>
                  <p className="text-sm text-yellow-800 mb-2">Premium benefits for VIP clients</p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>✓ 15% discount on all services</li>
                    <li>✓ Birthday bonus: 2x points</li>
                    <li>✓ Priority booking</li>
                    <li>✓ Free add-ons</li>
                  </ul>
                </div>

                {/* Silver Tier */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-gray-600" />
                      <h4 className="font-bold text-gray-900">Silver Tier</h4>
                    </div>
                    <span className="text-sm font-medium text-gray-700">1,000-4,999 points</span>
                  </div>
                  <p className="text-sm text-gray-800 mb-2">Enhanced rewards for regular clients</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ 10% discount on all services</li>
                    <li>✓ Birthday bonus: 1.5x points</li>
                    <li>✓ Special offers access</li>
                  </ul>
                </div>

                {/* Bronze Tier */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gift className="w-6 h-6 text-orange-600" />
                      <h4 className="font-bold text-orange-900">Bronze Tier</h4>
                    </div>
                    <span className="text-sm font-medium text-orange-700">0-999 points</span>
                  </div>
                  <p className="text-sm text-orange-800 mb-2">Welcome benefits for new members</p>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>✓ 5% discount on all services</li>
                    <li>✓ Earn 1 point per AED spent</li>
                    <li>✓ Welcome bonus: 100 points</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Points Settings */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Points System</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Earning Rate</p>
                    <p className="text-sm text-gray-600">1 point per AED spent</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Referral Bonus</p>
                    <p className="text-sm text-gray-600">500 points for each new client referred</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Birthday Reward</p>
                    <p className="text-sm text-gray-600">2x points during birthday month</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Members List */
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Loyalty Members</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Member</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Tier</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Points</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Total Spent</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Visits</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Join Date</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Next Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members
                    .sort((a, b) => b.points - a.points)
                    .map(member => {
                      const tierConfig = getTierColor(member.tier);
                      return (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                <span className="font-bold text-purple-600">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="font-medium text-gray-900">{member.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${tierConfig.bg} ${tierConfig.text}`}>
                                {tierConfig.icon} {member.tier}
                              </span>
                              <span className="text-xs text-gray-500">({getTierDiscount(member.tier)} off)</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-purple-600">{member.points.toLocaleString()}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-900">{formatPrice(member.totalSpent)}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-900">{member.visits}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600">{member.joinDate}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs text-gray-500">{member.nextReward}</span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
