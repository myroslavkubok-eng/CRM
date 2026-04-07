import { useState } from 'react';
import { X, Send, Mail, MessageSquare, Copy, Check, Share2, Facebook, Twitter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useCurrency } from '../../contexts/CurrencyContext';

interface ShareGiftCardModalProps {
  giftCard: {
    code: string;
    amount: number;
    balance: number;
    salonName: string;
    message?: string;
    purchasedBy: string;
  };
  onClose: () => void;
}

export function ShareGiftCardModal({ giftCard, onClose }: ShareGiftCardModalProps) {
  const { formatPrice } = useCurrency();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Generate shareable link
  const shareableLink = `https://katia.com/gift-card/${giftCard.code}`;

  const handleSendEmail = async () => {
    if (!recipientEmail || !recipientName) {
      toast.error('Please enter recipient name and email');
      return;
    }

    setIsSending(true);

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/gift-cards/share', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     giftCardCode: giftCard.code,
      //     recipientEmail,
      //     recipientName,
      //     personalMessage
      //   })
      // });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`Gift card sent to ${recipientEmail}! 🎉`);
      onClose();
    } catch (error) {
      toast.error('Failed to send gift card. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setIsCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(giftCard.code);
    toast.success('Gift card code copied!');
  };

  const handleShareWhatsApp = () => {
    const message = `🎁 I'm sending you a gift card for ${giftCard.salonName}!\n\nGift Card Code: ${giftCard.code}\nAmount: ${formatPrice(giftCard.amount)}\n\nRedeem it here: ${shareableLink}\n\n${personalMessage || giftCard.message || ''}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleShareSMS = () => {
    const message = `🎁 Gift Card for ${giftCard.salonName}! Code: ${giftCard.code} - Amount: ${formatPrice(giftCard.amount)}. ${shareableLink}`;
    const url = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareTwitter = () => {
    const message = `🎁 Check out this gift card for ${giftCard.salonName}! ${shareableLink}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Share Gift Card</h2>
              <p className="text-sm text-gray-600">Send this gift card to someone special</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Gift Card Preview */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm opacity-90 mb-1">{giftCard.salonName}</div>
                <div className="text-3xl font-bold mb-1">{formatPrice(giftCard.amount)}</div>
                <div className="text-sm opacity-90">Gift Card</div>
                {giftCard.balance < giftCard.amount && (
                  <div className="text-sm mt-2 bg-white/20 inline-block px-2 py-1 rounded">
                    Balance: {formatPrice(giftCard.balance)}
                  </div>
                )}
              </div>
              <Share2 className="w-12 h-12 opacity-80" />
            </div>

            <div className="bg-white/20 rounded-lg p-3 mb-3">
              <div className="text-xs opacity-90 mb-1">Gift Card Code</div>
              <div className="flex items-center justify-between">
                <div className="font-mono text-lg font-bold tracking-wider">{giftCard.code}</div>
                <button
                  onClick={handleCopyCode}
                  className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {giftCard.message && (
              <div className="bg-white/20 rounded-lg p-3 mb-3">
                <p className="text-sm italic">"{giftCard.message}"</p>
              </div>
            )}

            <div className="text-sm opacity-90">
              From: {giftCard.purchasedBy}
            </div>
          </div>

          {/* Send via Email */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Send via Email
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name
                </label>
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="John Doe"
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
                  placeholder="john@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a Personal Message (Optional)
                </label>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Hope you enjoy this gift! 🎉"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{personalMessage.length}/200 characters</p>
              </div>
              <Button
                onClick={handleSendEmail}
                disabled={isSending || !recipientEmail || !recipientName}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isSending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Gift Card via Email
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Share Link */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-600" />
              Share Link
            </h3>
            <div className="flex gap-2 mb-4">
              <Input
                value={shareableLink}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className={isCopied ? 'bg-green-50 border-green-500 text-green-700' : ''}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Share this link with anyone. They can view and redeem the gift card.
            </p>
          </div>

          {/* Social Sharing */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Share on Social Media</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <Button
                onClick={handleShareWhatsApp}
                variant="outline"
                className="justify-start hover:bg-green-50 hover:border-green-500 hover:text-green-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>

              {/* SMS */}
              <Button
                onClick={handleShareSMS}
                variant="outline"
                className="justify-start hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                SMS
              </Button>

              {/* Facebook */}
              <Button
                onClick={handleShareFacebook}
                variant="outline"
                className="justify-start hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>

              {/* Twitter */}
              <Button
                onClick={handleShareTwitter}
                variant="outline"
                className="justify-start hover:bg-sky-50 hover:border-sky-500 hover:text-sky-700"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Important Security Notice</h4>
                <ul className="space-y-1 text-sm text-yellow-800">
                  <li>• Only share this gift card with people you trust</li>
                  <li>• The gift card code can be used by anyone who has it</li>
                  <li>• Once redeemed, the gift card cannot be re-used (one-time use per booking)</li>
                  <li>• Keep the code secure to prevent unauthorized use</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How Redemption Works */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">How to Redeem</h4>
                <ol className="space-y-1 text-sm text-purple-800 list-decimal list-inside">
                  <li>Visit {giftCard.salonName}</li>
                  <li>Show the gift card code to the staff</li>
                  <li>The staff will validate and apply the gift card to your booking</li>
                  <li>Pay any remaining balance (if applicable)</li>
                  <li>Enjoy your service! ✨</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
