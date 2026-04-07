import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { promptInstall, canInstall, getPlatform, isStandalone } from '../../utils/pwaUtils';

export function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Проверяем, не установлено ли уже приложение
    if (isStandalone()) {
      return;
    }

    // Проверяем, не был ли баннер закрыт ранее
    const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (bannerDismissed) {
      const dismissedTime = parseInt(bannerDismissed);
      const daysSinceDismiss = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Показываем снова через 7 дней
      if (daysSinceDismiss < 7) {
        return;
      }
    }

    setPlatform(getPlatform());

    // Слушаем событие доступности установки
    const handleInstallAvailable = () => {
      if (canInstall()) {
        setShowBanner(true);
      }
    };

    const handleInstallCompleted = () => {
      setShowBanner(false);
      localStorage.removeItem('pwa-banner-dismissed');
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-completed', handleInstallCompleted);

    // Для iOS показываем баннер сразу (так как beforeinstallprompt не работает)
    if (platform === 'ios' && !isStandalone()) {
      setTimeout(() => setShowBanner(true), 3000);
    }

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-completed', handleInstallCompleted);
    };
  }, [platform]);

  const handleInstall = async () => {
    if (platform === 'ios') {
      // Для iOS показываем инструкции
      return;
    }

    const installed = await promptInstall();
    if (installed) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  if (!showBanner) {
    return null;
  }

  // Инструкции для iOS
  if (platform === 'ios') {
    return (
      <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none shadow-2xl">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Установить Katia</h3>
                <p className="text-sm opacity-90">Быстрый доступ к платформе</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 text-sm bg-white/10 rounded-lg p-3 backdrop-blur">
            <p className="font-medium">Для установки на iPhone/iPad:</p>
            <ol className="space-y-1 list-decimal list-inside opacity-90">
              <li>Нажмите кнопку "Поделиться" <span className="inline-block">⬆️</span></li>
              <li>Выберите "На экран Домой"</li>
              <li>Нажмите "Добавить"</li>
            </ol>
          </div>
        </div>
      </Card>
    );
  }

  // Баннер для Android/Desktop
  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none shadow-2xl animate-in slide-in-from-bottom-5">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Установить приложение</h3>
              <p className="text-sm opacity-90">Работает быстрее и offline</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            <span>⚡ Мгновенная загрузка</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            <span>📱 Работает offline</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            <span>🔔 Push-уведомления</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleInstall}
            className="flex-1 bg-white text-purple-600 hover:bg-gray-100 font-semibold"
          >
            Установить
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            Позже
          </Button>
        </div>
      </div>
    </Card>
  );
}
