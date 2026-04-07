# 🤝 Contributing to Katia

Спасибо за интерес к проекту! Это руководство поможет вам внести вклад.

## 📋 Требования

- Node.js 20+
- npm 10+
- Git

## 🚀 Начало работы

### 1. Fork и клонирование

```bash
# Fork репозиторий на GitHub, затем клонируйте
git clone https://github.com/YOUR_USERNAME/katia.git
cd katia

# Добавьте upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/katia.git
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка окружения

Создайте `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Запуск dev сервера

```bash
npm run dev
```

## 🔧 Workflow

### 1. Создание feature branch

```bash
# Обновите main
git checkout main
git pull upstream main

# Создайте feature branch
git checkout -b feature/your-feature-name
```

**Naming convention:**
- `feature/` - новые фичи
- `fix/` - исправления багов
- `refactor/` - рефакторинг
- `test/` - добавление тестов
- `docs/` - документация

### 2. Разработка

Придерживайтесь стандартов:

```bash
# Проверка кода перед коммитом
npm run lint
npm run format:check
npm test
```

### 3. Коммиты

Используйте [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add gift certificate validation"
git commit -m "fix: resolve auth redirect issue"
git commit -m "test: add coverage for AuthContext"
git commit -m "docs: update README with new features"
```

**Типы коммитов:**
- `feat:` - новая фича
- `fix:` - исправление бага
- `test:` - добавление тестов
- `refactor:` - рефакторинг кода
- `docs:` - документация
- `style:` - форматирование
- `chore:` - обновление зависимостей

### 4. Тестирование

**Обязательно:**
- Напишите unit тесты для новой логики
- Убедитесь что coverage > 80%
- Проверьте что все тесты проходят

```bash
# Запуск всех тестов
npm test

# Coverage
npm run test:coverage

# Только измененные файлы
npm test -- --changed
```

### 5. Code Review подготовка

```bash
# Финальная проверка
npm run ci

# Если все ✅, push
git push origin feature/your-feature-name
```

### 6. Pull Request

1. Откройте PR на GitHub
2. Заполните template:
   - Описание изменений
   - Скриншоты (если UI)
   - Тесты
   - Breaking changes

## ✅ Checklist перед PR

- [ ] Код отформатирован (`npm run format`)
- [ ] Нет ошибок линтера (`npm run lint`)
- [ ] Все тесты проходят (`npm test`)
- [ ] Coverage >= 80% (`npm run test:coverage`)
- [ ] Новая функциональность покрыта тестами
- [ ] README обновлен (если нужно)
- [ ] Conventional commits используются
- [ ] PR описание заполнено

## 🧪 Требования к тестам

### Unit тесты

Для **каждой новой функции/компонента**:

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test
  });

  it('should handle user interaction', () => {
    // Test
  });

  it('should handle errors', () => {
    // Test
  });
});
```

### Integration тесты

Для **критической логики** (auth, payments, booking):

```typescript
describe('AuthFlow Integration', () => {
  it('should complete full signup flow', () => {
    // Test full flow
  });
});
```

### Coverage требования

```
Lines:      >= 80%
Functions:  >= 80%
Branches:   >= 80%
Statements: >= 80%
```

## 📝 Code Style

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  fullName: string;
}

const getUser = async (id: string): Promise<User> => {
  // ...
};

// ❌ Bad
const getUser = async (id: any) => {
  // ...
};
```

### React Components

```typescript
// ✅ Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {children}
    </button>
  );
}

// ❌ Bad
export function Button(props: any) {
  return <button>{props.text}</button>;
}
```

### Hooks

```typescript
// ✅ Good
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ❌ Bad
const useAuth = () => useContext(AuthContext);
```

## 🐛 Отчеты о багах

Используйте [GitHub Issues](https://github.com/OWNER/katia/issues):

**Template:**

```markdown
## 🐛 Описание бага

Краткое описание проблемы

## 📋 Шаги воспроизведения

1. Перейти на '...'
2. Кликнуть на '...'
3. Увидеть ошибку

## ✅ Ожидаемое поведение

Что должно происходить

## ❌ Актуальное поведение

Что происходит на самом деле

## 🖼️ Скриншоты

Если применимо

## 🌐 Окружение

- OS: [e.g. macOS 13]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 0.0.1]
```

## 💡 Feature Requests

**Template:**

```markdown
## 💡 Описание фичи

Что вы хотите добавить?

## 🎯 Цель

Почему это нужно?

## 📝 Use Case

Как это будет использоваться?

## 🎨 Mockups

Если есть дизайн
```

## 🔄 Review Process

1. **Автоматические проверки**
   - CI pipeline должен пройти ✅
   - Coverage >= 80%
   - Нет конфликтов

2. **Code Review**
   - Минимум 1 approve
   - Все комментарии resolved

3. **Merge**
   - Squash and merge
   - Удаление feature branch

## 📞 Связь

- **Issues**: [GitHub Issues](https://github.com/OWNER/katia/issues)
- **Discussions**: [GitHub Discussions](https://github.com/OWNER/katia/discussions)

## 📜 Лицензия

Внося вклад, вы соглашаетесь что ваш код будет лицензирован под MIT.

---

**Спасибо за вклад в Katia! 💜**
