# 🎯 Katia Platform - Основные Функции

> Подробное описание ключевых систем и функций платформы

---

## 💰 Мультивалютная Система

### Поддерживаемые валюты
- 🇺🇸 **USD** - US Dollar
- 🇪🇺 **EUR** - Euro
- 🇬🇧 **GBP** - British Pound
- 🇦🇪 **AED** - UAE Dirham
- 🇸🇦 **SAR** - Saudi Riyal
- 🇷🇺 **RUB** - Russian Ruble

### Regional Pricing (Price Parity)
**AED и SAR используют фиксированные цены 1:1 с USD:**

```
USD $99  → AED 99  (не 363.33!)
USD $299 → AED 299 (не 1089.99!)
USD $499 → AED 499 (не 1831.66!)
```

**Почему?**
- Психологический фактор (AED363 выглядит дорого)
- Стандарт в регионе (Apple, Microsoft используют 1:1)
- Покупательская способность

### Real-time Конвертация
**EUR, GBP, RUB используют курсы валют:**
```typescript
EUR: ~0.92
GBP: ~0.79
RUB: ~92.00
```

### Где работает?
- ✅ PricingPage (все планы)
- ✅ SalonCard (цены салонов)
- ✅ SalonProfile (услуги)
- ✅ BookingFlow (итоговая сумма)
- ✅ ClientDashboard (история)
- ✅ CheckoutModal (опла��а)
- ✅ Quick Retail (32 продукта)

---

## 🎁 Система Подарочных Сертификатов

### 11 Тематических Дизайнов

1. **Birthday** - День рождения
2. **Anniversary** - Годовщина
3. **Wedding** - Свадьба
4. **Mothers Day** - День матери
5. **Valentines** - День Святого Валентина
6. **Christmas** - Рождество
7. **Graduation** - Выпускной
8. **Thank You** - Благодарность
9. **Congratulations** - Поздравления
10. **Get Well** - Скорейшего выздоровления
11. **Just Because** - Просто так

### Функции
- ✅ Покупка с выбором темы
- ✅ Custom amount ($25-$500)
- ✅ Персональное сообщение
- ✅ QR код для redemption
- ✅ Email sharing
- ✅ Social sharing (WhatsApp, Twitter, Facebook)
- ✅ Download как изображение
- ✅ Tracking статуса
- ✅ Expiration dates
- ✅ Balance management

### Redemption Flow
1. Client покупает certificate
2. Получает QR код + уникальный код
3. Делится с получателем
4. Получатель сканирует QR
5. Выбирает салон и услугу
6. Применяет баланс к booking
7. Certificate частично/полностью погашен

### Роли доступа
- **Client**: Покупка, sharing, redemption
- **Master**: Просмотр примененных certificates
- **Admin**: Все certificate салона
- **Owner**: Все certificates, аналитика

---

## 💳 Stripe Integration

### Checkout System
**3 основных компонента:**
1. `CheckoutModal.tsx` - Базовая оплата
2. `EnhancedCheckoutModal.tsx` - С gift cards
3. `SmartCheckoutModal.tsx` - Умная оплата с AI

### Payment Options
- **Stripe Card Payment** - основной метод
- **Gift Certificate** - применение сертификатов
- **Deposit** - частичная оплата (Stripe Connect)
- **Pay Later** - отложенная оплата

### Subscription Plans
**Создано в Stripe Dashboard:**
```
prod_BasicStart: price_BasicMonthly (AED99)
prod_StandardGrowth: price_StandardMonthly (AED299)
prod_BusinessPro: price_BusinessMonthly (AED499)
```

### 18 Backend Endpoints
```
POST /make-server-3e5c72fb/checkout/create-session
POST /make-server-3e5c72fb/checkout/verify-session
POST /make-server-3e5c72fb/checkout/process-payment
POST /make-server-3e5c72fb/stripe/subscription/create
POST /make-server-3e5c72fb/stripe/subscription/cancel
GET  /make-server-3e5c72fb/stripe/subscription/:id
POST /make-server-3e5c72fb/deposit/create-account
POST /make-server-3e5c72fb/deposit/create-session
...и другие
```

### Session Tracking
```typescript
interface SessionTracking {
  sessionId: string;
  salonId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
}
```

---

