// src/components/owner/InviteStaffModal.tsx
import React, { useState } from 'react';
import { useOwnerInvitations } from '@/hooks/useOwnerInvitations';

interface InviteStaffModalProps {
  salonId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

type StaffRole = 'master' | 'admin';

export const InviteStaffModal: React.FC<InviteStaffModalProps> = ({
  salonId,
  onClose,
  onSuccess
}) => {
  const { inviteMaster, inviteAdmin, loading, error } = useOwnerInvitations();
  
  const [role, setRole] = useState<StaffRole>('master');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialization: '',
    // Для админа
    can_manage_bookings: true,
    can_manage_customers: true,
    can_view_analytics: false,
    can_manage_services: false,
    can_manage_schedule: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (role === 'master') {
        await inviteMaster({
          salon_id: salonId,
          first_name: formData.first_name,
          last_name: formData.last_name || undefined,
          email: formData.email,
          phone: formData.phone || undefined,
          specialization: formData.specialization || undefined,
        });
      } else {
        await inviteAdmin({
          salon_id: salonId,
          first_name: formData.first_name,
          last_name: formData.last_name || undefined,
          email: formData.email,
          phone: formData.phone || undefined,
          permissions: {
            can_manage_bookings: formData.can_manage_bookings,
            can_manage_customers: formData.can_manage_customers,
            can_view_analytics: formData.can_view_analytics,
            can_manage_services: formData.can_manage_services,
            can_manage_schedule: formData.can_manage_schedule,
          }
        });
      }

      // Success
      alert(`${role === 'master' ? 'Master' : 'Admin'} invitation sent to ${formData.email}`);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Invitation error:', err);
      // Error is already set in the hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Invite Staff Member</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole('master')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                  role === 'master'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Master</div>
                <div className="text-xs mt-1">Service provider</div>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                  role === 'admin'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Admin</div>
                <div className="text-xs mt-1">Manager access</div>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Master-specific fields */}
          {role === 'master' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g., Hairstylist, Nail Technician"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Admin-specific fields */}
          {role === 'admin' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permissions
              </label>
              <div className="space-y-2">
                {[
                  { key: 'can_manage_bookings', label: 'Manage Bookings' },
                  { key: 'can_manage_customers', label: 'Manage Customers' },
                  { key: 'can_view_analytics', label: 'View Analytics' },
                  { key: 'can_manage_services', label: 'Manage Services' },
                  { key: 'can_manage_schedule', label: 'Manage Schedule' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData[key as keyof typeof formData] as boolean}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : `Invite ${role === 'master' ? 'Master' : 'Admin'}`}
            </button>
          </div>
        </form>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> An invitation email will be sent to {formData.email || 'the email address'}. 
            The invitation is valid for 7 days.
          </p>
        </div>
      </div>
    </div>
  );
};
