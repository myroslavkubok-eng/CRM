import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Heart, 
  TrendingUp, 
  Users, 
  Eye,
  Share2,
  Download,
  ArrowUp,
  ArrowDown,
  Zap,
  Clock,
  MessageCircle,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface FeedAnalyticsProps {
  salonId?: string;
  salonName?: string;
}

export function FeedAnalytics({ salonId, salonName }: FeedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Mock data - replace with real API data from backend
  const overallStats = {
    totalPosts: 24,
    totalViews: 15420,
    totalLikes: 1856,
    totalShares: 342,
    viewsGrowth: 34,
    likesGrowth: 28,
    sharesGrowth: 45,
    engagementRate: 14.2,
  };

  // Daily engagement data
  const engagementData = [
    { date: 'Mon', views: 2100, likes: 245, shares: 42 },
    { date: 'Tue', views: 2340, likes: 289, shares: 51 },
    { date: 'Wed', views: 1980, likes: 212, shares: 38 },
    { date: 'Thu', views: 2650, likes: 312, shares: 58 },
    { date: 'Fri', views: 2450, likes: 298, shares: 48 },
    { date: 'Sat', views: 3200, likes: 398, shares: 72 },
    { date: 'Sun', views: 2700, likes: 302, shares: 33 },
  ];

  // Top performing posts
  const topPosts = [
    { 
      id: 1, 
      title: 'Last Minute: 50% off Balayage Today!',
      type: 'last-minute',
      views: 3420, 
      likes: 425, 
      shares: 89,
      engagement: 15.0,
      date: '2 days ago'
    },
    { 
      id: 2, 
      title: 'New Nail Art Collection 💅',
      type: 'post',
      views: 2890, 
      likes: 378, 
      shares: 67,
      engagement: 15.4,
      date: '4 days ago'
    },
    { 
      id: 3, 
      title: 'Summer Hair Trends 2024',
      type: 'post',
      views: 2560, 
      likes: 312, 
      shares: 54,
      engagement: 14.3,
      date: '6 days ago'
    },
    { 
      id: 4, 
      title: 'Flash Sale: Brazilian Keratin -40%',
      type: 'last-minute',
      views: 2340, 
      likes: 289, 
      shares: 48,
      engagement: 14.4,
      date: '1 week ago'
    },
    { 
      id: 5, 
      title: 'Meet Our New Master Stylist',
      type: 'post',
      views: 1980, 
      likes: 245, 
      shares: 32,
      engagement: 14.0,
      date: '1 week ago'
    },
  ];

  // Post type distribution
  const postTypeData = [
    { name: 'Regular Posts', value: 15, color: '#8b5cf6' },
    { name: 'Last Minute Deals', value: 9, color: '#eab308' },
  ];

  // User engagement by source
  const shareSourcesData = [
    { platform: 'WhatsApp', shares: 156, percentage: 45.6 },
    { platform: 'Instagram', shares: 98, percentage: 28.7 },
    { platform: 'Telegram', shares: 54, percentage: 15.8 },
    { platform: 'Facebook', shares: 34, percentage: 9.9 },
  ];

  // Who engaged with your posts
  const userSegments = [
    { segment: 'New Users', count: 234, percentage: 42, color: '#10b981' },
    { segment: 'Regular Clients', count: 178, percentage: 32, color: '#8b5cf6' },
    { segment: 'VIP Clients', count: 98, percentage: 18, color: '#f59e0b' },
    { segment: 'Other', count: 45, percentage: 8, color: '#6b7280' },
  ];

  const calculateEngagementRate = (views: number, likes: number, shares: number) => {
    return (((likes + shares) / views) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            Feed Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            Track performance of your posts, likes, shares and views
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                timeRange === '7d'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                timeRange === '30d'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                timeRange === '90d'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              90 Days
            </button>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Total Views</p>
                <p className="text-3xl font-bold text-blue-900">{overallStats.totalViews.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <ArrowUp className="w-3 h-3" />
                  <span>+{overallStats.viewsGrowth}% this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Likes */}
        <Card className="border-2 border-pink-200 bg-pink-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-600 font-medium mb-1">Total Likes</p>
                <p className="text-3xl font-bold text-pink-900">{overallStats.totalLikes.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <ArrowUp className="w-3 h-3" />
                  <span>+{overallStats.likesGrowth}% this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Shares */}
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">Total Shares</p>
                <p className="text-3xl font-bold text-purple-900">{overallStats.totalShares}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <ArrowUp className="w-3 h-3" />
                  <span>+{overallStats.sharesGrowth}% this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Rate */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Engagement Rate</p>
                <p className="text-3xl font-bold text-green-900">{overallStats.engagementRate}%</p>
                <p className="text-xs text-gray-600 mt-2">Likes + Shares / Views</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Engagement Trend</CardTitle>
            <CardDescription>Views, Likes, and Shares over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Views"
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#ec4899"
                  strokeWidth={2}
                  name="Likes"
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

        {/* Post Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Post Type Distribution</CardTitle>
            <CardDescription>Regular posts vs Last Minute deals</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={postTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percentage }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {postTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Posts with highest engagement in the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{post.title}</p>
                      {post.type === 'last-minute' && (
                        <Badge className="bg-yellow-500 text-white border-0 text-xs">
                          Last Minute
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{post.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-blue-600">
                      <Eye className="w-4 h-4" />
                      <span className="font-bold text-sm">{post.views.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-gray-500">Views</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-pink-600">
                      <Heart className="w-4 h-4" />
                      <span className="font-bold text-sm">{post.likes}</span>
                    </div>
                    <span className="text-xs text-gray-500">Likes</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-purple-600">
                      <Share2 className="w-4 h-4" />
                      <span className="font-bold text-sm">{post.shares}</span>
                    </div>
                    <span className="text-xs text-gray-500">Shares</span>
                  </div>
                  <div className="text-center bg-green-100 px-3 py-1 rounded-full">
                    <span className="font-bold text-green-700 text-sm">{post.engagement}%</span>
                    <div className="text-xs text-green-600">Engagement</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Share Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Where Users Share Your Posts</CardTitle>
            <CardDescription>Social platforms distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shareSourcesData.map((source) => (
                <div key={source.platform}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{source.platform}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{source.shares} shares</span>
                      <Badge className="bg-purple-100 text-purple-700 border-0">
                        {source.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Who Engaged With Your Posts</CardTitle>
            <CardDescription>User segments breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userSegments.map((segment) => (
                <div
                  key={segment.segment}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{segment.segment}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{segment.count} users</span>
                    <Badge className="bg-gray-200 text-gray-700 border-0">
                      {segment.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            AI-Powered Insights & Recommendations
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
                  🎉 Your Last Minute deals are crushing it!
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  45% increase in shares for Last Minute posts. Consider posting more time-sensitive offers.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  ⏰ Best time to post: Saturday 10-11 AM
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Your posts get 3x more engagement on weekend mornings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  💡 42% of engagers are new users
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Your feed is attracting new clients! Follow up with welcome offers to convert them.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
