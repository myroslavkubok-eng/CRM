import { useState, useMemo } from 'react';
import { Filter, MessageCircle, Heart, Calendar as CalendarIcon, CalendarDays } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';

export function AnalyticsTab() {
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [masterFilter, setMasterFilter] = useState('All Masters');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('2024-11-01');
  const [endDate, setEndDate] = useState('2024-11-30');
  const { formatPrice } = useCurrency();

  // Mock data per master
  const masterData: Record<string, any> = {
    'All Masters': {
      revenue: 45680,
      bookings: 160,
      avgCheck: 285,
      conversion: 18.7,
      whatsappClicks: 142,
      saves: 89,
      aiBookings: 24,
      dailyLoad: [
        { day: 'Mon', bookings: 18, revenue: 5130, progress: 36 },
        { day: 'Tue', bookings: 22, revenue: 6270, progress: 44 },
        { day: 'Wed', bookings: 25, revenue: 7125, progress: 50 },
        { day: 'Thu', bookings: 28, revenue: 7980, progress: 56 },
        { day: 'Fri', bookings: 32, revenue: 9120, progress: 64 },
        { day: 'Sat', bookings: 30, revenue: 8550, progress: 60 },
        { day: 'Sun', bookings: 5, revenue: 1425, progress: 10 }
      ],
      hourlyData: [
        { hour: '9:00', value: 12 },
        { hour: '10:00', value: 32 },
        { hour: '11:00', value: 45 },
        { hour: '12:00', value: 52 },
        { hour: '13:00', value: 65 },
        { hour: '14:00', value: 48 },
        { hour: '15:00', value: 56 },
        { hour: '16:00', value: 72 },
        { hour: '17:00', value: 68 },
        { hour: '18:00', value: 58 },
        { hour: '19:00', value: 42 },
        { hour: '20:00', value: 28 }
      ]
    },
    'Alice': {
      revenue: 18200,
      bookings: 68,
      avgCheck: 268,
      conversion: 22.1,
      whatsappClicks: 58,
      saves: 34,
      aiBookings: 12,
      dailyLoad: [
        { day: 'Mon', bookings: 8, revenue: 2144, progress: 32 },
        { day: 'Tue', bookings: 10, revenue: 2680, progress: 40 },
        { day: 'Wed', bookings: 12, revenue: 3216, progress: 48 },
        { day: 'Thu', bookings: 11, revenue: 2948, progress: 44 },
        { day: 'Fri', bookings: 13, revenue: 3484, progress: 52 },
        { day: 'Sat', bookings: 12, revenue: 3216, progress: 48 },
        { day: 'Sun', bookings: 2, revenue: 536, progress: 8 }
      ],
      hourlyData: [
        { hour: '9:00', value: 8 },
        { hour: '10:00', value: 18 },
        { hour: '11:00', value: 25 },
        { hour: '12:00', value: 32 },
        { hour: '13:00', value: 38 },
        { hour: '14:00', value: 28 },
        { hour: '15:00', value: 35 },
        { hour: '16:00', value: 42 },
        { hour: '17:00', value: 40 },
        { hour: '18:00', value: 35 },
        { hour: '19:00', value: 25 },
        { hour: '20:00', value: 15 }
      ]
    },
    'Bob': {
      revenue: 15840,
      bookings: 55,
      avgCheck: 288,
      conversion: 16.3,
      whatsappClicks: 42,
      saves: 28,
      aiBookings: 7,
      dailyLoad: [
        { day: 'Mon', bookings: 6, revenue: 1728, progress: 24 },
        { day: 'Tue', bookings: 8, revenue: 2304, progress: 32 },
        { day: 'Wed', bookings: 9, revenue: 2592, progress: 36 },
        { day: 'Thu', bookings: 10, revenue: 2880, progress: 40 },
        { day: 'Fri', bookings: 11, revenue: 3168, progress: 44 },
        { day: 'Sat', bookings: 10, revenue: 2880, progress: 40 },
        { day: 'Sun', bookings: 1, revenue: 288, progress: 4 }
      ],
      hourlyData: [
        { hour: '9:00', value: 5 },
        { hour: '10:00', value: 12 },
        { hour: '11:00', value: 18 },
        { hour: '12:00', value: 22 },
        { hour: '13:00', value: 28 },
        { hour: '14:00', value: 20 },
        { hour: '15:00', value: 24 },
        { hour: '16:00', value: 30 },
        { hour: '17:00', value: 28 },
        { hour: '18:00', value: 22 },
        { hour: '19:00', value: 16 },
        { hour: '20:00', value: 10 }
      ]
    },
    'Elena': {
      revenue: 11640,
      bookings: 37,
      avgCheck: 315,
      conversion: 18.9,
      whatsappClicks: 42,
      saves: 27,
      aiBookings: 5,
      dailyLoad: [
        { day: 'Mon', bookings: 4, revenue: 1260, progress: 16 },
        { day: 'Tue', bookings: 4, revenue: 1260, progress: 16 },
        { day: 'Wed', bookings: 4, revenue: 1260, progress: 16 },
        { day: 'Thu', bookings: 7, revenue: 2205, progress: 28 },
        { day: 'Fri', bookings: 8, revenue: 2520, progress: 32 },
        { day: 'Sat', bookings: 8, revenue: 2520, progress: 32 },
        { day: 'Sun', bookings: 2, revenue: 630, progress: 8 }
      ],
      hourlyData: [
        { hour: '9:00', value: 3 },
        { hour: '10:00', value: 8 },
        { hour: '11:00', value: 12 },
        { hour: '12:00', value: 15 },
        { hour: '13:00', value: 20 },
        { hour: '14:00', value: 14 },
        { hour: '15:00', value: 18 },
        { hour: '16:00', value: 24 },
        { hour: '17:00', value: 22 },
        { hour: '18:00', value: 18 },
        { hour: '19:00', value: 12 },
        { hour: '20:00', value: 8 }
      ]
    }
  };

  // Get current master data
  const currentData = useMemo(() => masterData[masterFilter] || masterData['All Masters'], [masterFilter]);

  const topMetrics = [
    { label: 'WhatsApp Clicks', value: currentData.whatsappClicks.toString(), icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Salon Saves', value: currentData.saves.toString(), icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
    { label: 'AI Bookings', value: currentData.aiBookings.toString(), icon: CalendarIcon, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  const metrics = [
    {
      label: 'Revenue',
      value: formatPrice(currentData.revenue),
      change: '+13.5%',
      changeType: 'positive',
      subtitle: 'vs last period',
      icon: '$',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      changeColor: 'text-green-600'
    },
    {
      label: 'Bookings',
      value: currentData.bookings.toString(),
      change: '-8.1%',
      changeType: 'negative',
      subtitle: 'vs last period',
      icon: '📅',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      changeColor: 'text-red-600'
    },
    {
      label: 'Avg Check',
      value: formatPrice(currentData.avgCheck),
      subtitle: 'Revenue ÷ Count',
      icon: '💰',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      changeColor: ''
    },
    {
      label: 'Conversion',
      value: `${currentData.conversion}%`,
      subtitle: '34/3 views → bookings',
      icon: '📊',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      changeColor: ''
    }
  ];

  const dailyLoad = currentData.dailyLoad.map((day: any) => ({
    ...day,
    revenue: formatPrice(day.revenue)
  }));

  const maxHourly = Math.max(...currentData.hourlyData.map((d: any) => d.value));

  const handleCustomDateRange = () => {
    setTimeFilter('Custom Range');
    setShowDatePicker(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500">Performance insights</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Filter by</span>
          </div>
          
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
            <option>Custom Range</option>
          </select>

          {timeFilter === 'Custom Range' && (
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 px-4 py-2 border border-purple-300 bg-purple-50 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <CalendarDays className="w-4 h-4" />
                <span>{startDate} - {endDate}</span>
              </button>
              {showDatePicker && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDatePicker(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[320px]">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900">Select Date Range</h3>
                      <p className="text-xs text-gray-500 mt-1">Choose start and end dates</p>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCustomDateRange}
                        className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Apply Range
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <select
            value={masterFilter}
            onChange={(e) => setMasterFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>All Masters</option>
            <option>Alice</option>
            <option>Bob</option>
            <option>Elena</option>
          </select>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        {topMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${metric.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
                <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${metric.iconBg} flex items-center justify-center text-xl`}>
                  {metric.icon}
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              {metric.change && (
                <div className={`text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change} {metric.subtitle}
                </div>
              )}
              {metric.subtitle && !metric.change && (
                <div className="text-xs text-gray-500">{metric.subtitle}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200">
        <button className="px-4 py-3 text-sm font-medium border-b-2 border-purple-600 text-purple-600">
          Overview
        </button>
        <button className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900">
          Services
        </button>
        <button className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900">
          Masters
        </button>
        <button className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900">
          Clients
        </button>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Load */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-purple-600 rounded" />
              <h3 className="font-bold text-gray-900">Daily Load</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Booking distribution by day of week</p>

            <div className="space-y-4">
              {dailyLoad.map((day) => (
                <div key={day.day}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700 w-12">{day.day}</span>
                    <span className="text-gray-500 flex-1 text-right">{day.bookings} bookings</span>
                    <span className="font-medium text-gray-900 w-24 text-right">{day.revenue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full h-2.5 transition-all"
                      style={{ width: `${day.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Distribution */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-pink-600 rounded" />
              <h3 className="font-bold text-gray-900">Popular Hours</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Peak traffic hours</p>

            <div className="flex items-end justify-between gap-2 h-64">
              {currentData.hourlyData.map((data) => (
                <div key={data.hour} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-pink-600 to-purple-600 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(data.value / maxHourly) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500 rotate-0 whitespace-nowrap">
                    {data.hour}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}