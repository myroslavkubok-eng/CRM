import { useState } from 'react';
import { TrendingUp, Clock, Users, Zap, Calendar, Settings, Sparkles, AlertCircle, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface PricingRule {
  id: string;
  name: string;
  type: 'time-based' | 'master-based' | 'demand-based' | 'last-minute';
  enabled: boolean;
  modifier: number; // percentage modifier (+20% = 1.2, -15% = 0.85)
  conditions: {
    daysOfWeek?: number[]; // 0-6 (Sun-Sat)
    timeSlots?: { start: string; end: string }[];
    masterTier?: 'junior' | 'senior' | 'premium';
    hoursBeforeAppointment?: number;
  };
  description: string;
  icon: string;
  color: string;
  appliedCount: number;
  revenueImpact: number;
}

const mockRules: PricingRule[] = [
  {
    id: '1',
    name: 'Weekend Premium',
    type: 'time-based',
    enabled: true,
    modifier: 1.2, // +20%
    conditions: {
      daysOfWeek: [5, 6], // Friday, Saturday
    },
    description: 'Increase prices by 20% on weekends (Fri-Sat)',
    icon: '📅',
    color: 'purple',
    appliedCount: 348,
    revenueImpact: 12450,
  },
  {
    id: '2',
    name: 'Off-Peak Discount',
    type: 'time-based',
    enabled: true,
    modifier: 0.85, // -15%
    conditions: {
      daysOfWeek: [1, 2], // Monday, Tuesday
      timeSlots: [{ start: '10:00', end: '14:00' }],
    },
    description: 'Reduce prices by 15% on Monday-Tuesday mornings to fill slots',
    icon: '⏰',
    color: 'blue',
    appliedCount: 156,
    revenueImpact: -2340,
  },
  {
    id: '3',
    name: 'Premium Master Surcharge',
    type: 'master-based',
    enabled: true,
    modifier: 1.3, // +30%
    conditions: {
      masterTier: 'premium',
    },
    description: 'Top-tier masters charge 30% more',
    icon: '⭐',
    color: 'yellow',
    appliedCount: 234,
    revenueImpact: 18900,
  },
  {
    id: '4',
    name: 'Last Minute Deal',
    type: 'last-minute',
    enabled: true,
    modifier: 0.7, // -30%
    conditions: {
      hoursBeforeAppointment: 2,
    },
    description: 'Fill empty slots with 30% discount for bookings within 2 hours',
    icon: '⚡',
    color: 'orange',
    appliedCount: 89,
    revenueImpact: -1780,
  },
  {
    id: '5',
    name: 'Senior Master Premium',
    type: 'master-based',
    enabled: true,
    modifier: 1.15, // +15%
    conditions: {
      masterTier: 'senior',
    },
    description: 'Senior masters charge 15% more than juniors',
    icon: '👨‍🎓',
    color: 'green',
    appliedCount: 445,
    revenueImpact: 8900,
  },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function DynamicPricingTab() {
  const [rules, setRules] = useState<PricingRule[]>(mockRules);
  const [isCreating, setIsCreating] = useState(false);
  const { formatPrice } = useCurrency();

  const [newRule, setNewRule] = useState({
    name: '',
    type: 'time-based' as PricingRule['type'],
    modifier: 1.1,
    daysOfWeek: [] as number[],
    timeSlots: [{ start: '10:00', end: '14:00' }],
    masterTier: 'senior' as 'junior' | 'senior' | 'premium',
    hoursBeforeAppointment: 2,
  });

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    toast.success('Pricing rule updated');
  };

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    toast.success('Pricing rule deleted');
  };

  const totalRevenueImpact = rules
    .filter(r => r.enabled)
    .reduce((sum, r) => sum + r.revenueImpact, 0);
  
  const totalApplications = rules
    .filter(r => r.enabled)
    .reduce((sum, r) => sum + r.appliedCount, 0);

  const activeRulesCount = rules.filter(r => r.enabled).length;

  const handleCreateRule = () => {
    if (!newRule.name) {
      toast.error('Please enter a rule name');
      return;
    }

    const rule: PricingRule = {
      id: Date.now().toString(),
      name: newRule.name,
      type: newRule.type,
      enabled: true,
      modifier: newRule.modifier,
      conditions: {
        ...(newRule.type === 'time-based' && {
          daysOfWeek: newRule.daysOfWeek,
          timeSlots: newRule.timeSlots,
        }),
        ...(newRule.type === 'master-based' && {
          masterTier: newRule.masterTier,
        }),
        ...(newRule.type === 'last-minute' && {
          hoursBeforeAppointment: newRule.hoursBeforeAppointment,
        }),
      },
      description: `Custom ${newRule.type} pricing rule`,
      icon: '🎯',
      color: 'indigo',
      appliedCount: 0,
      revenueImpact: 0,
    };

    setRules([rule, ...rules]);
    setIsCreating(false);
    toast.success('Pricing rule created!');
  };

  const toggleDayOfWeek = (day: number) => {
    setNewRule({
      ...newRule,
      daysOfWeek: newRule.daysOfWeek.includes(day)
        ? newRule.daysOfWeek.filter(d => d !== day)
        : [...newRule.daysOfWeek, day],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-purple-600" />
            Dynamic Pricing
          </h2>
          <p className="text-gray-600 mt-1">Optimize revenue with smart, automated pricing</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <Badge variant="secondary">{activeRulesCount}</Badge>
          </div>
          <div className="text-2xl font-bold text-purple-900">{activeRulesCount}</div>
          <div className="text-sm text-purple-700">Active Rules</div>
        </div>

        <div className={`bg-gradient-to-br rounded-xl p-4 border ${
          totalRevenueImpact >= 0 
            ? 'from-green-50 to-green-100 border-green-200' 
            : 'from-red-50 to-red-100 border-red-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className={`w-8 h-8 ${totalRevenueImpact >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div className={`text-2xl font-bold ${totalRevenueImpact >= 0 ? 'text-green-900' : 'text-red-900'}`}>
            {totalRevenueImpact >= 0 ? '+' : ''}{formatPrice(totalRevenueImpact)}
          </div>
          <div className={`text-sm ${totalRevenueImpact >= 0 ? 'text-green-700' : 'text-red-700'}`}>Revenue Impact</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalApplications}</div>
          <div className="text-sm text-blue-700">Times Applied</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {totalApplications > 0 ? ((totalRevenueImpact / totalApplications) * 100).toFixed(1) : '0'}%
          </div>
          <div className="text-sm text-orange-700">Avg Modifier</div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2">AI Pricing Insights</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Monday 10-14h slots are only 40% filled.</strong> Consider increasing discount to 20% to attract more bookings.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Weekend premium pricing working well!</strong> Saturday 14-18h slots book out 2 weeks in advance. You could increase premium to 25%.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Last-minute deals are highly effective.</strong> 89 bookings filled that would have been empty. Consider extending to 4-hour window.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Rule Form */}
      {isCreating && (
        <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Create Pricing Rule</h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Rule Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., Happy Hour Discount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Rule Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rule Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'time-based', label: 'Time-Based', icon: '⏰' },
                  { value: 'master-based', label: 'Master-Based', icon: '👨‍💼' },
                  { value: 'last-minute', label: 'Last Minute', icon: '⚡' },
                  { value: 'demand-based', label: 'Demand-Based', icon: '📈' },
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => setNewRule({ ...newRule, type: type.value as any })}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      newRule.type === type.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium text-gray-900">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Modifier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Modifier: {((newRule.modifier - 1) * 100).toFixed(0) >= 0 ? '+' : ''}{((newRule.modifier - 1) * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={newRule.modifier}
                onChange={(e) => setNewRule({ ...newRule, modifier: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>-50%</span>
                <span>0%</span>
                <span>+50%</span>
              </div>
            </div>

            {/* Time-Based Conditions */}
            {newRule.type === 'time-based' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
                  <div className="flex gap-2">
                    {daysOfWeek.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => toggleDayOfWeek(index)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                          newRule.daysOfWeek.includes(index)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-600 hover:border-purple-300'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Slots</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="time"
                      value={newRule.timeSlots[0].start}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        timeSlots: [{ ...newRule.timeSlots[0], start: e.target.value }]
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={newRule.timeSlots[0].end}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        timeSlots: [{ ...newRule.timeSlots[0], end: e.target.value }]
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Master-Based Conditions */}
            {newRule.type === 'master-based' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Master Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'junior', label: 'Junior', icon: '👤' },
                    { value: 'senior', label: 'Senior', icon: '👨‍🎓' },
                    { value: 'premium', label: 'Premium', icon: '⭐' },
                  ].map(tier => (
                    <button
                      key={tier.value}
                      onClick={() => setNewRule({ ...newRule, masterTier: tier.value as any })}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        newRule.masterTier === tier.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{tier.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{tier.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Last Minute Conditions */}
            {newRule.type === 'last-minute' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours Before Appointment: {newRule.hoursBeforeAppointment}h
                </label>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={newRule.hoursBeforeAppointment}
                  onChange={(e) => setNewRule({ ...newRule, hoursBeforeAppointment: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1h</span>
                  <span>12h</span>
                  <span>24h</span>
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="text-sm font-semibold text-gray-700 mb-2">Price Example:</div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Base Price: AED 100</span>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  → AED {(100 * newRule.modifier).toFixed(0)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateRule}
                disabled={!newRule.name}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Create Rule
              </Button>
              <Button
                onClick={() => setIsCreating(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map(rule => (
          <div
            key={rule.id}
            className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
              rule.enabled ? 'border-purple-200' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-3xl">{rule.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-900">{rule.name}</h3>
                      <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                        {rule.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className={
                        rule.modifier > 1 ? 'border-green-500 text-green-700' : 'border-blue-500 text-blue-700'
                      }>
                        {rule.modifier > 1 ? '+' : ''}{((rule.modifier - 1) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleRule(rule.id)}
                    variant="outline"
                    size="sm"
                  >
                    {rule.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    onClick={() => deleteRule(rule.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Type</div>
                  <div className="font-medium text-gray-900 capitalize">{rule.type.replace('-', ' ')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Applied</div>
                  <div className="font-medium text-gray-900">{rule.appliedCount} times</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Revenue Impact</div>
                  <div className={`font-bold ${rule.revenueImpact >= 0 ? 'text-green-600' : 'text-blue-600'}`}>
                    {rule.revenueImpact >= 0 ? '+' : ''}{formatPrice(rule.revenueImpact)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