## 📅 Booking System

### Двусторонний Workflow

**Phase 1: Client Creates Booking**
```
Client → Select Service → Choose Time → Pay Deposit
Status: "pending_salon_confirmation"
```

**Phase 2: Salon Confirms**
```
Salon → Review Booking → Confirm/Reject
Status: "confirmed" | "rejected"
```

**Phase 3: Client Confirms**
```
Client → Review Confirmed → Final Confirmation
Status: "client_confirmed"
```

### Payment Options

**Option 1: Deposit (Recommended)**
- Client платит 30% deposit
- Salon получает через Stripe Connect
- Остаток платится при визите
- Auto-refund если salon отменяет

**Option 2: Full Payment**
- Client платит 100% сразу
- Salon получает после визита
- Refund policy applies

**Option 3: Pay Later**
- Только для verified clients
- Payment при визите
- Salon может отклонить

### Автоблокировка Салонов
```typescript
// Если салон не оплатил subscription
if (subscriptionExpired && !isPaid) {
  salon.status = 'blocked';
  // Все bookings cancelled
  // Email notification отправлен
  // 7 days grace period
}
```

### Cancellation & Refunds

**Client Cancels:**
- До 24h: 100% refund
- 12-24h: 50% refund
- <12h: No refund

**Salon Cancels:**
- Всегда: 100% refund
- + Compensation 10%

---

## 🏢 Multi-Salon Management

### Salon Switcher
- Dropdown в header
- Быстрое переключение
- Раздельные данные
- Единый Owner аккаунт

### Staff Management
- Invite по email
- Role assignment
- Permissions control
- Activity tracking

### Analytics Per Salon
- Revenue отдельно
- Clients отдельно
- Masters отдельно
- Bookings отдельно

---

## 📱 PWA (Progressive Web App)

### Возможности
- ✅ Install на home screen
- ✅ Offline support
- ✅ Service Worker caching
- ✅ Push notifications ready
- ✅ App-like experience

### Файлы
```
/public/manifest.json - App manifest
/public/service-worker.js - SW logic
/public/icons/ - App icons (все размеры)
/public/offline.html - Offline fallback
```

### Install Prompt
```typescript
<PWAInstallBanner />
// Показывает когда PWA criteria выполнены
// Пользователь может установить приложение
```

---

## 📱 Beauty Feed System (Instagram-like)

### Основные возможности
- ✅ Публичная лента постов от салонов
- ✅ Last-Minute бронирования со скидками
- ✅ Система лайков
- ✅ Фильтрация постов (All / Posts / Last-Minute)
- ✅ Instagram-style дизайн карточек
- ✅ Автоматическая загрузка demo постов

### Типы постов

**1. Regular Post:**
- Новости салона
- Акции и обновления
- Анонсы новых услуг
- Фото работ мастеров

**2. Last-Minute Deal:**
- Срочные свободные слоты
- Скидки до 50%
- Информация о времени и цене
- Быстрое бронирование

### Функции для Owner/Admin
```typescript
// Создание поста
<CreateFeedPost 
  type="post" | "last-minute"
  title="..."
  description="..."
  image={file}
  // Для last-minute:
  serviceName="..."
  originalPrice={250}
  discountPrice={150}
  availableDate="2024-12-25"
  availableTime="16:00"
/>
```

### Backend API
```typescript
// Получить все посты
GET /feed/posts
Response: { posts: FeedPost[] }

// Создать пост (требует auth)
POST /feed/posts
Body: { salonId, salonName, type, title, description, imageUrl, ... }

// Удалить пост (только автор)
DELETE /feed/posts/:postId

// Лайкнуть пост
POST /feed/posts/:postId/like
```

### Demo Data
**8 демо-постов:**
- 4 regular posts (новости, акции)
- 4 last-minute deals (скидки 30-40%)
- Все с реальными Unsplash изображениями

**Загрузка:**
```typescript
// Кнопка "Load Demo Posts" на странице Feed
// Создаёт 8 постов автоматически
```

### Страница
- **URL:** `/#/feed`
- **Доступ:** Публичный (просмотр), Owner/Admin (создание)
- **Responsive:** Сетка 1-4 колонок

### Интеграция с Supabase Storage
- Изображения загружаются в папку `feed/`
- Auto-signed URLs для приватных бакетов
- Поддержка drag-drop upload

