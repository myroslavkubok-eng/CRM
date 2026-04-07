import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, TrendingUp, Filter, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Review {
  id: string;
  clientName: string;
  masterName: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
  response?: string;
  responseDate?: string;
  platform: 'Google' | 'Facebook' | 'Direct';
}

interface ReviewsTabProps {
  userRole?: 'owner' | 'admin' | 'master';
}

export function ReviewsTab({ userRole = 'owner' }: ReviewsTabProps) {
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaster, setSelectedMaster] = useState<string>('all');

  // Mock data
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      clientName: 'Emma Watson',
      masterName: 'Anna Kowalska',
      rating: 5,
      comment: 'Amazing haircut! Anna really understood what I wanted. Best salon experience ever!',
      service: 'Women\'s Haircut',
      date: '2024-12-20',
      response: 'Thank you so much Emma! We\'re thrilled you loved your new look! 💜',
      responseDate: '2024-12-20',
      platform: 'Google'
    },
    {
      id: '2',
      clientName: 'Sarah Martinez',
      masterName: 'Sarah Johnson',
      rating: 5,
      comment: 'Love my nails! Sarah is a true artist. The nail art is incredible!',
      service: 'Manicure with Nail Art',
      date: '2024-12-18',
      platform: 'Direct'
    },
    {
      id: '3',
      clientName: 'Maria Lopez',
      masterName: 'Anna Kowalska',
      rating: 4,
      comment: 'Good service but a bit expensive. The quality is definitely there though.',
      service: 'Hair Coloring',
      date: '2024-12-15',
      response: 'Thank you for your feedback Maria! We use premium products to ensure the best results.',
      responseDate: '2024-12-16',
      platform: 'Facebook'
    },
    {
      id: '4',
      clientName: 'Jessica Brown',
      masterName: 'Maria Garcia',
      rating: 5,
      comment: 'Perfect facial! My skin has never looked better. Maria is so knowledgeable.',
      service: 'Anti-Aging Facial',
      date: '2024-12-12',
      platform: 'Google'
    },
    {
      id: '5',
      clientName: 'Lisa Taylor',
      masterName: 'Sarah Johnson',
      rating: 3,
      comment: 'Service was okay, but I had to wait 20 minutes past my appointment time.',
      service: 'Pedicure',
      date: '2024-12-10',
      platform: 'Direct'
    },
    {
      id: '6',
      clientName: 'Rachel Green',
      masterName: 'Anna Kowalska',
      rating: 5,
      comment: 'Absolutely love it! Anna transformed my hair. Highly recommend!',
      service: 'Balayage',
      date: '2024-12-08',
      response: 'Thank you Rachel! You look stunning! 💕',
      responseDate: '2024-12-08',
      platform: 'Google'
    }
  ]);

  const masters = ['all', ...Array.from(new Set(reviews.map(r => r.masterName)))];

  const filteredReviews = reviews.filter(review => {
    const matchesRating = selectedRating === 'all' || review.rating === selectedRating;
    const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMaster = selectedMaster === 'all' || review.masterName === selectedMaster;
    return matchesRating && matchesSearch && matchesMaster;
  });

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;
  const respondedReviews = reviews.filter(r => r.response).length;
  const responseRate = ((respondedReviews / totalReviews) * 100).toFixed(0);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getPlatformBadge = (platform: string) => {
    const colors = {
      Google: 'bg-blue-100 text-blue-700',
      Facebook: 'bg-blue-100 text-blue-600',
      Direct: 'bg-purple-100 text-purple-700'
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            Reviews & Ratings
          </h1>
          <p className="text-gray-500 mt-1">Manage client feedback and build reputation</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
                  <div className="flex">{renderStars(Math.round(Number(averageRating)))}</div>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-green-600">{responseRate}%</p>
              </div>
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">5-Star Reviews</p>
                <p className="text-2xl font-bold text-purple-600">
                  {reviews.filter(r => r.rating === 5).length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <select
          value={selectedMaster}
          onChange={(e) => setSelectedMaster(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {masters.map(master => (
            <option key={master} value={master}>
              {master === 'all' ? 'All Masters' : master}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          {(['all', 5, 4, 3, 2, 1] as const).map(rating => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRating === rating
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {rating === 'all' ? 'All' : `${rating}⭐`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map(review => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <span className="font-bold text-purple-600">
                        {review.clientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{review.clientName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>for {review.masterName}</span>
                        <span>•</span>
                        <span>{review.date}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getPlatformBadge(review.platform)}`}>
                          {review.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-sm text-gray-500">Service: {review.service}</p>

                  {review.response && (
                    <div className="mt-4 pl-4 border-l-2 border-purple-200 bg-purple-50 p-3 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-purple-900">Owner Response</p>
                        <span className="text-xs text-purple-600">{review.responseDate}</span>
                      </div>
                      <p className="text-sm text-purple-800">{review.response}</p>
                    </div>
                  )}
                </div>
              </div>

              {!review.response && userRole !== 'master' && (
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Respond
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No reviews found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
