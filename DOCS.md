# 📚 Katia Platform - Полная Документация

> Комплексная SaaS платформа для салонов красоты с AI, мультивалютностью, Stripe, подарочными сертификатами и PWA

---

## 🚀 Быстрый Старт

### 1. Установка
```bash
npm install
```

### 2. Настройка Environment Variables
Создайте файл `.env` в корне проекта:

```env
# Supabase (обязательно)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Stripe (опционально)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Google Maps (опционально)
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

### 3. Запуск Development
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
```

---

## 📦 Деплой на GitHub Pages

### Автоматический деплой (рекомендуется)

#### Windows:
```bash
.\push.bat
```

#### Linux/Mac:
```bash
chmod +x push.sh
./push.sh
```

#### PowerShell:
```powershell
.\push.ps1
```

### Ручной деплой
```bash
git add .
git commit -m "deploy: update"
git push origin main
npm run deploy
```

### Настройка GitHub Pages
1. Settings → Pages → Source: **GitHub Actions**
2. Settings → Secrets → Добавьте: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## 🏗️ Архитектура

### Основные модули

#### 1. **Мультивалютность** 🌍
- 6 валют: USD, EUR, GBP, AED, SAR, RUB
- Regional Pricing для AED/SAR (1:1 с USD)
- Real-time конвертация для EUR, GBP, RUB
- Работает везде: pricing, salons, bookings, checkout

#### 2. **Stripe Integration** 💳
- Полная checkout система
- Stripe Connect для депозитов
- Subscription планы (3 уровня)
- Session tracking
- Webhook support

#### 3. **Подарочные Сертификаты** 🎁
- 11 тематических дизайнов
- QR коды для шаринга
- Redemption система
- Email/Social sharing
- Tracking и analytics

#### 4. **Booking System** 📅
- Двусторонний workflow (Client → Salon → Confirm)
- Real-time календарь
- Deposit/Full payment опции
- Отмена и возврат
- Автоблокировка при неоплате

#### 5. **Multi-Salon Management** 🏢
- Управление несколькими салонами
- Раздельная аналитика
- Staff приглашения
- Role-based access (Owner/Admin/Master/Client)

#### 6. **PWA** 📱
- Offline support
- Install prompt
- Service Worker
- Push notifications готовы

