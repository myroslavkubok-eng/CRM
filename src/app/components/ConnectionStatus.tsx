import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { isOnline, onOnline, onOffline } from '../../utils/pwaUtils';

export function ConnectionStatus() {
  const [online, setOnline] = useState(isOnline());
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [showOnlineAlert, setShowOnlineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setShowOfflineAlert(false);
      setShowOnlineAlert(true);
      
      // Скрываем сообщение о восстановлении через 5 секунд
      setTimeout(() => {
        setShowOnlineAlert(false);
      }, 5000);
    };

    const handleOffline = () => {
      setOnline(false);
      setShowOnlineAlert(false);
      setShowOfflineAlert(true);
    };

    const unsubOnline = onOnline(handleOnline);
    const unsubOffline = onOffline(handleOffline);

    return () => {
      unsubOnline();
      unsubOffline();
    };
  }, []);

  // Постоянный индикатор в шапке (только когда offline)
  if (!online) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white py-2 px-4 text-center text-sm font-medium shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>Нет подключения к интернету • Работаем в offline режиме</span>
        </div>
      </div>
    );
  }

  // Уведомление о восстановлении подключения
  if (showOnlineAlert) {
    return (
      <Alert className="fixed top-4 right-4 z-50 w-auto bg-green-500 text-white border-none shadow-lg animate-in slide-in-from-right-5">
        <Wifi className="h-4 w-4" />
        <AlertDescription>
          Подключение к интернету восстановлено
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
