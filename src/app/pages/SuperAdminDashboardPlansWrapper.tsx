import { Suspense, lazy } from 'react';
import { Card } from '../components/ui/card';

// Lazy load the main component
const SuperAdminDashboardPlansLazy = lazy(() => 
  import('./SuperAdminDashboardPlans').then(module => ({
    default: module.SuperAdminDashboardPlans
  }))
);

export function SuperAdminDashboardPlans() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-semibold text-gray-700">Loading Subscription Plans...</p>
              <p className="text-sm text-gray-500">Please wait...</p>
            </div>
          </Card>
        </div>
      }
    >
      <SuperAdminDashboardPlansLazy />
    </Suspense>
  );
}
