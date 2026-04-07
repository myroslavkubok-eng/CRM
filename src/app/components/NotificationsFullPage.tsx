import { NotificationsCenter } from './NotificationsCenter';

interface NotificationsFullPageProps {
  userRole?: 'owner' | 'admin' | 'master';
}

export function NotificationsFullPage({ userRole = 'owner' }: NotificationsFullPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications Center</h1>
        <p className="text-gray-500 mt-1">Manage all your notifications in one place</p>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-8">
        <p className="text-center text-gray-700 mb-4">
          🔔 Notifications are accessible from the bell icon in the header for quick access.
        </p>
        <p className="text-sm text-center text-gray-600">
          Click the bell icon <strong>(🔔)</strong> in the top navigation bar to view real-time updates.
        </p>
      </div>

      <div className="relative">
        <div className="flex justify-center">
          <NotificationsCenter userRole={userRole} />
        </div>
      </div>
    </div>
  );
}
