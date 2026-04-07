import { useState } from 'react';
import { Users, Gift, Share2, TrendingUp, Copy, Check, Mail, MessageSquare, Instagram, Facebook, ExternalLink, Sparkles, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface ReferralStats {
  totalReferrals: number;
  successfulConversions: number;
  pendingReferrals: number;
  totalRewardsEarned: number;
  totalRewardsPaid: number;
  conversionRate: number;
}

interface ReferralActivity {
  id: string;
  referrerName: string;
  referrerEmail: string;
  refereeName: string;
  refereeEmail: string;
  status: 'pending' | 'completed' | 'expired';
  referrerReward: number;
  refereeReward: number;
  dateReferred: string;
  dateCompleted?: string;
  firstBookingValue?: number;
}

const mockStats: ReferralStats = {
  totalReferrals: 245,
  successfulConversions: 189,
  pendingReferrals: 34,
  totalRewardsEarned: 18900,
  totalRewardsPaid: 14600,
  conversionRate: 77.14,
};

const mockActivities: ReferralActivity[] = [
  {
    id: '1',
    referrerName: 'Sarah Johnson',
    referrerEmail: 'sarah@email.com',
    refereeName: 'Emily Davis',
    refereeEmail: 'emily@email.com',
    status: 'completed',
    referrerReward: 100,
    refereeReward: 50,
    dateReferred: '2024-12-15',
    dateCompleted: '2024-12-18',
    firstBookingValue: 250,
  },
  {
    id: '2',
    referrerName: 'Maria Garcia',
    referrerEmail: 'maria@email.com',
    refereeName: 'Jessica Wilson',
    refereeEmail: 'jessica@email.com',
    status: 'completed',
    referrerReward: 100,
    refereeReward: 50,
    dateReferred: '2024-12-10',
    dateCompleted: '2024-12-12',
    firstBookingValue: 180,
  },
  {
    id: '3',
    referrerName: 'Lisa Anderson',
    referrerEmail: 'lisa@email.com',
    refereeName: 'Amanda Miller',
    refereeEmail: 'amanda@email.com',
    status: 'pending',
    referrerReward: 100,
    refereeReward: 50,
    dateReferred: '2024-12-20',
  },
  {
    id: '4',
    referrerName: 'Rachel Brown',
    referrerEmail: 'rachel@email.com',
    refereeName: 'Michelle Taylor',
    refereeEmail: 'michelle@email.com',
    status: 'pending',
    referrerReward: 100,
    refereeReward: 50,
    dateReferred: '2024-12-22',
  },
];

interface ReferralProgramConfig {
  referrerReward: number;
  refereeReward: number;
  expirationDays: number;
  minimumBookingValue: number;
  enabled: boolean;
}

export function ReferralProgramTab() {
  const [stats] = useState<ReferralStats>(mockStats);
  const [activities] = useState<ReferralActivity[]>(mockActivities);
  const [copied, setCopied] = useState(false);
  const { formatPrice } = useCurrency();

  const [config, setConfig] = useState<ReferralProgramConfig>({
    referrerReward: 100,
    refereeReward: 50,
    expirationDays: 30,
    minimumBookingValue: 100,
    enabled: true,
  });

  const referralLink = 'https://katia.beauty/ref/SALON123';
  const referralCode = 'SALON123';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const handleShareEmail = () => {
    const subject = 'Get AED 50 off your first booking at our salon!';
    const body = `Hi!\n\nI wanted to share an exclusive offer with you. Use my referral link to get AED 50 off your first booking:\n\n${referralLink}\n\nOr use code: ${referralCode}\n\nEnjoy!\n`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShareWhatsApp = () => {
    const text = `Get AED 50 off your first booking! Use my referral link: ${referralLink} or code: ${referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareInstagram = () => {
    toast.info('Copy the link and share on Instagram!', {
      description: referralLink,
    });
  };

  const saveConfig = () => {
    toast.success('Referral program updated!', {
      description: 'New settings are now active',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Gift className="w-7 h-7 text-purple-600" />
            Referral Program
          </h2>
          <p className="text-gray-600 mt-1">Turn your clients into brand ambassadors</p>
        </div>
        <Badge variant={config.enabled ? 'default' : 'secondary'} className="px-4 py-2 text-sm">
          {config.enabled ? '✅ Active' : '⏸️ Paused'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{stats.totalReferrals}</div>
          <div className="text-sm text-purple-700">Total Referrals</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{stats.successfulConversions}</div>
          <div className="text-sm text-green-700">Successful Conversions</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{stats.conversionRate.toFixed(1)}%</div>
          <div className="text-sm text-blue-700">Conversion Rate</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Gift className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-900">{formatPrice(stats.totalRewardsEarned)}</div>
          <div className="text-sm text-orange-700">Rewards Earned</div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">How It Works</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-lg font-bold text-purple-600 mb-3">
              1
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Share Your Link</h4>
            <p className="text-sm text-gray-600">
              Send your unique referral link or code to friends via email, WhatsApp, or social media
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-lg font-bold text-purple-600 mb-3">
              2
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Friend Books</h4>
            <p className="text-sm text-gray-600">
              Your friend gets {formatPrice(config.refereeReward)} off their first booking of {formatPrice(config.minimumBookingValue)}+
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-lg font-bold text-purple-600 mb-3">
              3
            </div>
            <h4 className="font-bold text-gray-900 mb-1">You Both Win</h4>
            <p className="text-sm text-gray-600">
              You receive {formatPrice(config.referrerReward)} credit after their visit is completed!
            </p>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Referral Link</h3>
        
        {/* Link Copy */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Unique Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-mono text-sm"
            />
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="px-6"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Code Copy */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Or Share Your Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-mono text-lg font-bold text-center"
            />
            <Button
              onClick={handleCopyCode}
              variant="outline"
              className="px-6"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Share via</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={handleShareEmail}
              variant="outline"
              className="h-12 border-2 hover:border-purple-500 hover:bg-purple-50"
            >
              <Mail className="w-5 h-5 mr-2 text-gray-700" />
              Email
            </Button>
            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              className="h-12 border-2 hover:border-green-500 hover:bg-green-50"
            >
              <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
              WhatsApp
            </Button>
            <Button
              onClick={handleShareInstagram}
              variant="outline"
              className="h-12 border-2 hover:border-pink-500 hover:bg-pink-50"
            >
              <Instagram className="w-5 h-5 mr-2 text-pink-600" />
              Instagram
            </Button>
            <Button
              onClick={() => toast.info('Share on Facebook')}
              variant="outline"
              className="h-12 border-2 hover:border-blue-500 hover:bg-blue-50"
            >
              <Facebook className="w-5 h-5 mr-2 text-blue-600" />
              Facebook
            </Button>
          </div>
        </div>
      </div>

      {/* Program Settings */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Program Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referrer Reward: {formatPrice(config.referrerReward)}
            </label>
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={config.referrerReward}
              onChange={(e) => setConfig({ ...config, referrerReward: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>AED 50</span>
              <span>AED 200</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referee Reward: {formatPrice(config.refereeReward)}
            </label>
            <input
              type="range"
              min="20"
              max="100"
              step="10"
              value={config.refereeReward}
              onChange={(e) => setConfig({ ...config, refereeReward: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>AED 20</span>
              <span>AED 100</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration: {config.expirationDays} days
            </label>
            <input
              type="range"
              min="7"
              max="90"
              step="7"
              value={config.expirationDays}
              onChange={(e) => setConfig({ ...config, expirationDays: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>7 days</span>
              <span>90 days</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min. Booking: {formatPrice(config.minimumBookingValue)}
            </label>
            <input
              type="range"
              min="50"
              max="300"
              step="50"
              value={config.minimumBookingValue}
              onChange={(e) => setConfig({ ...config, minimumBookingValue: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>AED 50</span>
              <span>AED 300</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Enable Referral Program</span>
          </label>
          <Button
            onClick={saveConfig}
            className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Top Referrers This Month
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Sarah Johnson', referrals: 12, earned: 1200, rank: 1 },
            { name: 'Maria Garcia', referrals: 9, earned: 900, rank: 2 },
            { name: 'Lisa Anderson', referrals: 7, earned: 700, rank: 3 },
          ].map(referrer => (
            <div key={referrer.rank} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  referrer.rank === 1 ? 'bg-yellow-500' :
                  referrer.rank === 2 ? 'bg-gray-400' :
                  'bg-orange-500'
                }`}>
                  {referrer.rank}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{referrer.name}</div>
                  <div className="text-xs text-gray-600">{referrer.referrals} successful referrals</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">{formatPrice(referrer.earned)}</div>
                <div className="text-xs text-gray-500">earned</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Referral Activity</h3>
        <div className="space-y-3">
          {activities.map(activity => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{activity.referrerName}</span>
                  <Share2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{activity.refereeName}</span>
                  <Badge variant={
                    activity.status === 'completed' ? 'default' :
                    activity.status === 'pending' ? 'secondary' :
                    'destructive'
                  }>
                    {activity.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Referred on {new Date(activity.dateReferred).toLocaleDateString()}
                  {activity.dateCompleted && ` • Completed ${new Date(activity.dateCompleted).toLocaleDateString()}`}
                  {activity.firstBookingValue && ` • Booking: ${formatPrice(activity.firstBookingValue)}`}
                </div>
              </div>
              <div className="text-right">
                {activity.status === 'completed' ? (
                  <>
                    <div className="font-bold text-green-600">+{formatPrice(activity.referrerReward)}</div>
                    <div className="text-xs text-gray-500">rewarded</div>
                  </>
                ) : (
                  <>
                    <div className="font-medium text-gray-500">{formatPrice(activity.referrerReward)}</div>
                    <div className="text-xs text-gray-500">pending</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
