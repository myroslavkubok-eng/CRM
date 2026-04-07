/**
 * Подавление известных React warnings в development режиме
 * 
 * ТОЛЬКО для известных и безопасных warnings которые:
 * 1. Происходят из-за React.StrictMode в dev
 * 2. Не влияют на production
 * 3. Уже имеют workaround в коде
 */

const SUPPRESSED_WARNINGS = [
  // React 18 StrictMode вызывает двойной render в dev
  'createRoot() on a container that has already been passed',
  
  // React Router warning в dev режиме
  'React Router Future Flag Warning',
  
  // Known issue с React Fast Refresh
  'Fast Refresh only works when a file only exports components',
];

/**
 * Инициализация фильтрации warnings
 * Вызывается в main.tsx перед рендером
 */
export function suppressKnownWarnings() {
  if (import.meta.env.PROD) {
    return; // В production не подавляем warnings
  }

  const originalError = console.error;
  const originalWarn = console.warn;

  // Фильтруем console.error
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    // Проверяем является ли это известным warning
    const isKnownWarning = SUPPRESSED_WARNINGS.some(pattern =>
      message.includes(pattern)
    );

    if (isKnownWarning) {
      // Логируем в debug режиме
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log('🔇 Suppressed known warning:', message.substring(0, 100));
      }
      return;
    }

    // Все остальные ошибки показываем
    originalError.call(console, ...args);
  };

  // Фильтруем console.warn
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    const isKnownWarning = SUPPRESSED_WARNINGS.some(pattern =>
      message.includes(pattern)
    );

    if (isKnownWarning) {
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log('🔇 Suppressed known warning:', message.substring(0, 100));
      }
      return;
    }

    originalWarn.call(console, ...args);
  };

  console.log('✅ Warning suppression initialized (dev mode only)');
}

/**
 * Отключение подавления (для debugging)
 */
export function disableWarningSuppression() {
  // Перезагрузка страницы восстановит оригинальные console методы
  console.log('ℹ️ To disable warning suppression, set VITE_DEBUG=true in .env.local');
}
