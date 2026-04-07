import { useState } from 'react';
import { 
  Gift, 
  Plus, 
  Search, 
  Mail, 
  DollarSign, 
  Calendar, 
  User, 
  Check, 
  X,
  TrendingUp,
  Users,
  CreditCard,
  Copy,
  Eye,
  Edit2,
  Trash2,
  Send,
  Share2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface GiftCard {
  id: string;
  code: string;
  initialAmount: number;
  currentBalance: number;
  purchasedBy: string;
  purchaserEmail: string;
  recipientName?: string;
  recipientEmail?: string;
  message?: string;
  purchaseDate: string;
  expiryDate?: string;
  status: 'active' | 'redeemed' | 'expired' | 'cancelled';
  usageHistory: {
    date: string;
    amount: number;
    booking: string;
  }[];
}

interface GiftCardsTabProps {
  userRole?: 'owner' | 'admin' | 'master';
}

export function GiftCardsTab({ userRole = 'owner' }: GiftCardsTabProps) {
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'redeemed' | 'expired' | 'cancelled'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock data - replace with real data from backend
  const [giftCards] = useState<GiftCard[]>([
    {
      id: '1',
      code: 'GIFT-2024-ABC123',
      initialAmount: 500,
      currentBalance: 500,
      purchasedBy: 'Emma Watson',
      purchaserEmail: 'emma@email.com',
      recipientName: 'Sarah Johnson',
      recipientEmail: 'sarah@email.com',
      message: 'Happy Birthday! Enjoy your spa day! 🎉',
      purchaseDate: '2024-12-20',
      expiryDate: '2025-12-20',
      status: 'active',
      usageHistory: []
    },
    {
      id: '2',
      code: 'GIFT-2024-XYZ789',
      initialAmount: 300,
      currentBalance: 150,
      purchasedBy: 'Michael Brown',
      purchaserEmail: 'michael@email.com',
      recipientName: 'Lisa Davis',
      recipientEmail: 'lisa@email.com',
      message: 'Merry Christmas! 🎄',
      purchaseDate: '2024-12-15',
      expiryDate: '2025-12-15',
      status: 'active',
      usageHistory: [
        {
          date: '2024-12-18',
          amount: 150,
          booking: 'Manicure + Pedicure'
        }
      ]
    },
    {
      id: '3',
      code: 'GIFT-2024-DEF456',
      initialAmount: 200,
      currentBalance: 0,
      purchasedBy: 'Anna Taylor',
      purchaserEmail: 'anna@email.com',
      purchaseDate: '2024-11-30',
      status: 'redeemed',
      usageHistory: [
        {
          date: '2024-12-05',
          amount: 150,
          booking: 'Haircut + Color'
        },
        {
          date: '2024-12-10',
          amount: 50,
          booking: 'Eyebrow Shaping'
        }
      ]
    }
  ]);

  // Calculate stats
  const stats = {
    totalSold: giftCards.length,
    totalRevenue: giftCards.reduce((sum, card) => sum + card.initialAmount, sum => sum),
    activeCards: giftCards.filter(card => card.status === 'active').length,
    totalRedeemed: giftCards.reduce((sum, card) => sum + (card.initialAmount - card.currentBalance), 0),
    outstandingBalance: giftCards.filter(card => card.status === 'active').reduce((sum, card) => sum + card.currentBalance, 0)
  };

  // Filter gift cards
  const filteredCards = giftCards.filter(card => {
    const matchesSearch = 
      card.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.purchasedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.recipientName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || card.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Gift card code copied to clipboard!');
  };

  const handleViewDetails = (card: GiftCard) => {
    setSelectedCard(card);
    setShowDetailsModal(true);
  };

  const handleSendEmail = (card: GiftCard) => {
    toast.success(`Gift card sent to ${card.recipientEmail || card.purchaserEmail}`);
    // TODO: Implement email sending via backend
  };

  const handleCancelCard = (cardId: string) => {
    if (confirm('Are you sure you want to cancel this gift card? This action cannot be undone.')) {
      toast.success('Gift card cancelled successfully');
      // TODO: Implement cancellation via backend
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'redeemed':
        return 'bg-gray-100 text-gray-700';
      case 'expired':
        return 'bg-red-100 text-red-700';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎁 Gift Cards & Vouchers</h1>
          <p className="text-gray-600">Manage gift cards, track balances, and boost sales</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Gift Card
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Gift className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalSold}</div>
            <div className="text-sm text-gray-600">Total Sold</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.activeCards}</div>
            <div className="text-sm text-gray-600">Active Cards</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRedeemed)}</div>
            <div className="text-sm text-gray-600">Total Redeemed</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-pink-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-pink-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(stats.outstandingBalance)}</div>
            <div className="text-sm text-gray-600">Outstanding</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by code, purchaser, or recipient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {(['all', 'active', 'redeemed', 'expired', 'cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    selectedStatus === status
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gift Cards List */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <h3 className="font-bold text-gray-900">Gift Cards ({filteredCards.length})</h3>
        </CardHeader>
        <CardContent>
          {filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No gift cards found</p>
              <p className="text-sm text-gray-400">Create your first gift card to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-semibold text-gray-900">{card.code}</span>
                            <button
                              onClick={() => handleCopyCode(card.code)}
                              className="text-gray-400 hover:text-purple-600 transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getStatusColor(card.status)}>
                              {card.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Balance: <span className="font-semibold text-gray-900">{formatPrice(card.currentBalance)}</span> / {formatPrice(card.initialAmount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>From: <span className="font-medium text-gray-900">{card.purchasedBy}</span></span>
                        </div>
                        {card.recipientName && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>To: <span className="font-medium text-gray-900">{card.recipientName}</span></span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Purchased: {new Date(card.purchaseDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {card.message && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-700 italic">"{card.message}"</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(card)}
                        className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {card.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendEmail(card)}
                          className="hover:bg-green-50 hover:text-green-600 hover:border-green-600"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      {(card.status === 'active' || card.status === 'expired') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelCard(card.id)}
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Usage Progress Bar */}
                  {card.initialAmount > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Used: {formatPrice(card.initialAmount - card.currentBalance)}</span>
                        <span>{Math.round(((card.initialAmount - card.currentBalance) / card.initialAmount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                          style={{ width: `${((card.initialAmount - card.currentBalance) / card.initialAmount) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Gift Card Modal */}
      {showCreateModal && (
        <CreateGiftCardModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
            console.log('Creating gift card:', data);
            toast.success('Gift card created successfully!');
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Gift Card Details Modal */}
      {showDetailsModal && selectedCard && (
        <GiftCardDetailsModal
          card={selectedCard}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}

// Create Gift Card Modal Component
function CreateGiftCardModal({
  onClose,
  onCreate
}: {
  onClose: () => void;
  onCreate: (data: any) => void;
}) {
  const { formatPrice } = useCurrency();
  const [amount, setAmount] = useState('');
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  const predefinedAmounts = [100, 200, 300, 500, 1000];

  const handleSubmit = () => {
    if (!amount || !purchaserName || !purchaserEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    const giftCardData = {
      amount: parseFloat(amount),
      purchaserName,
      purchaserEmail,
      recipientName: recipientName || undefined,
      recipientEmail: recipientEmail || undefined,
      message: message || undefined,
      sendEmail
    };

    onCreate(giftCardData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create Gift Card</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gift Card Amount *
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {predefinedAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    amount === amt.toString()
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-sm font-semibold">{formatPrice(amt)}</div>
                </button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Or enter custom amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Purchaser Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Purchaser Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <Input
                  value={purchaserName}
                  onChange={(e) => setPurchaserName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={purchaserEmail}
                  onChange={(e) => setPurchaserEmail(e.target.value)}
                  placeholder="john@email.com"
                />
              </div>
            </div>
          </div>

          {/* Recipient Information (Optional) */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Recipient Information (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">Leave blank if the purchaser is also the recipient</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name
                </label>
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email
                </label>
                <Input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="jane@email.com"
                />
              </div>
            </div>
          </div>

          {/* Gift Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gift Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/200 characters</p>
          </div>

          {/* Send Email Option */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id="sendEmail"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="w-4 h-4 text-purple-600"
            />
            <label htmlFor="sendEmail" className="text-sm text-gray-700 cursor-pointer">
              <span className="font-medium">Send gift card via email</span>
              <span className="block text-xs text-gray-600">
                The recipient will receive an email with the gift card details
              </span>
            </label>
          </div>

          {/* Preview */}
          {amount && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-sm opacity-90 mb-1">Gift Card Value</div>
                    <div className="text-3xl font-bold">{formatPrice(parseFloat(amount))}</div>
                  </div>
                  <Gift className="w-12 h-12 opacity-80" />
                </div>
                {message && (
                  <div className="bg-white/20 rounded-lg p-3 mb-4">
                    <p className="text-sm italic">"{message}"</p>
                  </div>
                )}
                <div className="text-sm opacity-90">
                  <div>From: {purchaserName || 'Your Name'}</div>
                  {recipientName && <div>To: {recipientName}</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!amount || !purchaserName || !purchaserEmail}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Create Gift Card
          </Button>
        </div>
      </div>
    </div>
  );
}

// Gift Card Details Modal Component
function GiftCardDetailsModal({
  card,
  onClose
}: {
  card: GiftCard;
  onClose: () => void;
}) {
  const { formatPrice } = useCurrency();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Gift Card Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Gift Card Visual */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-sm opacity-90 mb-1">Gift Card Value</div>
                <div className="text-3xl font-bold">{formatPrice(card.initialAmount)}</div>
                <div className="text-sm mt-2">
                  Current Balance: <span className="font-semibold">{formatPrice(card.currentBalance)}</span>
                </div>
              </div>
              <Gift className="w-12 h-12 opacity-80" />
            </div>
            <div className="font-mono text-lg mb-4">{card.code}</div>
            {card.message && (
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm italic">"{card.message}"</p>
              </div>
            )}
          </div>

          {/* Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Purchased By</div>
              <div className="font-semibold text-gray-900">{card.purchasedBy}</div>
              <div className="text-sm text-gray-600">{card.purchaserEmail}</div>
            </div>
            {card.recipientName && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Recipient</div>
                <div className="font-semibold text-gray-900">{card.recipientName}</div>
                <div className="text-sm text-gray-600">{card.recipientEmail}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600 mb-1">Purchase Date</div>
              <div className="font-semibold text-gray-900">
                {new Date(card.purchaseDate).toLocaleDateString()}
              </div>
            </div>
            {card.expiryDate && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Expiry Date</div>
                <div className="font-semibold text-gray-900">
                  {new Date(card.expiryDate).toLocaleDateString()}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <Badge className={
                card.status === 'active' ? 'bg-green-100 text-green-700' :
                card.status === 'redeemed' ? 'bg-gray-100 text-gray-700' :
                card.status === 'expired' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }>
                {card.status}
              </Badge>
            </div>
          </div>

          {/* Usage History */}
          {card.usageHistory.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Usage History</h3>
              <div className="space-y-3">
                {card.usageHistory.map((usage, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{usage.booking}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(usage.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">-{formatPrice(usage.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}