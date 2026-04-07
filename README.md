# 💜 Katia - Салон красоты SaaS платформа

[![CI Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%20Pipeline/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Современная SaaS платформа для салонов красоты с AI, мультивалютностью, Stripe, подарочными сертификатами, PWA и полным CI/CD

---

## ✨ Основные возможности

- 🌍 **6 валют** с regional pricing (AED/SAR 1:1 с USD)
- 💳 **Stripe Integration** - полный checkout + deposits + subscriptions
- 🎁 **11 дизайнов** подарочных сертификатов с QR кодами
- 📅 **Двусторонний booking** с подтверждениями
- 🏢 **Multi-salon** управление
- 👥 **4 роли** (Owner/Admin/Master/Client)
- 📱 **PWA** с offline support
- 🖼️ **Supabase Storage** с auto-seeder (30 images)
- 📊 **CRM & Analytics** с AI forecasting
- 🧪 **95% test coverage** + полный CI/CD
- 📱 **Feed System** - Instagram-like посты и last-minute deals

---

## 🚀 Быстрый старт

### 1. Установка
```bash
npm install
```

### 2. Environment Setup
Создайте `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### 3. Development
```bash
npm run dev
```

### 4. Deploy на GitHub Pages

**Windows:**
```bash
.\push.bat
```

**Linux/Mac:**
```bash
chmod +x push.sh
./push.sh
```

**PowerShell:**
```powershell
.\push.ps1
```

---

## 📚 Документация

### Главные файлы
- **[DOCS.md](DOCS.md)** - Полная документация (архитектура, API, deployment)
- **[FEATURES.md](FEATURES.md)** - Подробное описание всех функций
- README.md (этот файл) - Быстрый старт

### Дополнительная документация
- `/docs/TROUBLESHOOTING.md` - Решение проблем
- `/docs/REACT_ROOT_WARNING.md` - React warnings
- `/docs/SUPABASE_STORAGE.md` - Storage guide
- `/guidelines/Guidelines.md` - Code guidelines

---

## 🧪 Testing

```bash
# Run tests
npm test

# With coverage (требуется 80%+)
npm run test:coverage

# Watch mode
npm run test:watch

# UI mode
npm run test:ui
```

**Test Coverage:** 95% на AuthContext (16+ tests)

---

## 📦 Key Scripts

| Command | ��писание |
|---------|----------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
| `npm run ci` | Full CI check (lint + format + test) |
| `npm run deploy` | Deploy to GitHub Pages |

---

## 🏗️ Tech Stack

**Frontend:**
- React 18.3.1 + TypeScript
- Vite 6.3.5
- Tailwind CSS 4.1.12
- Motion (Framer Motion)
- Radix UI

**Backend:**
- Supabase (Auth + DB + Storage)
- Stripe (Payments)
- Edge Functions (Hono)

**DevOps:**
- GitHub Actions (4 workflows)
- Vitest + Testing Library
- ESLint + Prettier

---

## 💰 Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| **Basic Start** | AED 99 | 1 salon, 3 masters, 100 clients |
| **Standard Growth** | AED 299 | 3 salons, 10 masters, 500 clients |
| **Business Pro** | AED 499 | Unlimited + AI Tools |

---

## 👥 User Roles

- **Owner** - Multi-salon management, full analytics
- **Admin** - Calendar, staff, clients
- **Master** - Own calendar, services
- **Client** - Bookings, gift cards, history

---

## 🎯 Key Features Summary

### ✅ Core Platform
- [x] Multi-currency (6 валют)
- [x] Regional pricing (AED/SAR)
- [x] Stripe integration
- [x] Subscription система
- [x] Role-based access
- [x] Multi-salon management

### ✅ Booking System
- [x] Двусторонний workflow
- [x] Deposit payments
- [x] Auto-block на неоплату
- [x] Cancellation & Refunds

### ✅ E-commerce
- [x] Gift certificates (11 designs)
- [x] Quick retail checkout (32 products)
- [x] Product inventory
- [x] Package deals

### ✅ CRM & Analytics
- [x] Client management
- [x] Revenue tracking
- [x] Email campaigns
- [x] Forecasting AI

### ✅ Media & Storage
- [x] Supabase Storage (7 folders)
- [x] Image upload system
- [x] Auto-seeder (30 images)
- [x] Storage Admin UI (`/#/storage-admin`)

### ✅ DevOps
- [x] CI/CD (4 GitHub workflows)
- [x] Auto-deploy scripts
- [x] 95% test coverage
- [x] ESLint + Prettier

---

## 🌍 Multi-Currency

**Supported:**
- USD 🇺🇸
- EUR 🇪🇺
- GBP 🇬🇧
- AED 🇦🇪 (1:1 с USD)
- SAR 🇸🇦 (1:1 с USD)
- RUB 🇷🇺

**Regional Pricing:**
```
$99  → AED 99  (не 363!)
$299 → AED 299 (не 1090!)
$499 → AED 499 (не 1832!)
```

---

## 📱 Key Pages

### Public
- `/` - Homepage
- `/pricing` - Pricing Plans
- `/salons` - Salon Listing
- `/become-partner` - Partner Registration

### Demos
- `/demo` - Platform Demo (6 tabs)
- `/quick-retail` - Retail Demo (32 products)
- `/#/storage-admin` - Storage Admin

### Dashboards
- `/client-dashboard` - Client Dashboard
- `/owner-dashboard` - Owner Dashboard
- `/master-dashboard` - Master Dashboard
- `/admin-dashboard` - Admin Dashboard

---

## 🔄 CI/CD Workflows

### 1. CI Pipeline (`ci.yml`)
- Lint → Test → Build → Deploy
- Runs on: push to main/develop

### 2. Deploy (`deploy.yml`)
- Production deploy to GitHub Pages
- Auto-trigger on main push

### 3. PR Checks (`pr-checks.yml`)
- Code quality
- Test coverage reports
- Auth tests

### 4. Deploy Preview (`deploy-preview.yml`)
- Preview builds for PRs
- Build stats comments

---

## 🎁 Gift Certificates

**11 Themes:**
Birthday, Anniversary, Wedding, Mothers Day, Valentines, Christmas, Graduation, Thank You, Congratulations, Get Well, Just Because

**Features:**
- Custom amounts ($25-$500)
- QR codes
- Email/Social sharing
- Balance tracking
- Expiration dates

---

## 🖼️ Supabase Storage

**7 Categories:**
salons, services, products, masters, clients, beauty-feed, certificates

**Auto-Seeder:**
30 demo images from Unsplash (~35 seconds)

**Access:**
`http://localhost:5173/#/storage-admin`

---

## 🐛 Troubleshooting

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tests failing?**
```bash
npm run test:coverage
```

**Deployment issues?**
- Check GitHub Secrets (Settings → Secrets → Actions)
- Add: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

**More help:** [DOCS.md](DOCS.md) или [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 🤝 Contributing

1. Create feature branch
2. Write tests (maintain 80%+ coverage)
3. Run `npm run ci`
4. Create PR

---

## 📝 License

MIT © Katia Team

---

**💜 Made with love by Katia Team**  
*Version 3.0.0 | December 25, 2024*