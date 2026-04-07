import { Download, Share2, Send, Instagram, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { GiftCardTheme, GiftCardThemePreset, GIFT_CARD_THEMES, SalonGiftCardBranding } from '../types/giftCardTemplates';
import { useCurrency } from '../../contexts/CurrencyContext';

interface GiftCardPreviewProps {
  code?: string;
  amount: number;
  salonName: string;
  theme: GiftCardTheme;
  recipientName?: string;
  senderName?: string;
  purchaserName?: string;
  personalMessage?: string;
  message?: string;
  salonBranding?: SalonGiftCardBranding;
  onShare?: (method: 'email' | 'whatsapp' | 'instagram' | 'download') => void;
}

export function GiftCardPreview({
  code = 'PREVIEW',
  amount,
  salonName,
  theme,
  recipientName = '',
  senderName = '',
  purchaserName = '',
  personalMessage = '',
  message = '',
  salonBranding,
  onShare,
}: GiftCardPreviewProps) {
  const { formatPrice } = useCurrency();
  const themePreset = GIFT_CARD_THEMES[theme];
  
  // Use either senderName or purchaserName, whichever is provided
  const fromName = senderName || purchaserName;
  const displayMessage = personalMessage || message;

  return (
    <div className="space-y-4">
      {/* Beautiful Gift Card Visual */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl transform transition-transform hover:scale-[1.02]">
        {/* Background with theme - Enhanced gradient */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: salonBranding?.brandColors?.primary || themePreset.backgroundColor 
          }}
        />

        {/* Animated gradient overlay for depth */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${themePreset.accentColor}40 0%, transparent 50%),
                         radial-gradient(circle at 70% 50%, ${themePreset.textColor}20 0%, transparent 50%)`
          }}
        />

        {/* Decorative circles - floating effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ background: themePreset.accentColor }}
          />
          <div 
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ 
              background: themePreset.accentColor,
              animationDelay: '1s'
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full blur-3xl opacity-10"
            style={{ background: themePreset.textColor }}
          />
        </div>

        {/* Pattern overlay */}
        {themePreset.backgroundPattern && (
          <div className="absolute inset-0 opacity-15">
            <BackgroundPattern pattern={themePreset.backgroundPattern} />
          </div>
        )}

        {/* Sparkle effects in corners */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-yellow-300 opacity-60 animate-pulse">
          <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-yellow-300 opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>

        {/* Border shine effect */}
        <div className="absolute inset-0 rounded-3xl border-2 border-white/20" />
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s infinite'
          }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col p-3 sm:p-6 md:p-8">
          {/* Header: Logo + Salon Name */}
          <div className="flex items-start justify-between mb-2 sm:mb-auto">
            {/* Salon Logo with enhanced styling */}
            {salonBranding?.logo ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg px-2 py-1 sm:px-4 sm:py-3 border border-white/50">
                <img 
                  src={salonBranding.logo} 
                  alt={salonName}
                  className="h-5 sm:h-10 w-auto object-contain"
                />
              </div>
            ) : (
              <div className="bg-white/98 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg px-2 py-1 sm:px-5 sm:py-3 border-2 border-white/80 max-w-[55%]">
                <h3 className="font-bold text-[10px] sm:text-lg md:text-xl leading-tight text-gray-900">
                  {salonName}
                </h3>
              </div>
            )}

            {/* Theme Emoji with glow */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 blur-xl opacity-50" style={{ background: themePreset.accentColor }} />
              <div className="relative text-xl sm:text-4xl md:text-5xl drop-shadow-lg">
                {themePreset.emoji}
              </div>
            </div>
          </div>

          {/* Center: Main Content */}
          <div className="text-center space-y-1 sm:space-y-3 md:space-y-4">
            <div>
              <h2 
                className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1 md:mb-2 drop-shadow-lg tracking-wide"
                style={{ color: themePreset.textColor }}
              >
                GIFT CARD
              </h2>
              <p 
                className="text-[9px] sm:text-xs md:text-sm opacity-90 font-medium"
                style={{ color: themePreset.textColor }}
              >
                {themePreset.name}
              </p>
            </div>

            {/* Amount with enhanced styling */}
            <div className="relative inline-block">
              <div 
                className="absolute inset-0 blur-2xl opacity-30"
                style={{ background: themePreset.accentColor }}
              />
              <div 
                className="relative text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight drop-shadow-2xl"
                style={{ 
                  color: themePreset.accentColor,
                  textShadow: `0 0 20px ${themePreset.accentColor}40, 0 4px 10px rgba(0,0,0,0.3)`
                }}
              >
                {formatPrice(amount)}
              </div>
            </div>

            {/* Recipient with badge */}
            {recipientName && (
              <div className="hidden sm:inline-block">
                <div 
                  className="bg-white/20 backdrop-blur-md rounded-full px-2.5 py-0.5 sm:px-4 sm:py-1.5 md:px-5 md:py-2 border border-white/30 shadow-lg"
                  style={{ color: themePreset.textColor }}
                >
                  <span className="text-[10px] sm:text-sm md:text-base">
                    For: <span className="font-bold">{recipientName}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Personal Message with enhanced card - ONLY on desktop or if no message */}
            {displayMessage && (
              <div className="max-w-md mx-auto hidden sm:block">
                <div 
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 md:p-5 border border-white/30 shadow-xl"
                  style={{ color: themePreset.textColor }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl sm:text-2xl opacity-60">"</span>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm md:text-base italic leading-relaxed line-clamp-3">{displayMessage}</p>
                      {fromName && (
                        <p className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-80 font-medium">— {fromName}</p>
                      )}
                    </div>
                    <span className="text-xl sm:text-2xl opacity-60 self-end">"</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer: Code + Signature */}
          <div className="mt-auto space-y-1.5 sm:space-y-3">
            {/* Gift Card Code with premium styling */}
            <div className="bg-white/98 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center shadow-xl border-2 border-white/80">
              <p className="text-[9px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 font-medium tracking-wide">Gift Card Code</p>
              <p className="text-sm sm:text-lg md:text-xl font-mono font-black text-gray-900 tracking-wider sm:tracking-widest">
                {code}
              </p>
              <div className="mt-0.5 sm:mt-1 h-0.5 sm:h-1 w-12 sm:w-16 mx-auto rounded-full" style={{ background: themePreset.accentColor }} />
              
              {/* Recipient Name - visible on all devices */}
              {recipientName && (
                <div className="mt-2 sm:mt-3">
                  <p className="text-[11px] sm:text-sm text-gray-900 font-bold">
                    {recipientName}
                  </p>
                </div>
              )}
            </div>

            {/* Owner Signature */}
            {salonBranding?.ownerSignature && (
              <div 
                className="text-center text-sm"
                style={{ color: themePreset.textColor }}
              >
                {salonBranding.ownerSignature.signatureImage ? (
                  <img 
                    src={salonBranding.ownerSignature.signatureImage}
                    alt="Signature"
                    className="h-8 mx-auto opacity-80 drop-shadow-lg"
                  />
                ) : (
                  <div className="opacity-90 drop-shadow-md">
                    <p className="font-cursive text-lg">{salonBranding.ownerSignature.name}</p>
                    <p className="text-xs mt-1">{salonBranding.ownerSignature.title}</p>
                  </div>
                )}
              </div>
            )}

            {/* Custom Footer */}
            {salonBranding?.customFooter && (
              <p 
                className="text-xs text-center opacity-80 font-medium"
                style={{ color: themePreset.textColor }}
              >
                {salonBranding.customFooter}
              </p>
            )}
          </div>
        </div>

        {/* Decorative corner elements with glow */}
        <div 
          className="absolute top-0 left-0 w-32 h-32 opacity-25 blur-2xl"
          style={{ 
            background: `radial-gradient(circle at top left, ${themePreset.accentColor} 0%, transparent 70%)`
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-32 h-32 opacity-25 blur-2xl"
          style={{ 
            background: `radial-gradient(circle at bottom right, ${themePreset.accentColor} 0%, transparent 70%)`
          }}
        />

        {/* Top decorative line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>

      {/* Share Actions */}
      {onShare && (
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <h4 className="font-semibold mb-3 text-sm text-gray-900 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-purple-600" />
            Share Gift Card
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('download')}
              className="gap-2 hover:bg-purple-100 hover:border-purple-400"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('email')}
              className="gap-2 hover:bg-purple-100 hover:border-purple-400"
            >
              <Send className="w-4 h-4" />
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('whatsapp')}
              className="gap-2 hover:bg-purple-100 hover:border-purple-400"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare('instagram')}
              className="gap-2 hover:bg-purple-100 hover:border-purple-400"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-3 flex items-center gap-1">
            💡 <span>Download the image to share on social media or print it!</span>
          </p>
        </Card>
      )}

      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Background Pattern Component
 */
function BackgroundPattern({ pattern }: { pattern: 'hearts' | 'flowers' | 'stars' | 'confetti' | 'snowflakes' }) {
  const patterns = {
    hearts: '❤️',
    flowers: '🌸',
    stars: '⭐',
    confetti: '🎉',
    snowflakes: '❄️',
  };

  const emoji = patterns[pattern];

  return (
    <div className="w-full h-full relative">
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-xl sm:text-2xl animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: Math.random() * 0.4 + 0.2,
            transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.7})`,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}