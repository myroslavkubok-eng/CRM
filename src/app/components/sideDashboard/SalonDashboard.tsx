import { useState } from 'react';
import { SalonDashboardSidebar } from './SalonDashboardSidebar';
import { OverviewTab } from './OverviewTab';
import { StaffTab } from './StaffTab';
import { ProductsTab, BeautyFeedTab } from './OtherTabs';
import { MastersTab } from '../MastersTab';
import type { SalonDashboardProps } from './types';

// Import existing components that haven't been refactored yet
import { DataExportImport } from '../DataExportImport';
import { SalonSettingsTab } from '../SalonSettingsTab';
import { PackageDealsTab } from '../PackageDealsTab';
import { DynamicPricingTab } from '../DynamicPricingTab';
import { ReferralProgramTab } from '../ReferralProgramTab';
import { AISmartFillingTab } from '../AISmartFillingTab';
import { AdvancedForecastingTab } from '../AdvancedForecastingTab';
import { BookingSettingsTab } from '../BookingSettingsTab';
import { GiftCardsTab } from '../GiftCardsTab';
import { MultiSalonManager } from '../MultiSalonManager';
import { FavoritesAnalytics } from '../FavoritesAnalytics';
import { FeedAnalytics } from '../FeedAnalytics';
import type { Client } from '../../../types/roles';

export function SalonDashboard({
  currentUser,
  salons,
  currentSalonId,
  onSalonChange,
  onAddSalon,
  onLogout,
  isDemo = false,
}: SalonDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const currentSalon = salons.find(s => s.id === currentSalonId);

  // Mock data - replace with real data from backend
  const mockClients: Client[] = [];

  const handleImportClients = (data: any[]) => {
    console.log('Importing clients:', data);
    // TODO: Process and save imported clients
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab currentUser={currentUser} currentSalon={currentSalon} isDemo={isDemo} onTabChange={setActiveTab} />;

      case 'staff':
        return <StaffTab currentUser={currentUser} currentSalon={currentSalon} isDemo={isDemo} />;

      case 'masters':
        return <MastersTab currentUser={currentUser} currentSalon={currentSalon} isDemo={isDemo} />;

      case 'products':
        return <ProductsTab currentUser={currentUser} currentSalon={currentSalon} isDemo={isDemo} />;

      case 'beauty-feed':
        return <BeautyFeedTab currentUser={currentUser} currentSalon={currentSalon} isDemo={isDemo} />;

      case 'export':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
              <p className="text-gray-600">Export and import your client database</p>
            </div>
            <DataExportImport
              clients={mockClients}
              salonName={currentSalon?.name || 'Salon'}
              onImport={handleImportClients}
            />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <SalonSettingsTab
              salonId={currentSalon?.id}
              initialIsPublished={currentSalon?.isPublished || false}
            />
          </div>
        );

      case 'package-deals':
        return (
          <div className="space-y-6">
            <PackageDealsTab />
          </div>
        );

      case 'dynamic-pricing':
        return (
          <div className="space-y-6">
            <DynamicPricingTab />
          </div>
        );

      case 'referral-program':
        return (
          <div className="space-y-6">
            <ReferralProgramTab />
          </div>
        );

      case 'ai-smart-filling':
        return (
          <div className="space-y-6">
            <AISmartFillingTab />
          </div>
        );

      case 'advanced-forecasting':
        return (
          <div className="space-y-6">
            <AdvancedForecastingTab />
          </div>
        );

      case 'booking-settings':
        return (
          <div className="space-y-6">
            <BookingSettingsTab />
          </div>
        );

      case 'gift-cards':
        return (
          <div className="space-y-6">
            <GiftCardsTab userRole={currentUser.role} />
          </div>
        );

      case 'my-salons':
        return (
          <div className="space-y-6">
            <MultiSalonManager
              currentSalonId={currentSalonId}
              onSalonSwitch={onSalonChange}
            />
          </div>
        );

      case 'refresh':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🔄</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Refreshed</h2>
              <p className="text-gray-600">Your data has been updated</p>
            </div>
          </div>
        );

      case 'store':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🛍️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Management</h2>
              <p className="text-gray-600">Manage your salon's store inventory</p>
            </div>
          </div>
        );

      case 'analytics':
      case 'advanced-analytics':
        return (
          <div className="space-y-6">
            <FavoritesAnalytics
              salonId={currentSalon?.id}
              salonName={currentSalon?.name}
            />
          </div>
        );

      case 'feed-analytics':
        return (
          <div className="space-y-6">
            <FeedAnalytics
              salonId={currentSalon?.id}
              salonName={currentSalon?.name}
            />
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
              <p className="text-gray-600">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SalonDashboardSidebar
        currentUser={currentUser}
        salons={salons}
        currentSalonId={currentSalonId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSalonChange={onSalonChange}
        onAddSalon={onAddSalon}
        onLogout={onLogout}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Demo Banner */}
        {isDemo && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 text-center">
            <p className="font-medium">
              🎨 Demo Mode - This is a preview of the {currentUser.role === 'owner' ? 'Owner' : currentUser.role === 'admin' ? 'Admin' : 'Master'} Dashboard with sample data
            </p>
          </div>
        )}
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
