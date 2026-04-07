// Gift Card Templates & Customization System

/**
 * Темы для подарочных сертификатов
 */
export type GiftCardTheme = 
  | 'birthday'      // 🎂 День рождения
  | 'wedding'       // 💍 Свадьба
  | 'mothers-day'   // 💐 Для мамы
  | 'valentines'    // ❤️ День Святого Валентина
  | 'anniversary'   // 🎉 Юбилей
  | 'just-because'  // 🎁 Просто так
  | 'christmas'     // 🎄 Рождество
  | 'new-year'      // 🎆 Новый год
  | 'graduation'    // 🎓 Выпускной
  | 'thank-you'     // 🙏 Благодарность
  | 'custom';       // 🎨 Кастомный дизайн

/**
 * Preset дизайны для каждой темы
 */
export interface GiftCardThemePreset {
  id: GiftCardTheme;
  name: string;
  emoji: string;
  description: string;
  
  // Визуальные настройки
  backgroundColor: string; // Gradient or solid
  textColor: string;
  accentColor: string;
  
  // Decorative elements
  backgroundPattern?: 'hearts' | 'flowers' | 'stars' | 'confetti' | 'snowflakes';
  headerImage?: string; // URL к декоративной картинке
  
  // Предустановленные сообщения
  defaultMessage: string;
  defaultSubject: string;
}

/**
 * Кастомизация салона для сертификатов
 */
export interface SalonGiftCardBranding {
  salonId: string;
  
  // Логотип и брендинг
  logo?: string; // URL к логотипу салона
  logoPosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-center';
  
  // Фирменные цвета (override themes)
  brandColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  
  // Подпись владельца
  ownerSignature?: {
    name: string;
    title: string; // "Founder", "CEO", etc.
    signatureImage?: string; // URL к изображению подписи
  };
  
  // Дополнительный текст
  customFooter?: string; // "Thank you for choosing us!"
  websiteUrl?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
  };
  
  // Настройки по умолчанию
  defaultTheme: GiftCardTheme;
  allowCustomThemes: boolean;
}

/**
 * Созданный визуальный сертификат
 */
export interface GeneratedGiftCard {
  id: string;
  code: string; // "KATIA-A7X9-2K4M-3P5Q"
  
  // Базовая инфо
  salonId: string;
  salonName: string;
  amount: number;
  currency: string;
  
  // Персонализация
  theme: GiftCardTheme;
  recipientName: string; // Для кого
  recipientEmail?: string;
  senderName: string; // От кого
  personalMessage: string;
  
  // Визуал
  imageUrl: string; // Сгенерированное красивое фото
  pdfUrl?: string; // PDF версия для печати
  
  // Брендинг салона
  salonBranding: SalonGiftCardBranding;
  
  // Даты
  createdAt: Date;
  expiresAt?: Date | null; // null = never expires
  
  // Sharing info
  shared: boolean;
  sharedVia?: ('email' | 'whatsapp' | 'instagram' | 'download')[];
  sharedAt?: Date;
}

/**
 * Параметры для генерации сертификата
 */
export interface GiftCardGenerationParams {
  // Базовая инфо
  code: string;
  salonId: string;
  salonName: string;
  amount: number;
  currency: string;
  
  // Персонализация
  theme: GiftCardTheme;
  recipientName: string;
  senderName: string;
  personalMessage: string;
  occasion?: string; // "Happy Birthday!", "Congratulations!", etc.
  
  // Брендинг
  salonBranding: SalonGiftCardBranding;
  
  // Опции
  format: 'image' | 'pdf' | 'both';
  size: 'instagram-square' | 'instagram-story' | 'card' | 'email';
}

/**
 * Sharing опции
 */
export interface GiftCardShareOptions {
  giftCardId: string;
  
  // Куда отправить
  method: 'email' | 'whatsapp' | 'instagram' | 'download';
  
  // Email специфичное
  recipientEmail?: string;
  emailSubject?: string;
  emailBody?: string;
  
  // WhatsApp
  phoneNumber?: string;
  whatsappMessage?: string;
  
  // Download опции
  format?: 'png' | 'jpg' | 'pdf';
  size?: 'small' | 'medium' | 'large' | 'print';
}

/**
 * Предустановленные темы
 */
