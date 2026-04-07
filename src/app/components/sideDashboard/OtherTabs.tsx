import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Target, Package, Camera, Bell } from 'lucide-react';
import type { TabProps } from '../../components/sideDashboard/types';
import { PERMISSIONS } from '../../../types/roles';

// Masters Tab
export function MastersTab({ currentUser, currentSalon }: TabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Masters & Targets</h1>
        <p className="text-gray-600">View masters performance and targets (salaries are hidden)</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-bold text-gray-900">Masters Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Masters & Targets</p>
            <p className="text-sm mt-2">View master targets and performance</p>
            <p className="text-xs mt-4 text-purple-600">⚠️ Salary information is not available for admins</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Products Tab
export function ProductsTab({ currentUser, currentSalon }: TabProps) {
  const permissions = PERMISSIONS[currentUser.role];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
        <p className="text-gray-600">Manage salon products</p>
        {permissions.requiresOwnerApproval && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              ⚠️ Your changes require owner approval before taking effect
            </p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-bold text-gray-900">Product Catalog</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Products Management</p>
            <p className="text-sm mt-2">Add and manage salon products</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Beauty Feed Tab
export function BeautyFeedTab({ currentUser, currentSalon }: TabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Beauty Feed</h1>
        <p className="text-gray-600">Manage salon's public feed and gallery</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Feed Posts</h3>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700">
              <Camera className="w-4 h-4 inline mr-2" />
              Create Post
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Beauty Feed</p>
            <p className="text-sm mt-2">Share your best work with clients</p>
            <p className="text-xs mt-4 text-green-600">✅ Full access to create and manage feed posts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