#### 7. **Supabase Storage** 🖼️
- 7 категорий изображений
- Автоматическая загрузка 30 demo изображений
- Storage Admin UI (/#/storage-admin)
- React hooks для загрузки

#### 8. **Analytics & CRM** 📊
- Revenue tracking
- Client management
- Advanced forecasting
- Email campaigns
- Loyalty programs

---

## 🎨 Дизайн-система

### Цветовая схема
```css
/* Основные градиенты */
--gradient-primary: purple-600 → pink-600
--gradient-hero: purple-50 → white
--gradient-cta: purple-900 → pink-900

/* Иконки */
Purple: AI, Calendar, Premium
Blue: Voice, Client Management
Pink: Beauty, Styling
Orange: Inventory, Finance
Green: Success, Growth
```

### Компоненты
- 140+ React компонентов
- Shadcn UI библиотека
- Tailwind CSS 4.0
- Responsive design
- Mobile-first подход

---

## 🔐 Система Ролей

### 4 типа пользователей:

1. **Owner** - Владелец салона
   - Полный доступ
   - Multi-salon управление
   - Финансы и analytics

2. **Admin** - Администратор
   - Управление календарем
   - Staff management
   - Client management

3. **Master** - Мастер
   - Свой календарь
   - Клиенты
   - Services

4. **Client** - Клиент
   - Бронирования
   - История
   - Подарочные сертификаты

---

## 💰 Subscription Plans

### Basic Start - $99/month (AED99)
- 1 salon
- 3 masters
- 100 clients
- Basic analytics
- Email support

### Standard Growth - $299/month (AED299)
- 3 salons
- 10 masters
- 500 clients
- Advanced analytics
- Priority support
- Email campaigns

### Business Pro - $499/month (AED499)
- Unlimited salons
- Unlimited masters
- Unlimited clients
- AI Tools
- White label
- Dedicated support

---

## 🛠️ CI/CD Pipeline

### GitHub Actions Workflows

#### 1. `ci.yml` - CI Pipeline
- Lint (ESLint + Prettier)
- Tests (Vitest + Coverage)
- Build
- Deploy (только main branch)

#### 2. `deploy.yml` - Production Deploy
- Build с environment variables
- Deploy на GitHub Pages
- Auto-trigger на push main/master

#### 3. `pr-checks.yml` - PR Quality
- Code quality checks
- Test coverage reports
- Auth tests

#### 4. `deploy-preview.yml` - Preview Builds
- Build preview для PR
- Comment с статистикой

---

## 📱 Страницы

### Public Pages
- `/` - HomePage
- `/pricing` - Pricing Plans
- `/salons` - Salon Listing
- `/salon/:id` - Salon Profile
- `/become-partner` - Partner Registration
- `/contact` - Contact/Support

### Demo Pages
- `/demo` - Full Platform Demo
- `/quick-retail` - Retail Checkout Demo (32 продукта)
- `/checkout-demo` - Checkout Flow Demo
- `/dashboard-demo` - Dashboard Preview
- `/blocked-salon` - Auto-block Demo

### User Dashboards
- `/client-dashboard` - Client Dashboard
- `/master-dashboard` - Master Dashboard
- `/admin-dashboard` - Admin Dashboard
- `/owner-dashboard` - Owner Dashboard
- `/super-admin` - Super Admin (Plans Management)

### Special Pages
- `/auth` - Login/Signup
- `/salon-register` - Salon Registration
- `/booking/:id` - Booking Flow
- `/gift-cards` - Client Gift Cards
- `/notifications` - Notifications Center
- `/#/storage-admin` - Storage Admin UI

---

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Specific file
npm test AuthContext
```

### Test Coverage
- **AuthContext**: 95% coverage (16+ tests)
- CI автоматически проверяет покрытие
- LCOV reports в `/coverage`

---

## 🔧 Development Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Run tests
npm test

# Deploy to GitHub Pages
npm run deploy
```

---

## 📊 Key Features Summary

### ✅ Реализовано (100% готово)

**Core Platform:**
- [x] Multi-currency (6 валют)
- [x] Regional pricing (AED/SAR)
- [x] Stripe integration
- [x] Subscription plans
- [x] Role-based access (4 роли)
- [x] Multi-salon management
- [x] PWA support

**Booking System:**
- [x] Двусторонний workflow
- [x] Deposit система
- [x] Real-time календарь
- [x] Отмена и возврат
- [x] Автоблокировка салонов
- [x] Email notifications

**E-commerce:**
- [x] Подарочные сертификаты (11 дизайнов)
- [x] Quick retail checkout
- [x] Product inventory
- [x] Package deals
- [x] Loyalty programs

**CRM & Analytics:**
- [x] Client management
- [x] Master management
- [x] Advanced analytics
- [x] Email campaigns
- [x] Revenue tracking
- [x] Forecasting

**Storage & Media:**
- [x] Supabase Storage integration
- [x] Image upload system
- [x] 7 категорий storage
- [x] Auto-seeder (30 images)
- [x] Storage Admin UI

**DevOps:**
- [x] CI/CD pipeline (4 workflows)
- [x] Auto-deploy scripts (3 OS)
- [x] Test coverage (95%)
- [x] ESLint + Prettier
- [x] TypeScript strict mode

---

## 🎯 Quick Links

### Development
- **Local**: http://localhost:5173
- **Storage Admin**: http://localhost:5173/#/storage-admin
- **Demo Modal**: http://localhost:5173/pricing → "View Live Demo"

### Production (после deploy)
- **Homepage**: https://yourusername.github.io/katia
- **Pricing**: https://yourusername.github.io/katia/#/pricing
- **Quick Retail**: https://yourusername.github.io/katia/#/quick-retail

### GitHub
- **Actions**: Settings → Actions (CI/CD workflows)
- **Pages**: Settings → Pages (deployment)
- **Secrets**: Settings → Secrets → Actions

---

## 📝 Environment Variables Guide

### Frontend (VITE_*)
Все переменные должны начинаться с `VITE_`:

```env
# Обязательные
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# Опциональные
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_GOOGLE_MAPS_API_KEY=AIzaSyxxx
```

### Backend (Supabase Edge Functions)
Настраиваются автоматически:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

---

## 🐛 Troubleshooting

### Build Errors

#### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

#### "React is not defined"
```bash
# Уже исправлено - suppressWarnings.ts добавлен
npm run build
```

#### Workflow errors
```bash
# Workflows теперь в правильной папке
.github/workflows/
```

### Runtime Errors

#### Currency не работает
- Проверьте CurrencyContext правильно обернут в App.tsx
- Убедитесь что useCurrency() вызывается внутри провайдера

#### Storage images не загружаются
- Откройте /#/storage-admin
- Нажмите "Seed Demo Images"
- Дождитесь загрузки 30 изображений (~35 секунд)

#### Stripe не работает
- Добавьте `VITE_STRIPE_PUBLISHABLE_KEY` в .env
- Проверьте что ключ начинается с `pk_`

---

## 📚 Additional Resources

### Supabase
- Storage: 7 folders (salons, services, products, masters, clients, beauty-feed, certificates)
- Auth: Email/Password + OAuth ready
- Database: KV store для прототипирования

### Stripe
- Products & Prices созданы в dashboard
- Webhooks настроены для subscription events
- Test mode для development

### PWA
- Manifest: `/public/manifest.json`
- Service Worker: `/public/service-worker.js`
- Icons: `/public/icons/`

---

## 🎉 Ready to Deploy!

После установки и настройки:

1. ✅ Запустите `npm run dev` для проверки
2. ✅ Настройте GitHub Secrets
3. ✅ Запустите `./push.sh` (или .bat/.ps1)
4. ✅ Проверьте GitHub Actions
5. ✅ Откройте deployed URL

**Платформа готова к production использованию!** 🚀

---

*Last updated: December 25, 2024*  
*Version: 3.0.0*  
*Status: ✅ Production Ready*
