import { useState } from 'react';
import { Brain, Zap, TrendingUp, Users, Clock, Send, Sparkles, Target, Calendar, DollarSign, Check, X, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface EmptySlot {
  id: string;
  date: string;
  time: string;
  duration: number;
  masterName: string;
  masterId: string;
  daysUntil: number;
  isPeakTime: boolean;
  suggestedDiscount: number;
}

interface ClientSuggestion {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  daysSinceLastVisit: number;
  preferredServices: string[];
  averageSpend: number;
  visitFrequency: string;
  likelyhoodToBook: number; // 0-100
  suggestedSlot: EmptySlot;
  suggestedDiscount: number;
  estimatedRevenue: number;
}

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'completed';
  targetedClients: number;
  messagesSent: number;
  bookingsGenerated: number;
  revenueGenerated: number;
  conversionRate: number;
  createdAt: string;
  channel: 'sms' | 'email' | 'push';
}

const mockEmptySlots: EmptySlot[] = [
  {
    id: '1',
    date: '2024-12-24',
    time: '10:00',
    duration: 60,
    masterName: 'Maria Silva',
    masterId: 'm1',
    daysUntil: 1,
    isPeakTime: false,
    suggestedDiscount: 20,
  },
  {
    id: '2',
    date: '2024-12-24',
    time: '11:00',
    duration: 60,
    masterName: 'Maria Silva',
    masterId: 'm1',
    daysUntil: 1,
    isPeakTime: false,
    suggestedDiscount: 20,
  },
  {
    id: '3',
    date: '2024-12-25',
    time: '14:00',
    duration: 60,
    masterName: 'Anna Kowalski',
    masterId: 'm2',
    daysUntil: 2,
    isPeakTime: true,
    suggestedDiscount: 10,
  },
  {
    id: '4',
    date: '2024-12-26',
    time: '09:00',
    duration: 90,
    masterName: 'Sofia Rodriguez',
    masterId: 'm3',
    daysUntil: 3,
    isPeakTime: false,
    suggestedDiscount: 25,
  },
];

const mockSuggestions: ClientSuggestion[] = [
  {
    id: '1',
    name: 'Emma Thompson',
    email: 'emma@email.com',
    phone: '+971 50 123 4567',
    lastVisit: '2024-10-15',
    daysSinceLastVisit: 69,
    preferredServices: ['Manicure', 'Pedicure'],
    averageSpend: 180,
    visitFrequency: 'Every 4-6 weeks',
    likelyhoodToBook: 85,
    suggestedSlot: mockEmptySlots[0],
    suggestedDiscount: 20,
    estimatedRevenue: 144,
  },
  {
    id: '2',
    name: 'Sophia Martinez',
    email: 'sophia@email.com',
    phone: '+971 50 234 5678',
    lastVisit: '2024-11-20',
    daysSinceLastVisit: 33,
    preferredServices: ['Haircut', 'Coloring'],
    averageSpend: 350,
    visitFrequency: 'Every 6-8 weeks',
    likelyhoodToBook: 72,
    suggestedSlot: mockEmptySlots[2],
    suggestedDiscount: 10,
    estimatedRevenue: 315,
  },
  {
    id: '3',
    name: 'Olivia Chen',
    email: 'olivia@email.com',
    phone: '+971 50 345 6789',
    lastVisit: '2024-09-28',
    daysSinceLastVisit: 86,
    preferredServices: ['Massage', 'Facial'],
    averageSpend: 280,
    visitFrequency: 'Every 8 weeks',
    likelyhoodToBook: 90,
    suggestedSlot: mockEmptySlots[3],
    suggestedDiscount: 25,
    estimatedRevenue: 210,
  },
  {
    id: '4',
    name: 'Isabella Garcia',
    email: 'isabella@email.com',
    phone: '+971 50 456 7890',
    lastVisit: '2024-11-05',
    daysSinceLastVisit: 48,
    preferredServices: ['Manicure'],
    averageSpend: 120,
    visitFrequency: 'Every 3-4 weeks',
    likelyhoodToBook: 78,
    suggestedSlot: mockEmptySlots[1],
    suggestedDiscount: 20,
    estimatedRevenue: 96,
  },
];

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Monday Morning Fill - Dec 24',
    status: 'active',
    targetedClients: 45,
    messagesSent: 45,
    bookingsGenerated: 12,
    revenueGenerated: 1850,
    conversionRate: 26.7,
    createdAt: '2024-12-23',
    channel: 'sms',
  },
  {
    id: '2',
    name: 'Weekend Slots - Dec 21',
    status: 'completed',
    targetedClients: 78,
    messagesSent: 78,
    bookingsGenerated: 34,
    revenueGenerated: 5200,
    conversionRate: 43.6,
    createdAt: '2024-12-20',
    channel: 'push',
  },
  {
    id: '3',
    name: 'Last Minute Offers - Dec 22',
    status: 'completed',
    targetedClients: 23,
    messagesSent: 23,
    bookingsGenerated: 8,
    revenueGenerated: 980,
    conversionRate: 34.8,
    createdAt: '2024-12-22',
    channel: 'sms',
  },
];

