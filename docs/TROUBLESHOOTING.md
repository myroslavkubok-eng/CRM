# 🔧 Troubleshooting Guide

Решения для распространенных проблем в Katia Platform.

## 📋 Содержание

- [React Warnings](#react-warnings)
- [Build Issues](#build-issues)
- [Testing Issues](#testing-issues)
- [Deployment Issues](#deployment-issues)

---

## ⚛️ React Warnings

### Warning: createRoot() called twice

**Проблема:**
```
Warning: You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before.
```

**Причина:**
React 18+ в StrictMode монтирует компоненты дважды в development режиме для обнаружения side effects.

**Решение:**

✅ **Уже реализовано** в проекте:

1. **main.tsx** - защита от двойного createRoot:
```typescript
// Глобальное хранение root instance
if (!window.__REACT_ROOT__ || window.__REACT_ROOT_CONTAINER__ !== rootElement) {
  window.__REACT_ROOT__ = createRoot(rootElement);
  window.__REACT_ROOT__.render(appComponent);
}
```

2. **suppressWarnings.ts** - фильтрация известных warnings:
```typescript
import { suppressKnownWarnings } from './utils/suppressWarnings';
suppressKnownWarnings();
```

3. **test/setup.ts** - очистка в тестах:
```typescript
afterEach(() => {
  cleanup();
  if (window.__REACT_ROOT__) {
    window.__REACT_ROOT__ = undefined;
  }
});
```

**Debugging:**

Если warning все еще появляется:

```bash
# 1. Очистить кеш
rm -rf node_modules/.vite
rm -rf dist

# 2. Перезапустить dev server
npm run dev

# 3. Включить debug mode
echo "VITE_DEBUG=true" >> .env.local
```

**Production:**

В production StrictMode отключен, warning не появится:
```typescript
const isDevelopment = import.meta.env.DEV;
const appComponent = isDevelopment ? (
  <StrictMode><App /></StrictMode>
) : (
  <App />
);
```

---

## 🏗️ Build Issues

### Build fails with TypeScript errors

**Проблема:**
```
error TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'
```

**Решение:**

```bash
# 1. Проверить TypeScript конфиг
npx tsc --noEmit

# 2. Очистить и пересобрать
rm -rf dist node_modules
npm install
npm run build

# 3. Обновить типы
npm update @types/react @types/react-dom
```

### Bundle size too large

**Проблема:**
Build bundle > 5MB

**Решение:**

```bash
# Анализ bundle
npm run build -- --mode production
npx vite-bundle-visualizer

# Оптимизация:
# 1. Lazy loading компонентов
const Component = lazy(() => import('./Component'));

# 2. Tree shaking
import { specificFunction } from 'library'; // ✅
import * as library from 'library'; // ❌

# 3. Code splitting
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
      }
    }
  }
}
```

---

## 🧪 Testing Issues

### Tests fail with "createRoot" warning

**Проблема:**
Тесты показывают React createRoot warning

**Решение:**

✅ **Уже реализовано** в `/src/test/setup.ts`:

```typescript
beforeAll(() => {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (args[0]?.includes('createRoot')) {
      return; // Подавить warning
    }
    originalError.call(console, ...args);
  };
});
```

**Дополнительно:**

```bash
# Запустить тесты с подавлением warnings
npm test -- --silent

# Или обновить vitest.config.ts
test: {
  silent: true,
  reporter: 'verbose'
}
```

### Coverage threshold not met

**Проблема:**
```
ERROR: Coverage for lines (75%) does not meet threshold (80%)
```

**Решение:**

```bash
# 1. Посмотреть какие файлы не покрыты
npm run test:coverage

# 2. Открыть HTML отчет
open coverage/index.html

# 3. Написать тесты для uncovered файлов
# Создать src/test/path/to/File.test.tsx

# 4. Временно понизить threshold (не рекомендуется)
# vitest.config.ts
coverage: {
  thresholds: {
    lines: 75, // Было 80
  }
}
```

### Supabase mock not working

**Проблема:**
```
TypeError: Cannot read property 'auth' of undefined
```

**Решение:**

Проверить что mock настроен в `test/setup.ts`:

```typescript
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      // ... все методы
    },
  })),
}));
```

Или создать отдельный mock:

```typescript
// src/test/mocks/supabase.ts
export const mockSupabase = {
  auth: {
    signUp: vi.fn(() => Promise.resolve({ error: null })),
    // ...
  },
};

// В тесте:
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase,
}));
```

---

## 🚀 Deployment Issues

### GitHub Pages 404 error

**Проблема:**
После deploy на GitHub Pages - 404 на всех роутах кроме главной

**Решение:**

1. **Использовать HashRouter** (✅ уже настроено):
```typescript
import { HashRouter } from 'react-router-dom';
<HashRouter><App /></HashRouter>
```

2. **Или добавить 404.html**:
```bash
# public/404.html
cp public/index.html public/404.html
```

3. **Проверить base URL**:
```typescript
// vite.config.ts
base: './', // Для GitHub Pages
// ИЛИ
base: '/repo-name/', // Если в подпапке
```

### Environment variables not working in production

**Проблема:**
```
undefined is not an object (evaluating 'import.meta.env.VITE_SUPABASE_URL')
```

**Решение:**

1. **Проверить префикс VITE_**:
```bash
# ✅ Правильно
VITE_SUPABASE_URL=xxx

# ❌ Неправильно
SUPABASE_URL=xxx
```

2. **Добавить в GitHub Secrets**:
```
Settings → Secrets → Actions → New repository secret
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

3. **Использовать в workflow**:
```yaml
# .github/workflows/ci.yml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

### Build works locally but fails in CI

**Проблема:**
Local build ✅, CI build ❌

**Решение:**

```bash
# 1. Проверить Node версию
# .github/workflows/ci.yml
- uses: actions/setup-node@v4
  with:
    node-version: '20' # Та же что локально

# 2. Проверить lock файл
npm ci # В CI использует package-lock.json
npm install # Локально может использовать cache

# 3. Проверить environment
# Локально может быть .env.local который не в git

# 4. Запустить CI локально
act -j build # Требует Docker

# 5. Проверить disk space
df -h # В CI может не хватать места
```

---

## 🔍 Debug Mode

Включить подробное логирование:

```bash
# .env.local
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

Затем в консоли:

```typescript
if (import.meta.env.VITE_DEBUG) {
  console.log('🐛 Debug info:', data);
}
```

---

## 📞 Получить помощь

Если проблема не решена:

1. **Проверить документацию**:
   - [README.md](/README.md)
   - [CONTRIBUTING.md](/CONTRIBUTING.md)
   - [TESTING.md](/TESTING.md)

2. **Поискать в Issues**:
   - [GitHub Issues](https://github.com/OWNER/katia/issues)

3. **Создать новый Issue**:
   - Используйте [Bug Report Template](/.github/ISSUE_TEMPLATE/bug_report.md)
   - Приложите:
     - Шаги воспроизведения
     - Console logs
     - Версию Node/npm
     - OS и браузер

4. **Discussions**:
   - [GitHub Discussions](https://github.com/OWNER/katia/discussions)

---

## 🔄 Быстрые фиксы

### Полная очистка и перезапуск

```bash
# 1. Очистить все
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm -rf coverage
rm package-lock.json

# 2. Переустановить
npm install

# 3. Запустить
npm run dev

# 4. Тесты
npm test
```

### Сбросить Git состояние

```bash
# ОСТОРОЖНО: Удалит все незакоммиченные изменения
git reset --hard HEAD
git clean -fd

# Обновить с upstream
git pull origin main
```

---

**Последнее обновление:** 2025-12-25

**Если вы нашли решение проблемы - создайте PR чтобы добавить его в этот гайд!** 🙏
