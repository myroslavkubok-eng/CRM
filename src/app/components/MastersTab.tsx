import { useState, useEffect } from 'react';
import { Star, Users, Award, Plus, Shield, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useMasters } from '../../contexts/MastersContext';
import { useServices } from '../../contexts/ServicesContext';
import { AddMasterModal } from './AddMasterModal';
import { AddAdminModal } from './AddAdminModal';
import { MasterDetailsModal } from './MasterDetailsModal';
import type { Master } from '../../contexts/MastersContext';
import type { User, Salon } from '../../types/roles';

interface MastersTabProps {
  userRole?: 'owner' | 'admin' | 'master';
  currentUser?: User;
  currentSalon?: Salon;
  isDemo?: boolean;
}

export function MastersTab({ userRole = 'owner', currentUser, currentSalon, isDemo = false }: MastersTabProps) {
  const { masters, addMaster, updateMaster, loadMasters, isLoading } = useMasters();

  // Load masters from database when salon is available
  useEffect(() => {
    if (currentSalon?.id && !isDemo) {
      loadMasters(currentSalon.id);
    }
  }, [currentSalon?.id, isDemo, loadMasters]);
  const { services } = useServices();
  const [isAddMasterModalOpen, setIsAddMasterModalOpen] = useState(false);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingMaster, setEditingMaster] = useState<Master | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Master | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);

  const handleAddMaster = async (master: Master) => {
    addMaster(master);
    // Reload masters from database if not in demo mode
    if (currentSalon?.id && !isDemo) {
      await loadMasters(currentSalon.id);
    }
  };

  const handleUpdateMaster = (master: Master) => {
    updateMaster(master);
    setEditingMaster(null);
    setEditingAdmin(null);
  };

  const handleCardClick = (master: Master) => {
    setSelectedMaster(master);
    setIsDetailsModalOpen(true);
  };

  const handleEditFromDetails = () => {
    // Admin can't edit
    if (userRole === 'admin') return;
    
    if (selectedMaster) {
      if (selectedMaster.role === 'admin') {
        setEditingAdmin(selectedMaster);
        setIsAddAdminModalOpen(true);
      } else {
        setEditingMaster(selectedMaster);
        setIsAddMasterModalOpen(true);
      }
      setIsDetailsModalOpen(false);
    }
  };

  const calculateTargetProgress = (master: Master) => {
    if (master.monthlyTarget === 0) return 0;
    return Math.round((master.currentRevenue / master.monthlyTarget) * 100);
  };

  const getTargetStatusColor = (progress: number) => {
    if (progress >= 100) return 'from-purple-600 to-pink-600';
    if (progress >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const mastersList = masters.filter(m => m.role === 'master');
  const adminsList = masters.filter(m => m.role === 'admin');

  return (
    <div className="space-y-8">
      {/* Masters Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-600" />
              Masters
            </h2>
            <p className="text-sm text-gray-500">Service specialists with client bookings</p>
          </div>
          {userRole !== 'admin' && (
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
              onClick={() => {
                setEditingMaster(null);
                setIsAddMasterModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Master
            </Button>
          )}
        </div>

        {/* Masters Grid - Compact Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mastersList.map(master => {
            const targetProgress = calculateTargetProgress(master);
            const targetStatusColor = getTargetStatusColor(targetProgress);
            
            return (
              <Card 
                key={master.id} 
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleCardClick(master)}
              >
                <CardContent className="p-4">
                  {/* Avatar & Name */}
                  <div className="flex flex-col items-center text-center mb-3">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-3 overflow-hidden group-hover:scale-110 transition-transform">
                      {master.avatar ? (
                        <img src={master.avatar} alt={`${master.firstName} ${master.lastName}`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-purple-600">
                          {master.firstName[0]}{master.lastName[0]}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{master.firstName} {master.lastName}</h3>
                    <p className="text-xs text-gray-500">{master.categories[0]}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-900">{master.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Bookings</span>
                      <span className="font-bold text-gray-900">{master.completedBookings}</span>
                    </div>
                  </div>

                  {/* Target Progress - Compact */}
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Target</span>
                      <span className={`text-sm font-bold bg-gradient-to-r ${targetStatusColor} bg-clip-text text-transparent`}>
                        {targetProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${targetStatusColor} transition-all duration-500`}
                        style={{ width: `${Math.min(targetProgress, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {mastersList.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No masters added yet</p>
            <Button 
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setIsAddMasterModalOpen(true)}
            >
              Add First Master
            </Button>
          </div>
        )}
      </div>

      {/* Admins Section */}
      <div className="pt-6 border-t-2 border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-7 h-7 text-blue-600" />
              Administrators
            </h2>
            <p className="text-sm text-gray-500">Staff with booking and client management access</p>
          </div>
          {userRole !== 'admin' && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              onClick={() => {
                setEditingAdmin(null);
                setIsAddAdminModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Admin
            </Button>
          )}
        </div>

        {/* Admins Grid - Compact Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {adminsList.map(admin => (
            <Card 
              key={admin.id} 
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleCardClick(admin)}
            >
              <CardContent className="p-4">
                {/* Avatar & Name */}
                <div className="flex flex-col items-center text-center mb-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-3 overflow-hidden group-hover:scale-110 transition-transform">
                    {admin.avatar ? (
                      <img src={admin.avatar} alt={`${admin.firstName} ${admin.lastName}`} className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-10 h-10 text-blue-600" />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{admin.firstName} {admin.lastName}</h3>
                  <p className="text-xs text-blue-600 font-medium">Administrator</p>
                </div>

                {/* Contact Info */}
                <div className="bg-blue-50 rounded-lg p-2 space-y-1">
                  <div className="text-xs text-gray-600 truncate">{admin.email}</div>
                  <div className="text-xs text-gray-600">{admin.phone}</div>
                </div>

                {/* Working Days */}
                <div className="mt-3 text-center">
                  <div className="text-xs text-gray-500">
                    {admin.workingHours.filter(wh => wh.isWorking).length} working days
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {adminsList.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No administrators added yet</p>
            {userRole !== 'admin' && (
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsAddAdminModalOpen(true)}
              >
                Add First Admin
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddMasterModal
        isOpen={isAddMasterModalOpen}
        onClose={() => {
          setIsAddMasterModalOpen(false);
          setEditingMaster(null);
        }}
        onSubmit={handleAddMaster}
        editingMaster={editingMaster}
        salonId={currentSalon?.id}
        invitedBy={currentUser?.id}
        isDemo={isDemo}
      />

      <AddAdminModal
        isOpen={isAddAdminModalOpen}
        onClose={() => {
          setIsAddAdminModalOpen(false);
          setEditingAdmin(null);
        }}
        onSubmit={handleUpdateMaster}
        editingAdmin={editingAdmin}
      />

      {selectedMaster && (
        <MasterDetailsModal
          master={selectedMaster}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedMaster(null);
          }}
          onEdit={handleEditFromDetails}
          userRole={userRole}
        />
      )}
    </div>
  );
}