import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Heart, 
  TrendingUp, 
  Users, 
  Star,
  Calendar,
  Eye,
  Share2,
  Download,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface FavoritesAnalyticsProps {
  salonId?: string;
  salonName?: string;
}

export function FavoritesAnalytics({ salonId, salonName }: FavoritesAnalyticsProps) {
  // Mock data - replace with real API data
  const stats = {
    totalFavorites: 342,
    favoritesGrowth: 23,
    averageRating: 4.8,
    shares: 156,
    weeklyTrend: 'up' as 'up' | 'down',
  };

  const chartData = [
    { date: 'Mon', favorites: 45, shares: 12 },
    { date: 'Tue', favorites: 52, shares: 18 },
    { date: 'Wed', favorites: 48, shares: 15 },
    { date: 'Thu', favorites: 61, shares: 21 },
    { date: 'Fri', favorites: 58, shares: 24 },
    { date: 'Sat', favorites: 73, shares: 31 },
    { date: 'Sun', favorites: 67, shares: 27 },
  ];

  const topServices = [
    { id: 1, name: 'Balayage Hair Color', favorites: 89, bookings: 234 },
    { id: 2, name: 'Classic Manicure', favorites: 76, bookings: 312 },
    { id: 3, name: 'Deep Tissue Massage', favorites: 64, bookings: 189 },
    { id: 4, name: 'Keratin Treatment', favorites: 58, bookings: 156 },
    { id: 5, name: 'Brazilian Wax', favorites: 45, bookings: 198 },
  ];

  const clientDemographics = [
    { segment: 'New Clients', count: 124, percentage: 36 },
    { segment: 'Regular Clients', count: 156, percentage: 46 },
    { segment: 'VIP Clients', count: 62, percentage: 18 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-600" />
            Favorites Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            Track how clients save and share your salon
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-pink-200 bg-pink-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-600 font-medium mb-1">Total Favorites</p>
                <p className="text-3xl font-bold text-pink-900">{stats.totalFavorites}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <ArrowUp className="w-3 h-3" />
                  <span>+{stats.favoritesGrowth}% this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">Shares</p>
                <p className="text-3xl font-bold text-purple-900">{stats.shares}</p>
                <p className="text-xs text-gray-600 mt-2">Shared with friends</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.averageRating}</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(stats.averageRating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-green-900">68%</p>
                <p className="text-xs text-gray-600 mt-2">Favorites → Bookings</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Favorites & Shares Trend</CardTitle>
            <CardDescription>Last 7 days activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="favorites"
                  stroke="#ec4899"
                  strokeWidth={2}
                  name="Favorites"
                />
                <Line
                  type="monotone"
                  dataKey="shares"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Shares"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle>Most Favorited Services</CardTitle>
            <CardDescription>Services clients love the most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topServices.map((service, index) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-600">
                        {service.bookings} bookings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-pink-100 px-3 py-1 rounded-full">
                    <Heart className="w-3 h-3 text-pink-600 fill-pink-600" />
                    <span className="font-bold text-pink-700">{service.favorites}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Client Demographics Who Favorited</CardTitle>
          <CardDescription>
            Understanding who saves your salon helps tailor your services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {clientDemographics.map((segment) => (
              <div
                key={segment.segment}
                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900">{segment.segment}</h4>
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    {segment.percentage}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Count</span>
                    <span className="font-bold text-lg text-purple-600">
                      {segment.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ArrowUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  🎉 Great Growth! Favorites increased by 23% this week
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Your recent promotions are resonating well with clients
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  💡 Balayage is your star service
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Consider featuring it in your next email campaign
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  👥 68% conversion rate from favorites to bookings
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Clients who favorite your salon are highly likely to book
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
