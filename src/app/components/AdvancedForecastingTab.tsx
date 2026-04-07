import { useState } from 'react';
import { TrendingUp, Calendar, Users, DollarSign, AlertTriangle, CheckCircle, Brain, Zap, Target, BarChart3, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useCurrency } from '../../contexts/CurrencyContext';

interface ForecastData {
  period: string;
  predictedRevenue: number;
  predictedBookings: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

interface StaffRecommendation {
  message: string;
  urgency: 'high' | 'medium' | 'low';
  estimatedImpact: number;
  timeframe: string;
}

interface SeasonalInsight {
  month: string;
  expectedLoad: number;
  recommendation: string;
  potentialRevenue: number;
}

const mockForecast: ForecastData[] = [
  { period: 'Next Week', predictedRevenue: 12500, predictedBookings: 85, confidence: 92, trend: 'up' },
  { period: 'Next Month', predictedRevenue: 52000, predictedBookings: 340, confidence: 88, trend: 'up' },
  { period: 'Next Quarter', predictedRevenue: 165000, predictedBookings: 1020, confidence: 78, trend: 'stable' },
  { period: 'Next 6 Months', predictedRevenue: 340000, predictedBookings: 2100, confidence: 65, trend: 'up' },
];

const mockStaffRecommendations: StaffRecommendation[] = [
  {
    message: 'Hire 1 additional manicurist for weekends',
    urgency: 'high',
    estimatedImpact: 8500,
    timeframe: 'Within 2 weeks',
  },
  {
    message: 'Current staff can handle next month load',
    urgency: 'low',
    estimatedImpact: 0,
    timeframe: 'Current',
  },
  {
    message: 'Consider part-time hairstylist for Fridays',
    urgency: 'medium',
    estimatedImpact: 4200,
    timeframe: 'Before December',
  },
];

const mockSeasonalInsights: SeasonalInsight[] = [
  {
    month: 'January',
    expectedLoad: 65,
    recommendation: 'Post-holiday slow period. Run 20% off campaign to boost bookings.',
    potentialRevenue: 38000,
  },
  {
    month: 'February',
    expectedLoad: 85,
    recommendation: 'Valentine\'s Day spike expected. Prepare special couples packages.',
    potentialRevenue: 56000,
  },
  {
    month: 'March',
    expectedLoad: 92,
    recommendation: 'Spring season peak. Consider extending hours on weekends.',
    potentialRevenue: 62000,
  },
  {
    month: 'April',
    expectedLoad: 78,
    recommendation: 'Moderate activity. Good time for staff training and maintenance.',
    potentialRevenue: 48000,
  },
  {
    month: 'May',
    expectedLoad: 95,
    recommendation: 'Wedding season begins! Promote bridal packages heavily.',
    potentialRevenue: 72000,
  },
  {
    month: 'June',
    expectedLoad: 98,
    recommendation: 'Peak wedding season. All hands on deck. Consider temporary staff.',
    potentialRevenue: 85000,
  },
];

export function AdvancedForecastingTab() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Next Month');
  const { formatPrice } = useCurrency();

  const selectedForecast = mockForecast.find(f => f.period === selectedPeriod) || mockForecast[1];
  
