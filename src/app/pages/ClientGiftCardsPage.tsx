import { useState } from 'react';
import { Gift, Send, Inbox, Clock, CheckCircle, XCircle, Share2, Download, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

// Mock data types (replace with real API types)
interface GiftCard {
  id: string;
  code: string;
  salonId: string;
  salonName: string;
  amount: number;
  remainingBalance: number;
  currency: string;
  status: 'active' | 'partially_used' | 'fully_used' | 'expired' | 'cancelled';
  purchaseDate: string;
  expiryDate: string | null;
  
  // Purchaser info
  purchasedBy: {
    name: string;
    email: string;
  };
  
  // Recipient info
  recipientName?: string;
  recipientEmail?: string;
  personalMessage?: string;
  
  // Usage history
  usageHistory: Array<{
    date: string;
    bookingId: string;
    amountUsed: number;
    remainingAfter: number;
    serviceName: string;
  }>;
}

// Mock data
const mockPurchasedGiftCards: GiftCard[] = [
  {
    id: 'gc1',
    code: 'KATIA-A7X9-2K4M-3P5Q',
    salonId: 'salon1',
    salonName: 'Glamour Studio',
    amount: 200,
    remainingBalance: 80,
    currency: 'AED',
    status: 'partially_used',
    purchaseDate: '2024-03-01',
    expiryDate: null,
    purchasedBy: {
      name: 'John Doe',
      email: 'john@email.com',
    },
    recipientName: 'Jane Smith',
    recipientEmail: 'jane@email.com',
    personalMessage: 'Happy Birthday! Enjoy your spa day! 🎂',
    usageHistory: [
      {
        date: '2024-03-05',
        bookingId: 'booking1',
        amountUsed: 60,
        remainingAfter: 140,
        serviceName: 'Haircut & Styling',
      },
      {
        date: '2024-03-10',
        bookingId: 'booking2',
        amountUsed: 60,
        remainingAfter: 80,
        serviceName: 'Manicure',
      },
    ],
  },
  {
    id: 'gc2',
    code: 'KATIA-B2C4-7F9P-5M8K',
    salonId: 'salon2',
    salonName: 'Beauty Haven',
    amount: 300,
    remainingBalance: 300,
    currency: 'AED',
    status: 'active',
    purchaseDate: '2024-03-15',
    expiryDate: null,
    purchasedBy: {
      name: 'John Doe',
      email: 'john@email.com',
    },
    recipientName: 'Mom',
    recipientEmail: 'mom@email.com',
    personalMessage: "Happy Mother's Day! You deserve the best! 💐",
    usageHistory: [],
  },
];

const mockReceivedGiftCards: GiftCard[] = [
  {
    id: 'gc3',
    code: 'KATIA-C3D5-8G2J-9N4L',
    salonId: 'salon3',
    salonName: 'Luxury Spa',
    amount: 500,
    remainingBalance: 350,
    currency: 'AED',
    status: 'partially_used',
    purchaseDate: '2024-02-28',
    expiryDate: null,
    purchasedBy: {
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
    },
    recipientName: 'John Doe',
    recipientEmail: 'john@email.com',
    personalMessage: 'For your birthday! Treat yourself! 🎉',
    usageHistory: [
      {
        date: '2024-03-08',
        bookingId: 'booking3',
        amountUsed: 150,
        remainingAfter: 350,
        serviceName: 'Full Body Massage',
      },
    ],
  },
  {
    id: 'gc4',
    code: 'KATIA-E4F6-1H8K-2P9M',
    salonId: 'salon1',
    salonName: 'Glamour Studio',
    amount: 150,
    remainingBalance: 0,
    currency: 'AED',
    status: 'fully_used',
    purchaseDate: '2024-02-14',
    expiryDate: null,
    purchasedBy: {
      name: 'Mike Brown',
      email: 'mike@email.com',
    },
    recipientName: 'John Doe',
    recipientEmail: 'john@email.com',
    personalMessage: "Valentine's gift for my buddy! ❤️",
    usageHistory: [
      {
        date: '2024-02-20',
        bookingId: 'booking4',
        amountUsed: 80,
        remainingAfter: 70,
        serviceName: 'Haircut',
      },
      {
        date: '2024-02-25',
        bookingId: 'booking5',
        amountUsed: 70,
        remainingAfter: 0,
        serviceName: 'Beard Grooming',
      },
    ],
  },
];

export function ClientGiftCardsPage() {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'purchased' | 'received'>('purchased');
  const [purchasedCards] = useState<GiftCard[]>(mockPurchasedGiftCards);
  const [receivedCards] = useState<GiftCard[]>(mockReceivedGiftCards);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const currentCards = activeTab === 'purchased' ? purchasedCards : receivedCards;

  const getStatusBadge = (status: GiftCard['status']) => {
    const badges = {
      active: { icon: '🟢', text: 'Active', color: 'bg-green-100 text-green-700' },
      partially_used: { icon: '🟡', text: 'Partially Used', color: 'bg-yellow-100 text-yellow-700' },
      fully_used: { icon: '✅', text: 'Fully Used', color: 'bg-gray-100 text-gray-700' },
      expired: { icon: '⏰', text: 'Expired', color: 'bg-red-100 text-red-700' },
      cancelled: { icon: '❌', text: 'Cancelled', color: 'bg-red-100 text-red-700' },
    };
    
    const badge = badges[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Gift card code copied!');
  };

  const handleResendEmail = (card: GiftCard) => {
    // TODO: Implement resend email API call
    toast.success(`Email resent to ${card.recipientEmail || card.purchasedBy.email}`);
  };

  const handleDownload = (card: GiftCard) => {
    // TODO: Implement download PDF/image
    toast.success('Downloading gift card...');
  };

  const toggleExpanded = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gift Cards</h1>
        <p className="text-gray-600">
          Manage gift cards you've purchased and received
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('purchased')}
          className={`pb-3 px-4 font-semibold transition-colors relative ${
            activeTab === 'purchased'
              ? 'text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            <span>Purchased</span>
            <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs font-semibold">
              {purchasedCards.length}
            </span>
          </div>
          {activeTab === 'purchased' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 px-4 font-semibold transition-colors relative ${
            activeTab === 'received'
              ? 'text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5" />
            <span>Received</span>
            <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs font-semibold">
              {receivedCards.length}
            </span>
          </div>
          {activeTab === 'received' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600" />
          )}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="text-sm text-gray-600 mb-1">Total Value</div>
          <div className="text-2xl font-bold text-purple-600">
            {formatPrice(
              currentCards.reduce((sum, card) => sum + card.amount, 0)
            )}
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="text-sm text-gray-600 mb-1">Available Balance</div>
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(
              currentCards.reduce((sum, card) => sum + card.remainingBalance, 0)
            )}
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Active Cards</div>
          <div className="text-2xl font-bold text-blue-600">
            {currentCards.filter(c => c.status === 'active' || c.status === 'partially_used').length}
          </div>
        </Card>
      </div>

      {/* Gift Cards List */}
      <div className="space-y-4">
        {currentCards.length === 0 ? (
          <Card className="p-12 text-center">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'purchased'
                ? 'No Gift Cards Purchased'
                : 'No Gift Cards Received'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'purchased'
                ? "You haven't purchased any gift cards yet"
                : "You haven't received any gift cards yet"}
            </p>
            {activeTab === 'purchased' && (
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Buy Gift Card
              </Button>
            )}
          </Card>
        ) : (
          currentCards.map((card) => (
            <Card key={card.id} className="overflow-hidden">
              {/* Card Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpanded(card.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">
                        {card.salonName}
                      </h3>
                      {getStatusBadge(card.status)}
                    </div>
                    
                    {/* Code */}
                    <div className="flex items-center gap-3 mb-3">
                      <code className="px-3 py-1.5 bg-gray-100 rounded font-mono text-sm font-semibold text-gray-900">
                        {card.code}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCode(card.code);
                        }}
                      >
                        Copy Code
                      </Button>
                    </div>

                    {/* From/To Info */}
                    <div className="text-sm text-gray-600 space-y-1">
                      {activeTab === 'purchased' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            <span>
                              Sent to: <strong>{card.recipientName || 'Yourself'}</strong>
                              {card.recipientEmail && ` (${card.recipientEmail})`}
                            </span>
                          </div>
                          {card.personalMessage && (
                            <div className="italic text-gray-500 ml-6">
                              "{card.personalMessage}"
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <Inbox className="w-4 h-4" />
                            <span>
                              From: <strong>{card.purchasedBy.name}</strong>
                            </span>
                          </div>
                          {card.personalMessage && (
                            <div className="italic text-gray-500 ml-6 bg-purple-50 rounded-lg p-2 mt-2">
                              "{card.personalMessage}"
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Amount Display */}
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Balance</div>
                    <div className="text-3xl font-bold text-purple-600">
                      {formatPrice(card.remainingBalance)}
                    </div>
                    <div className="text-xs text-gray-500">
                      of {formatPrice(card.amount)}
                    </div>
                    {card.remainingBalance < card.amount && (
                      <div className="text-xs text-yellow-600 mt-1">
                        {formatPrice(card.amount - card.remainingBalance)} used
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResendEmail(card);
                    }}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resend Email
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(card);
                    }}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  {card.remainingBalance > 0 && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
                    >
                      <Gift className="w-4 h-4" />
                      Use Now
                    </Button>
                  )}
                </div>

                {/* Expand Indicator */}
                <div className="text-center mt-4">
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    {expandedCard === card.id ? '▲ Hide Details' : '▼ View Details'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCard === card.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  {/* Purchase Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Purchase Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Purchase Date:</span>
                          <span className="font-medium">
                            {new Date(card.purchaseDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Original Amount:</span>
                          <span className="font-medium">{formatPrice(card.amount)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Expiry Date:</span>
                          <span className="font-medium">
                            {card.expiryDate
                              ? new Date(card.expiryDate).toLocaleDateString()
                              : '✨ Never expires'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Current Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Remaining Balance:</span>
                          <span className="font-bold text-green-600">
                            {formatPrice(card.remainingBalance)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Total Used:</span>
                          <span className="font-medium">
                            {formatPrice(card.amount - card.remainingBalance)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Times Used:</span>
                          <span className="font-medium">
                            {card.usageHistory.length} time{card.usageHistory.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Usage History */}
                  {card.usageHistory.length > 0 ? (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        Usage History
                      </h4>
                      <div className="space-y-3">
                        {card.usageHistory.map((usage, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 mb-1">
                                {usage.serviceName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(usage.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-red-600">
                                -{formatPrice(usage.amountUsed)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Balance: {formatPrice(usage.remainingAfter)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-gray-600">
                        This gift card hasn't been used yet
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
