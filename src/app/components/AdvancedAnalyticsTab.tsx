import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Target, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';

export function AdvancedAnalyticsTab() {
  const { formatPrice } = useCurrency();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Mock data with trends
  const analytics = {
    revenue: {
      current: 45600,
      previous: 38200,
      trend: 19.4,
      forecast: 52000
    },
    bookings: {
      current: 324,
      previous: 298,
      trend: 8.7,
      forecast: 356
    },
    avgTicket: {
      current: 140.74,
      previous: 128.19,
      trend: 9.8,
      forecast: 146.07
    },
    clientRetention: {
      current: 78.3,
      previous: 72.1,
      trend: 8.6,
      forecast: 82.0
    }
  };

  // Revenue forecast data
  const forecastData = [
    { month: 'Jan', actual: 38200, forecast: null },
    { month: 'Feb', actual: 41500, forecast: null },
    { month: 'Mar', actual: 43800, forecast: null },
    { month: 'Apr', actual: 45600, forecast: null },
    { month: 'May', actual: null, forecast: 48200 },
    { month: 'Jun', actual: null, forecast: 51800 },
    { month: 'Jul', actual: null, forecast: 54500 }
  ];

  // Service performance
  const servicePerformance = [
    { name: 'Women\'s Haircut', revenue: 12800, bookings: 142, avgPrice: 90, trend: 12.5, color: 'bg-purple-600' },
    { name: 'Hair Coloring', revenue: 9600, bookings: 64, avgPrice: 150, trend: 8.3, color: 'bg-pink-600' },
    { name: 'Manicure', revenue: 7200, bookings: 96, avgPrice: 75, trend: -3.2, color: 'bg-blue-600' },
    { name: 'Pedicure', revenue: 5400, bookings: 72, avgPrice: 75, trend: 5.1, color: 'bg-green-600' },
    { name: 'Facial', revenue: 4800, bookings: 40, avgPrice: 120, trend: 15.8, color: 'bg-yellow-600' }
  ];

  // Peak hours analysis
  const peakHours = [
    { time: '09:00', occupancy: 45, revenue: 2800 },
    { time: '10:00', occupancy: 68, revenue: 4200 },
    { time: '11:00', occupancy: 82, revenue: 5100 },
    { time: '12:00', occupancy: 91, revenue: 6300 },
    { time: '13:00', occupancy: 76, revenue: 4800 },
    { time: '14:00', occupancy: 84, revenue: 5400 },
    { time: '15:00', occupancy: 89, revenue: 5900 },
    { time: '16:00', occupancy: 95, revenue: 6800 },
    { time: '17:00', occupancy: 92, revenue: 6400 },
    { time: '18:00', occupancy: 88, revenue: 5700 },
    { time: '19:00', occupancy: 72, revenue: 4200 },
    { time: '20:00', occupancy: 54, revenue: 2900 }
  ];

  // Client segmentation
  const clientSegments = [
    { segment: 'VIP Clients', count: 28, revenue: 15680, avgSpend: 560, visits: 6.2, color: 'from-yellow-400 to-yellow-600' },
    { segment: 'Regular Clients', count: 89, revenue: 22400, avgSpend: 251, visits: 3.8, color: 'from-purple-400 to-purple-600' },
    { segment: 'New Clients', count: 42, revenue: 5880, avgSpend: 140, visits: 1.0, color: 'from-blue-400 to-blue-600' },
    { segment: 'At Risk', count: 15, revenue: 1640, avgSpend: 109, visits: 0.5, color: 'from-red-400 to-red-600' }
  ];

  const maxOccupancy = Math.max(...peakHours.map(h => h.occupancy));

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? (
      <div className="flex items-center gap-1 text-green-600">
        <ArrowUpRight className="w-4 h-4" />
        <span className="text-sm font-medium">+{trend.toFixed(1)}%</span>
      </div>
    ) : (
      <div className="flex items-center gap-1 text-red-600">
        <ArrowDownRight className="w-4 h-4" />
        <span className="text-sm font-medium">{trend.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            Advanced Analytics
          </h1>
          <p className="text-gray-500 mt-1">AI-powered insights, trends, and forecasts</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics with Trends */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              {getTrendIcon(analytics.revenue.trend)}
            </div>
            <div className="text-sm text-gray-600 mb-1">Revenue</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{formatPrice(analytics.revenue.current)}</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Previous: {formatPrice(analytics.revenue.previous)}</span>
              <span className="text-purple-600 font-medium">Forecast: {formatPrice(analytics.revenue.forecast)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              {getTrendIcon(analytics.bookings.trend)}
            </div>
            <div className="text-sm text-gray-600 mb-1">Bookings</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{analytics.bookings.current}</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Previous: {analytics.bookings.previous}</span>
              <span className="text-purple-600 font-medium">Forecast: {analytics.bookings.forecast}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              {getTrendIcon(analytics.avgTicket.trend)}
            </div>
            <div className="text-sm text-gray-600 mb-1">Avg Ticket</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{formatPrice(analytics.avgTicket.current)}</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Previous: {formatPrice(analytics.avgTicket.previous)}</span>
              <span className="text-purple-600 font-medium">Forecast: {formatPrice(analytics.avgTicket.forecast)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              {getTrendIcon(analytics.clientRetention.trend)}
            </div>
            <div className="text-sm text-gray-600 mb-1">Retention Rate</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{analytics.clientRetention.current}%</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Previous: {analytics.clientRetention.previous}%</span>
              <span className="text-purple-600 font-medium">Target: {analytics.clientRetention.forecast}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Forecast Chart */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Revenue Forecast (Next 3 Months)</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded"></div>
                <span className="text-gray-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-300 rounded border-2 border-purple-600"></div>
                <span className="text-gray-600">Forecast</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {forecastData.map((item, index) => {
              const value = item.actual || item.forecast || 0;
              const maxValue = 60000;
              const percentage = (value / maxValue) * 100;
              const isForecast = item.forecast !== null;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.month}</span>
                    <span className={`text-sm font-bold ${isForecast ? 'text-purple-600' : 'text-gray-900'}`}>
                      {formatPrice(value)} {isForecast && '(predicted)'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        isForecast
                          ? 'bg-gradient-to-r from-purple-300 to-purple-400 border-2 border-purple-600'
                          : 'bg-gradient-to-r from-purple-600 to-purple-700'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Peak Hours Analysis */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Peak Hours Analysis</h3>
          <div className="space-y-2">
            {peakHours.map((hour, index) => {
              const percentage = (hour.occupancy / maxOccupancy) * 100;
              const isHighDemand = hour.occupancy >= 85;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 w-16">{hour.time}</span>
                      {isHighDemand && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{formatPrice(hour.revenue)}</span>
                      <span className={`text-sm font-bold ${
                        isHighDemand ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {hour.occupancy}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isHighDemand
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>💡 Insight:</strong> Peak demand at 12:00-17:00. Consider adding staff during these hours to maximize revenue.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Service Performance */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Services Performance</h3>
          <div className="space-y-4">
            {servicePerformance.map((service, index) => {
              const totalRevenue = servicePerformance.reduce((sum, s) => sum + s.revenue, 0);
              const percentage = (service.revenue / totalRevenue) * 100;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{service.name}</span>
                        {getTrendIcon(service.trend)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatPrice(service.revenue)}</span>
                        <span>•</span>
                        <span>{service.bookings} bookings</span>
                        <span>•</span>
                        <span>Avg: {formatPrice(service.avgPrice)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${service.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Client Segmentation */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clientSegments.map((segment, index) => (
          <Card key={index} className={`border-none bg-gradient-to-br ${segment.color} text-white`}>
            <CardContent className="p-6">
              <h3 className="font-bold mb-3">{segment.segment}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Clients</span>
                  <span className="text-2xl font-bold">{segment.count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Revenue</span>
                  <span className="font-bold">{formatPrice(segment.revenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Avg Spend</span>
                  <span className="font-bold">{formatPrice(segment.avgSpend)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Avg Visits/mo</span>
                  <span className="font-bold">{segment.visits}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Recommendations */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            AI-Powered Recommendations
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Increase Hair Coloring prices by 10%</p>
                <p className="text-xs text-gray-600">High demand with 15.8% trend growth. Potential +AED 960/month revenue.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Launch loyalty program for 'At Risk' clients</p>
                <p className="text-xs text-gray-600">15 clients at risk of churning. Offer 20% discount to retain them.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Add evening slots (19:00-21:00)</p>
                <p className="text-xs text-gray-600">72% occupancy at 19:00. Adding 2 extra hours could generate +AED 8,400/month.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