  // Calculate metrics
  const totalPotentialRevenue = mockSeasonalInsights.reduce((sum, m) => sum + m.potentialRevenue, 0);
  const averageLoad = mockSeasonalInsights.reduce((sum, m) => sum + m.expectedLoad, 0) / mockSeasonalInsights.length;
  const staffImpact = mockStaffRecommendations.reduce((sum, r) => sum + r.estimatedImpact, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-7 h-7 text-purple-600" />
          Advanced Forecasting
        </h2>
        <p className="text-gray-600 mt-1">AI-powered business predictions and recommendations</p>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">AI Business Insights</h3>
            <div className="space-y-2 text-sm text-white/90">
              <p>
                🎯 <strong>Revenue forecast for next 6 months:</strong> {formatPrice(mockForecast[3].predictedRevenue)} 
                ({mockForecast[3].confidence}% confidence)
              </p>
              <p>
                📈 <strong>Growth trend:</strong> Your salon is projected to grow 23% year-over-year based on current trajectory
              </p>
              <p>
                💡 <strong>Top opportunity:</strong> Weekend slots are booking out 3 weeks in advance. Consider hiring an additional staff member.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Forecast Period</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mockForecast.map(forecast => (
            <button
              key={forecast.period}
              onClick={() => setSelectedPeriod(forecast.period)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedPeriod === forecast.period
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 text-sm">{forecast.period}</span>
                {forecast.trend === 'up' ? (
                  <ArrowUp className="w-5 h-5 text-green-600" />
                ) : forecast.trend === 'down' ? (
                  <ArrowDown className="w-5 h-5 text-red-600" />
                ) : (
                  <div className="w-5 h-5" />
                )}
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                {formatPrice(forecast.predictedRevenue)}
              </div>
              <div className="text-xs text-gray-600">
                {forecast.predictedBookings} bookings
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {forecast.confidence}% confidence
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Forecast Details */}
      <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">
          Detailed Forecast: {selectedForecast.period}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <Badge className="bg-green-600">
                {selectedForecast.trend === 'up' ? '+' : selectedForecast.trend === 'down' ? '-' : ''}
                {selectedForecast.trend === 'up' ? '12%' : selectedForecast.trend === 'down' ? '5%' : '0%'}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-green-900 mb-1">
              {formatPrice(selectedForecast.predictedRevenue)}
            </div>
            <div className="text-sm text-green-700">Predicted Revenue</div>
            <div className="mt-3 text-xs text-green-600">
              Based on historical data & trends
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-600">{selectedForecast.confidence}%</Badge>
            </div>
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {selectedForecast.predictedBookings}
            </div>
            <div className="text-sm text-blue-700">Predicted Bookings</div>
            <div className="mt-3 text-xs text-blue-600">
              Avg {(selectedForecast.predictedRevenue / selectedForecast.predictedBookings).toFixed(0)} AED per booking
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 text-purple-600" />
              <Badge className="bg-purple-600">AI</Badge>
            </div>
            <div className="text-2xl font-bold text-purple-900 mb-1">
              {selectedForecast.confidence}%
            </div>
            <div className="text-sm text-purple-700">Forecast Accuracy</div>
            <div className="mt-3 text-xs text-purple-600">
              Based on 12 months of data
            </div>
          </div>
        </div>
      </div>

      {/* Staff Recommendations */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Staff Optimization Recommendations
          </h3>
          <Badge variant="secondary">Potential: {formatPrice(staffImpact)}/month</Badge>
        </div>

        <div className="space-y-3">
          {mockStaffRecommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 flex items-start gap-4 ${
                rec.urgency === 'high' 
                  ? 'border-red-200 bg-red-50' 
                  : rec.urgency === 'medium'
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              {rec.urgency === 'high' ? (
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              ) : rec.urgency === 'medium' ? (
                <Zap className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="font-bold text-gray-900 mb-1">{rec.message}</div>
                    <div className="text-sm text-gray-600">{rec.timeframe}</div>
                  </div>
                  {rec.estimatedImpact > 0 && (
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-green-600">
                        +{formatPrice(rec.estimatedImpact)}
                      </div>
                      <div className="text-xs text-gray-500">potential/mo</div>
                    </div>
                  )}
                </div>
                <Badge variant={
                  rec.urgency === 'high' ? 'destructive' :
                  rec.urgency === 'medium' ? 'default' :
                  'secondary'
                }>
                  {rec.urgency === 'high' ? 'High Priority' :
                   rec.urgency === 'medium' ? 'Medium Priority' :
                   'Low Priority'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Insights */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            6-Month Seasonal Forecast
          </h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Projected Total</div>
            <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatPrice(totalPotentialRevenue)}
            </div>
          </div>
        </div>

        {/* Load Chart Visualization */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 mb-3">Expected Load by Month</div>
          <div className="space-y-3">
            {mockSeasonalInsights.map(insight => (
              <div key={insight.month} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{insight.month}</span>
                  <span className="text-gray-600">{insight.expectedLoad}% capacity</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      insight.expectedLoad >= 90 ? 'bg-red-500' :
                      insight.expectedLoad >= 75 ? 'bg-orange-500' :
                      insight.expectedLoad >= 50 ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${insight.expectedLoad}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="space-y-3">
          {mockSeasonalInsights.map(insight => (
            <div
              key={insight.month}
              className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-gray-900 mb-1">{insight.month}</div>
                  <div className="text-sm text-gray-600">{insight.recommendation}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-lg font-bold text-green-600">
                    {formatPrice(insight.potentialRevenue)}
                  </div>
                  <Badge 
                    variant="secondary"
                    className={
                      insight.expectedLoad >= 90 ? 'bg-red-100 text-red-700' :
                      insight.expectedLoad >= 75 ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }
                  >
                    {insight.expectedLoad}% load
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-3">AI Optimization Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Peak hours optimization:</strong> Your busiest times are Fri-Sat 14:00-18:00. Consider dynamic pricing (+20%) to maximize revenue.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Fill slow periods:</strong> Mon-Tue mornings average 40% occupancy. AI Smart Filling could add {formatPrice(4500)}/month.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Service bundling:</strong> 68% of manicure clients also book pedicure within same month. Create package deals to capture more revenue.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Retention focus:</strong> 23 clients haven't visited in 60+ days. Automated retention campaign could recover {formatPrice(6200)}.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center">
          <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">+23%</div>
          <div className="text-sm text-gray-600">Projected Growth</div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{averageLoad.toFixed(0)}%</div>
          <div className="text-sm text-gray-600">Avg Capacity Forecast</div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center">
          <Brain className="w-8 h-8 text-pink-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">87%</div>
          <div className="text-sm text-gray-600">Model Accuracy</div>
        </div>
      </div>
    </div>
  );
}
