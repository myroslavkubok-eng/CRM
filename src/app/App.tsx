import { TestDemo } from './pages/TestDemo';
import { UpgradeDemo } from './pages/UpgradeDemo';
import { QuickRetailDemo } from './pages/QuickRetailDemo';
import ImageStorageDemo from './pages/ImageStorageDemo';
import StorageAdmin from './storage-admin';
import './utils/storageDebug'; // Загружаем debug команды в window
import 'slick-carousel/slick/slick.css';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

// Context Providers
import { AuthProvider } from '../contexts/AuthContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { ServicesProvider } from '../contexts/ServicesContext';
import { MastersProvider } from '../contexts/MastersContext';
import { BookingsProvider } from '../contexts/BookingsContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';

// Pages
import { HomePage } from './pages/HomePage';
import { PricingPage } from './pages/PricingPage';
import { BecomePartnerPage } from './pages/BecomePartnerPage';
import { AuthPage } from "./pages/AuthPage";
import { ContactPage } from './pages/ContactPage';
import { SalonListingPage } from './pages/SalonListingPage';
import { DashboardSelector } from './pages/DashboardSelector';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ClientDashboard } from './pages/ClientDashboard';
import { MasterDashboard } from './pages/MasterDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { SuperAdminLeadsPage } from './pages/SuperAdminLeadsPage';
import { SalonProfilePage } from './pages/SalonProfilePage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { FeedPage } from './pages/FeedPage';
import { RoleBasedRedirect } from './pages/RoleBasedRedirect';
import { BlockedSalonDemo } from './pages/BlockedSalonDemo';

// Components
import { ConnectionStatus } from './components/ConnectionStatus';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { MobileBottomNav } from './components/MobileBottomNav';

// PWA Utils
import { registerServiceWorker, initInstallPrompt } from '../utils/pwaUtils';

export default function App() {
  useEffect(() => {
    // Инициализация PWA
    const initPWA = async () => {
      try {
        const registration = await registerServiceWorker();
        
        if (registration) {
          console.log('✅ Katia PWA активирована');
          console.log('   • Offline режим: включен');
          console.log('   • Кеширование: активно');
          console.log('   • Быстрая загрузка: готово');
        }
        
        initInstallPrompt();
      } catch (error) {
        // Тихо игнорируем - PWA опциональны
      }
    };

    initPWA();

    // Логирование режима работы
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('📱 Katia запущена как установленное приложение');
    } else {
      console.log('🌐 Katia запущена в браузере');
    }
    
    // Storage Admin Quick Access
    console.log('\n📦 Supabase Storage System:');
    console.log('   • Admin Panel: ' + window.location.origin + '/#/storage-admin');
    console.log('   • Demo Page: ' + window.location.origin + '/#/image-storage-demo');
    console.log('   • Status: Ready for bucket initialization');
    console.log('   • Image Seeder: 30 demo images ready to upload\n');
    
    // Feed System
    console.log('📱 Beauty Feed System:');
    console.log('   • Feed Page: ' + window.location.origin + '/#/feed');
    console.log('   • Features: Posts, Last-Minute Deals, Like System');
    console.log('   • Demo Posts: Available (click "Load Demo Posts" button)\\n');
  }, []);

  return (
    <HashRouter>
      <AuthProvider>
        <CurrencyProvider>
          <ServicesProvider>
            <MastersProvider>
              <BookingsProvider>
                <NotificationsProvider>
                  <div className="min-h-screen bg-gray-50">
                    <Toaster position="top-right" richColors />
                    <ConnectionStatus />
                    <PWAInstallBanner />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/register" element={<Navigate to="/auth" />} />
                      <Route path="/partner" element={<BecomePartnerPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/support" element={<ContactPage />} />
                      <Route path="/salons" element={<SalonListingPage />} />
                      <Route path="/feed" element={<FeedPage />} />
                      <Route path="/dashboard" element={<DashboardSelector />} />
                      <Route path="/owner" element={<OwnerDashboard />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/client" element={<ClientDashboard />} />
                      <Route path="/master" element={<MasterDashboard />} />
                      <Route path="/superadmin" element={<SuperAdminDashboard />} />
                      <Route path="/superadmin/leads" element={<SuperAdminLeadsPage />} />
                      <Route path="/salon/:salonId" element={<SalonProfilePage />} />
                      <Route path="/salon/:salonId/book" element={<BookingFlowPage />} />
                      <Route path="/booking/:salonId/:serviceId" element={<BookingFlowPage />} />
                      <Route path="/redirect" element={<RoleBasedRedirect />} />
                      <Route path="/test" element={<TestDemo />} />
                      <Route path="/upgrade" element={<UpgradeDemo />} />
                      <Route path="/quick-retail" element={<QuickRetailDemo />} />
                      <Route path="/blocked-demo" element={<BlockedSalonDemo />} />
                      <Route path="/image-storage-demo" element={<ImageStorageDemo />} />
                      <Route path="/storage-admin" element={<StorageAdmin />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    <MobileBottomNav />
                  </div>
                </NotificationsProvider>
              </BookingsProvider>
            </MastersProvider>
          </ServicesProvider>
        </CurrencyProvider>
      </AuthProvider>
    </HashRouter>
  );
}