export function AISmartFillingTab() {
  const [emptySlots] = useState<EmptySlot[]>(mockEmptySlots);
  const [suggestions, setSuggestions] = useState<ClientSuggestion[]>(mockSuggestions);
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const { formatPrice } = useCurrency();

  const totalEmptySlots = emptySlots.length;
  const potentialRevenue = suggestions.reduce((sum, s) => sum + s.estimatedRevenue, 0);
  const averageConversion = campaigns.length > 0 
    ? campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length 
    : 0;
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenueGenerated, 0);

  const toggleSuggestion = (id: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedSuggestions(suggestions.map(s => s.id));
  };

  const deselectAll = () => {
    setSelectedSuggestions([]);
  };

  const sendCampaign = () => {
    if (selectedSuggestions.length === 0) {
      toast.error('No clients selected', {
        description: 'Please select at least one client to send offers to',
      });
      return;
    }

    setIsCreatingCampaign(true);
    setTimeout(() => {
      toast.success(`Campaign launched!`, {
        description: `Sending personalized offers to ${selectedSuggestions.length} clients via SMS`,
      });
      setIsCreatingCampaign(false);
      setSelectedSuggestions([]);
    }, 1500);
  };

  const selectedRevenue = suggestions
    .filter(s => selectedSuggestions.includes(s.id))
    .reduce((sum, s) => sum + s.estimatedRevenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-600" />
            AI Smart Filling
          </h2>
          <p className="text-gray-600 mt-1">Automatically fill empty slots with targeted offers</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Powered
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            <Badge variant="secondary">{totalEmptySlots}</Badge>
          </div>
          <div className="text-2xl font-bold text-orange-900">{totalEmptySlots}</div>
          <div className="text-sm text-orange-700">Empty Slots Next 7 Days</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{formatPrice(potentialRevenue)}</div>
          <div className="text-sm text-green-700">Potential Revenue</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{averageConversion.toFixed(1)}%</div>
          <div className="text-sm text-blue-700">Avg Conversion Rate</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{formatPrice(totalRevenue)}</div>
          <div className="text-sm text-purple-700">Total Revenue Generated</div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-3">AI Recommendations</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <strong>High Priority:</strong> 4 empty slots tomorrow morning. We've identified 12 clients who haven't visited in 60+ days and typically book morning slots.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <strong>Smart Discount:</strong> Offer 20-25% off for Monday slots. Our data shows this fills 85% of off-peak slots.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <strong>Best Time to Send:</strong> Send SMS campaigns 24-48 hours before empty slots for maximum conversion (43% vs 26% for same-day).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Suggestions */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI-Matched Clients</h3>
            <p className="text-sm text-gray-600">Clients most likely to book empty slots</p>
          </div>
          <div className="flex gap-2">
            {selectedSuggestions.length > 0 && (
              <>
                <Button
                  onClick={deselectAll}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Deselect All
                </Button>
                <Button
                  onClick={sendCampaign}
                  disabled={isCreatingCampaign}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isCreatingCampaign ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send to {selectedSuggestions.length} ({formatPrice(selectedRevenue)} potential)
                    </>
                  )}
                </Button>
              </>
            )}
            {selectedSuggestions.length === 0 && (
              <Button
                onClick={selectAll}
                variant="outline"
                size="sm"
              >
                <Check className="w-4 h-4 mr-2" />
                Select All
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {suggestions.map(suggestion => {
            const isSelected = selectedSuggestions.includes(suggestion.id);
            return (
              <div
                key={suggestion.id}
                onClick={() => toggleSuggestion(suggestion.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                      isSelected 
                        ? 'bg-purple-600 border-purple-600' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{suggestion.name}</h4>
                        <Badge 
                          variant="secondary" 
                          className={
                            suggestion.likelyhoodToBook >= 80 ? 'bg-green-100 text-green-700' :
                            suggestion.likelyhoodToBook >= 60 ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }
                        >
                          {suggestion.likelyhoodToBook}% match
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-4">
                          <span>📧 {suggestion.email}</span>
                          <span>📱 {suggestion.phone}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>Last visit: {suggestion.daysSinceLastVisit} days ago</span>
                          <span>Avg spend: {formatPrice(suggestion.averageSpend)}</span>
                          <span>Frequency: {suggestion.visitFrequency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Preferred services:</span>
                          {suggestion.preferredServices.map(service => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-green-600">
                      {formatPrice(suggestion.estimatedRevenue)}
                    </div>
                    <div className="text-xs text-gray-500">est. revenue</div>
                  </div>
                </div>

                {/* Suggested Slot & Offer */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <div className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-900">Suggested Slot:</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {new Date(suggestion.suggestedSlot.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })} at {suggestion.suggestedSlot.time} • {suggestion.suggestedSlot.masterName}
                    </div>
                  </div>

                  <div className="flex-shrink-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 text-center min-w-[120px]">
                    <div className="text-2xl font-bold text-green-600">
                      {suggestion.suggestedDiscount}% OFF
                    </div>
                    <div className="text-xs text-green-700">AI suggested discount</div>
                  </div>
                </div>

                {/* Message Preview */}
                <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    SMS Preview
                  </div>
                  <p className="text-sm text-gray-700 italic">
                    "Hi {suggestion.name}! 👋 We haven't seen you in {suggestion.daysSinceLastVisit} days and we miss you! 
                    ✨ EXCLUSIVE: {suggestion.suggestedDiscount}% off your next {suggestion.preferredServices[0]} on {new Date(suggestion.suggestedSlot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {suggestion.suggestedSlot.time}. 
                    Book now: katia.beauty/book 💅"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campaign History */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Campaigns</h3>
        <div className="space-y-3">
          {campaigns.map(campaign => (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900">{campaign.name}</h4>
                  <Badge variant={
                    campaign.status === 'active' ? 'default' :
                    campaign.status === 'completed' ? 'secondary' :
                    'outline'
                  }>
                    {campaign.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {campaign.channel === 'sms' ? '📱 SMS' : 
                     campaign.channel === 'email' ? '📧 Email' : 
                     '🔔 Push'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Created {new Date(campaign.createdAt).toLocaleDateString()} • 
                  {campaign.messagesSent} sent • 
                  {campaign.bookingsGenerated} bookings • 
                  {campaign.conversionRate.toFixed(1)}% conversion
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-xl font-bold text-green-600">
                  {formatPrice(campaign.revenueGenerated)}
                </div>
                <div className="text-xs text-gray-500">revenue</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-2">Pro Tips for Maximum Conversion</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Send campaigns 24-48 hours before empty slots (not same-day)</li>
              <li>• Target clients who haven't visited in 45-90 days - they're most responsive</li>
              <li>• Offer 20-25% discount for off-peak times, 10-15% for peak times</li>
              <li>• Personalize messages with client name and preferred services</li>
              <li>• SMS has 98% open rate vs 20% for email - use for urgent filling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
