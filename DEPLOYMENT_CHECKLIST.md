# ✅ Deployment Checklist

Проверьте перед деплоем на production.

## 📦 Pre-Deploy

### Code Quality

- [ ] `npm run lint` проходит без ошибок
- [ ] `npm run format:check` проходит
- [ ] `npm run test` все тесты зеленые
- [ ] `npm run test:coverage` >= 80%
- [ ] `npm run ci` полностью проходит

### Build

- [ ] `npm run build` успешен
- [ ] `npm run preview` работает локально
- [ ] Нет console.error в production build
- [ ] Bundle size приемлемый (проверить dist/)

### Environment

- [ ] `.env.local` не в git
- [ ] GitHub Secrets настроены:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Все VITE_ переменные имеют правильный префикс
- [ ] Production конфиг проверен

### Git

- [ ] Все изменения закоммичены
- [ ] Branch синхронизирован с main
- [ ] Нет конфликтов
- [ ] Conventional commits используются

## 🚀 Deploy

### GitHub Pages

- [ ] Repository → Settings → Pages включен
- [ ] Source: GitHub Actions
- [ ] Base URL в vite.config.ts корректен
- [ ] Custom domain настроен (если используется)

### CI/CD

- [ ] `.github/workflows/ci.yml` существует
- [ ] Main pipeline проходит
- [ ] Deploy job выполнился
- [ ] GitHub Actions зеленые

## ✅ Post-Deploy

### Проверка Production

- [ ] Сайт открывается по URL
- [ ] Главная страница загружается
- [ ] Все роуты работают (/dashboard, /booking, etc.)
- [ ] Нет 404 ошибок на страницах
- [ ] Console чистый (без errors)

### Функциональность

- [ ] Авторизация работает:
  - [ ] Sign Up
  - [ ] Sign In (Email)
  - [ ] Google OAuth
  - [ ] Facebook OAuth
  - [ ] Sign Out
- [ ] Навигация работает
- [ ] Supabase подключен
- [ ] API calls проходят

### Performance

- [ ] Lighthouse Score > 90
- [ ] Первая загрузка < 3 сек
- [ ] Изображения оптимизированы
- [ ] No console warnings

### Mobile

- [ ] Responsive design работает
- [ ] Touch interactions работают
- [ ] Нет horizontal scroll
- [ ] Fonts читаемые

### SEO (если применимо)

- [ ] Title правильный
- [ ] Meta description
- [ ] Open Graph tags
- [ ] Favicon

## 🐛 Known Issues Check

### React Warnings

- [ ] Нет "createRoot" warning в production
- [ ] StrictMode отключен в production
- [ ] Console чистый

### Browser Support

Проверить в:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## 📊 Monitoring

### После деплоя (24 часа)

- [ ] Проверить GitHub Actions history
- [ ] Нет failed deployments
- [ ] Codecov coverage обновлен
- [ ] Нет критичных ошибок в console

### Опционально

- [ ] Настроить error tracking (Sentry)
- [ ] Настроить analytics (Google Analytics)
- [ ] Настроить uptime monitoring
- [ ] Настроить alerts

## 🔄 Rollback Plan

Если что-то пошло не так:

```bash
# 1. Откатить на предыдущий commit
git revert HEAD
git push origin main

# 2. Или force push предыдущей версии
git reset --hard <previous-commit>
git push origin main --force

# 3. Или откатить через GitHub
# Actions → Latest deployment → Re-run previous
```

## 📝 Post-Deployment Notes

**Deployed by:** _____________  
**Date:** _____________  
**Version:** _____________  
**Commit SHA:** _____________  

**Notes:**
- 
- 
- 

**Issues found:**
- 
- 

**Action items:**
- 
- 

---

## 🎯 Quick Commands

```bash
# Pre-deploy full check
npm run ci && npm run build && npm run preview

# Deploy to GitHub Pages
npm run deploy

# Check deployment status
gh run list --workflow=ci.yml

# View logs
gh run view <run-id> --log

# Rollback (осторожно!)
git revert HEAD && git push
```

---

**Sign-off:**

- [ ] Code reviewed
- [ ] Tests passed
- [ ] Deployed successfully
- [ ] Verified in production

**Deployer:** _____________ **Date:** _____________

---

**Next deployment:** [Link to next checklist]