export const GIFT_CARD_THEMES: Record<GiftCardTheme, GiftCardThemePreset> = {
  'birthday': {
    id: 'birthday',
    name: 'Birthday',
    emoji: '🎂',
    description: 'Perfect for birthday celebrations',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    accentColor: '#ffd700',
    backgroundPattern: 'confetti',
    defaultMessage: 'Happy Birthday! Wishing you a day filled with beauty and joy! 🎂',
    defaultSubject: 'Happy Birthday Gift Card',
  },
  
  'wedding': {
    id: 'wedding',
    name: 'Wedding',
    emoji: '💍',
    description: 'For the special couple',
    backgroundColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    textColor: '#4a4a4a',
    accentColor: '#d4af37',
    backgroundPattern: 'hearts',
    defaultMessage: 'Congratulations on your wedding! May your love story be filled with beauty! 💍',
    defaultSubject: 'Wedding Gift Card',
  },
  
  'mothers-day': {
    id: 'mothers-day',
    name: "Mother's Day",
    emoji: '💐',
    description: 'Show mom some love',
    backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    textColor: '#ffffff',
    accentColor: '#ffe5e5',
    backgroundPattern: 'flowers',
    defaultMessage: 'Happy Mother\'s Day to the most amazing mom! You deserve to be pampered! 💐',
    defaultSubject: "Mother's Day Gift Card",
  },
  
  'valentines': {
    id: 'valentines',
    name: "Valentine's Day",
    emoji: '❤️',
    description: 'For your special someone',
    backgroundColor: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
    textColor: '#ffffff',
    accentColor: '#ffe0e0',
    backgroundPattern: 'hearts',
    defaultMessage: 'Happy Valentine\'s Day! You deserve all the pampering in the world! ❤️',
    defaultSubject: "Valentine's Day Gift Card",
  },
  
  'anniversary': {
    id: 'anniversary',
    name: 'Anniversary',
    emoji: '🎉',
    description: 'Celebrate your milestone',
    backgroundColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    textColor: '#4a4a4a',
    accentColor: '#ffffff',
    backgroundPattern: 'stars',
    defaultMessage: 'Happy Anniversary! Here\'s to many more beautiful years together! 🎉',
    defaultSubject: 'Anniversary Gift Card',
  },
  
  'just-because': {
    id: 'just-because',
    name: 'Just Because',
    emoji: '🎁',
    description: 'No reason needed',
    backgroundColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    textColor: '#4a4a4a',
    accentColor: '#667eea',
    backgroundPattern: 'confetti',
    defaultMessage: 'Just because you\'re amazing! Enjoy some well-deserved pampering! 🎁',
    defaultSubject: 'Gift Card for You',
  },
  
  'christmas': {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    description: 'Festive holiday cheer',
    backgroundColor: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    textColor: '#ffffff',
    accentColor: '#ff6b6b',
    backgroundPattern: 'snowflakes',
    defaultMessage: 'Merry Christmas! Wishing you joy, beauty, and relaxation this holiday season! 🎄',
    defaultSubject: 'Christmas Gift Card',
  },
  
  'new-year': {
    id: 'new-year',
    name: 'New Year',
    emoji: '🎆',
    description: 'Start the year fresh',
    backgroundColor: 'linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)',
    textColor: '#ffffff',
    accentColor: '#ffd700',
    backgroundPattern: 'stars',
    defaultMessage: 'Happy New Year! Start the year looking and feeling your best! 🎆',
    defaultSubject: 'New Year Gift Card',
  },
  
  'graduation': {
    id: 'graduation',
    name: 'Graduation',
    emoji: '🎓',
    description: 'Celebrate achievement',
    backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    textColor: '#ffffff',
    accentColor: '#ffd700',
    backgroundPattern: 'stars',
    defaultMessage: 'Congratulations on your graduation! You\'ve earned some celebration! 🎓',
    defaultSubject: 'Graduation Gift Card',
  },
  
  'thank-you': {
    id: 'thank-you',
    name: 'Thank You',
    emoji: '🙏',
    description: 'Express gratitude',
    backgroundColor: 'linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)',
    textColor: '#4a4a4a',
    accentColor: '#667eea',
    defaultMessage: 'Thank you for being amazing! This is a small token of my appreciation! 🙏',
    defaultSubject: 'Thank You Gift Card',
  },
  
  'custom': {
    id: 'custom',
    name: 'Custom',
    emoji: '🎨',
    description: 'Create your own design',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    accentColor: '#ffffff',
    defaultMessage: '',
    defaultSubject: 'Gift Card',
  },
};

/**
 * Размеры для разных форматов
 */
export const GIFT_CARD_SIZES = {
  'instagram-square': { width: 1080, height: 1080 },
  'instagram-story': { width: 1080, height: 1920 },
  'card': { width: 800, height: 500 },
  'email': { width: 600, height: 400 },
  'print': { width: 2100, height: 1400 }, // 300 DPI for 7x5 inch
};

/**
 * Helper: Получить тему по ID
 */
export function getThemePreset(themeId: GiftCardTheme): GiftCardThemePreset {
  return GIFT_CARD_THEMES[themeId];
}

/**
 * Helper: Применить брендинг салона к теме
 */
export function applyBrandingToTheme(
  theme: GiftCardThemePreset,
  branding: SalonGiftCardBranding
): GiftCardThemePreset {
  if (!branding.brandColors) return theme;
  
  return {
    ...theme,
    backgroundColor: branding.brandColors.primary || theme.backgroundColor,
    accentColor: branding.brandColors.accent || theme.accentColor,
  };
}