### UI Components
```
/src/app/pages/FeedPage.tsx - Главная страница
/src/app/components/FeedPostCard.tsx - Карточка поста
/src/app/components/CreateFeedPost.tsx - Модалка создания
/src/app/utils/feedSeeder.ts - Demo data seeder
/supabase/functions/server/feed-routes.ts - Backend API
```

### Клик на пост
- Переход на `/salon/:salonId`
- Просмотр всех услуг салона
- Бронирование (для last-minute)

---

## 🖼️ Supabase Storage System

### 7 Категорий Storage

1. **salons/** - Фото салонов
2. **services/** - Изображения услуг
3. **products/** - Фото продуктов
4. **masters/** - Аватары мастеров
5. **clients/** - Фото клиентов
6. **beauty-feed/** - Beauty feed галерея
7. **certificates/** - Подарочные сертификаты

### Auto-Seeder
**30 изображений с Unsplash:**
- 5 салонов
- 6 услуг (haircut, nails, etc.)
- 6 продуктов (shampoo, serum, etc.)
- 4 мастера
- 3 клиента
- 4 beauty feed
- 2 certificates

### Storage Admin UI
**Доступ: `/#/storage-admin`**

Функции:
- ✅ Просмотр всех buckets
- ✅ Upload изображений
- ✅ Delete изображений
- ✅ One-click seeding (35 секунд)
- ✅ Storage statistics
- ✅ Category breakdown

### React Hooks
```typescript
// Upload hook
const { upload, loading, error } = useImageUpload();
await upload(file, 'salons');

// Display component
<SupabaseImage 
  path="salons/luxury-salon-1.jpg"
  alt="Salon"
  className="w-full"
/>
```

---

## 📊 Analytics & CRM

### Dashboard Metrics

**Revenue Tracking:**
- Total revenue
- Monthly breakdown
- Per-salon revenue
- Growth trends

**Client Analytics:**
- New clients
- Returning clients
- Churn rate
- LTV (Lifetime Value)

**Booking Analytics:**
- Bookings по времени
- Popular services
- Peak hours
- Cancellation rate

**Master Performance:**
- Revenue per master
- Bookings per master
- Client rating
- Monthly targets

### Advanced Features
- ✅ Email campaign manager
- ✅ SMS notifications (готово)
- ✅ Loyalty programs
- ✅ Referral system
- ✅ Wait list management
- ✅ Dynamic pricing
- ✅ Forecasting AI

---

## 🎨 Quick Retail Demo

### 32 Real Products
**6 Categories:**
1. Hair Care (8 products)
2. Skin Care (6 products)
3. Tools (6 products)
4. Styling (4 products)
5. Nail Care (4 products)
6. Accessories (4 products)

### Interactive Features
- ✅ Add to cart
- ✅ Quantity selector
- ✅ Stock tracking
- ✅ Category filters
- ✅ Search
- ✅ Multi-currency prices
- ✅ Checkout flow
- ✅ Order summary

**Доступ:** `/#/quick-retail`

---

## 🧪 Testing Coverage

### Unit Tests
- **AuthContext**: 16 tests, 95% coverage
- **Utilities**: Various helpers
- **Components**: Selected components

### CI/CD Testing
- ✅ Auto-run на каждый push
- ✅ PR coverage reports
- ✅ ESLint checks
- ✅ Prettier formatting
- ✅ TypeScript type-check

### Test Commands
```bash
npm test                 # Run all
npm run test:coverage    # With coverage
npm run test:watch       # Watch mode
npm test AuthContext     # Specific file
```

---

## 🔐 Role-Based Access Control

### Owner (Владелец)
- Создает салоны
- Управляет подписками
- Приглашает админов
- Видит всю аналитику
- Multi-salon доступ

### Admin (Администратор)
- Управляет календарем
- Добавляет мастеров
- Управляет услугами
- Видит клиентов
- Email campaigns

### Master (Мастер)
- Свой календарь
- Свои клиенты
- Свои услуги
- Limited analytics
- Booking management

### Client (Клиент)
- Бронирование услуг
- История визитов
- Gift cards
- Favorites
- Profile management

---

*Документация обновлена: 25 декабря 2024*