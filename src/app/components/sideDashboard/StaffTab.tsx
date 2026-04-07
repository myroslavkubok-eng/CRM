import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { UserPlus } from 'lucide-react';
import { InviteStaffModal } from '../InviteStaffModal';
import type { TabProps } from '../../components/sideDashboard/types';
import type { UserRole } from '../../../types/roles';

export function StaffTab({ currentUser, currentSalon, isDemo }: TabProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleInviteStaff = (email: string, firstName: string, lastName: string, role: UserRole, services?: string[]) => {
    console.log('Inviting staff:', { email, firstName, lastName, role, services });
    // TODO: Send email invitation via backend
    alert(`Invitation sent to ${email}!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
          <p className="text-gray-600">Manage your team members and their permissions</p>
        </div>
        <Button
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Staff
        </Button>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-gray-900">Team Members ({currentSalon?.staff?.length || 0})</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentSalon?.staff?.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                  {member.firstName[0]}{member.lastName[0]}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {member.firstName} {member.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{member.email}</div>
                </div>
                <div className="text-sm">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full capitalize font-medium">
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {currentSalon && (
        <InviteStaffModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          salonId={currentSalon.id}
          services={currentSalon.services || []}
          onInvite={handleInviteStaff}
        />
      )}
    </div>
  );
}
