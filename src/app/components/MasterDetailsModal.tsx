import { X, Star, TrendingUp, DollarSign, Calendar, Clock, Phone, Mail, Briefcase, Award } from 'lucide-react';
import { Button } from './ui/button';
import { useServices } from '../../contexts/ServicesContext';
import type { Master } from '../../contexts/MastersContext';

interface MasterDetailsModalProps {
  master: Master;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  userRole?: 'owner' | 'admin' | 'master';
}

export function MasterDetailsModal({ master, isOpen, onClose, onEdit, userRole = 'owner' }: MasterDetailsModalProps) {
  const { services } = useServices();

  if (!isOpen) return null;

  const getMasterServices = () => {
    return services.filter(service => master.services.includes(service.id));
  };

  const calculateTargetProgress = () => {
    if (master.monthlyTarget === 0) return 0;
    return Math.round((master.currentRevenue / master.monthlyTarget) * 100);
  };

  const calculateBonus = () => {
    const progress = calculateTargetProgress();
    if (progress < 100) return 0;
    
    if (master.bonusType === 'percentage') {
      return (master.currentRevenue * master.bonusValue) / 100;
    } else {
      return master.bonusValue;
    }
  };

  const calculateTotalSalary = () => {
    const bonus = calculateBonus();
    return master.baseSalary + bonus;
  };

  const getTargetStatusColor = (progress: number) => {
    if (progress >= 100) return 'from-purple-600 to-pink-600';
    if (progress >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const masterServices = getMasterServices();
  const targetProgress = calculateTargetProgress();
  const totalSalary = calculateTotalSalary();
  const targetStatusColor = getTargetStatusColor(targetProgress);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-start justify-between rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {master.avatar ? (
                <img src={master.avatar} alt={`${master.firstName} ${master.lastName}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold">{master.firstName[0]}{master.lastName[0]}</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{master.firstName} {master.lastName}</h2>
              <p className="text-purple-100 text-sm">
                {master.role === 'admin' ? '👔 Administrator' : '✨ Master Specialist'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{master.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{master.email}</span>
              </div>
            </div>
          </div>

          {/* Performance Stats - Only for Masters */}
          {master.role === 'master' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-lg text-gray-900">{master.rating?.toFixed(1)}</span>
                </div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{master.completedBookings}</div>
                <div className="text-xs text-gray-600">Bookings</div>
              </div>
              {userRole !== 'admin' && (
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">${master.revenue?.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
              )}
            </div>
          )}

          {/* Categories & Services */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-3">Specializations</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-2">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {master.categories.map((category, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">Services ({masterServices.length})</div>
                <div className="flex flex-wrap gap-2">
                  {masterServices.map(service => (
                    <span key={service.id} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {service.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Working Schedule
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {master.workingHours.map((wh, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-center text-sm ${
                    wh.isWorking 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="font-medium text-gray-900 capitalize">{wh.day.slice(0, 3)}</div>
                  {wh.isWorking ? (
                    <div className="text-xs text-green-700">{wh.startTime} - {wh.endTime}</div>
                  ) : (
                    <div className="text-xs text-gray-500">Off</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Info */}
          <div className="grid md:grid-cols-2 gap-4">
            {master.vacations.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Vacations</span>
                </div>
                <div className="text-sm text-orange-700">
                  {master.vacations.length} planned vacation{master.vacations.length > 1 ? 's' : ''}
                </div>
              </div>
            )}
            {master.extraWorkDays.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Extra Days</span>
                </div>
                <div className="text-sm text-green-700">
                  {master.extraWorkDays.length} extra work day{master.extraWorkDays.length > 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>

          {/* Financial Section - Only for Masters and Owner role */}
          {master.role === 'master' && userRole !== 'admin' && (
            <>
              {/* Monthly Target Progress */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Monthly Target</div>
                    <div className="text-lg font-bold text-gray-900">
                      ${master.currentRevenue.toLocaleString()} / ${master.monthlyTarget.toLocaleString()}
                    </div>
                  </div>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${targetStatusColor} bg-clip-text text-transparent`}>
                    {targetProgress}%
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${targetStatusColor} transition-all duration-500`}
                    style={{ width: `${Math.min(targetProgress, 100)}%` }}
                  />
                </div>

                {targetProgress < 100 ? (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-red-600">
                      ${(master.monthlyTarget - master.currentRevenue).toLocaleString()} remaining
                    </span>
                    {' '}to achieve target
                  </div>
                ) : (
                  <div className="text-sm text-purple-600 font-medium">
                    🎉 Target Achieved! {targetProgress > 100 && `Exceeded by ${targetProgress - 100}%`}
                  </div>
                )}
              </div>

              {/* Salary Breakdown */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  Salary Breakdown
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Base Salary</span>
                    <span className="font-bold text-gray-900 text-lg">${master.baseSalary.toLocaleString()}</span>
                  </div>
                  
                  {targetProgress >= 100 && (
                    <div className="flex items-center justify-between">
                      <span className="text-purple-700">
                        Bonus ({master.bonusType === 'percentage' ? `${master.bonusValue}%` : 'Fixed'})
                      </span>
                      <span className="font-bold text-purple-700 text-lg">
                        +${calculateBonus().toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t border-purple-200 pt-3 flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-lg">Total Salary</span>
                    <span className={`text-2xl font-bold ${targetProgress >= 100 ? 'text-purple-600' : 'text-gray-900'}`}>
                      ${totalSalary.toLocaleString()}
                    </span>
                  </div>
                </div>

                {targetProgress < 100 && (
                  <div className="mt-3 text-xs text-gray-600 bg-white rounded-lg p-3">
                    <span className="font-medium">Potential with Target:</span> ${master.baseSalary.toLocaleString()} + {master.bonusType === 'percentage' ? `${master.bonusValue}%` : `$${master.bonusValue}`} = 
                    <span className="font-bold text-purple-600"> ${(master.baseSalary + (master.bonusType === 'percentage' ? (master.monthlyTarget * master.bonusValue) / 100 : master.bonusValue)).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Monthly Target Progress - Admin View (Target only, no salary) */}
          {master.role === 'master' && userRole === 'admin' && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Monthly Target</div>
                  <div className="text-lg font-bold text-gray-900">
                    ${master.currentRevenue.toLocaleString()} / ${master.monthlyTarget.toLocaleString()}
                  </div>
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${targetStatusColor} bg-clip-text text-transparent`}>
                  {targetProgress}%
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${targetStatusColor} transition-all duration-500`}
                  style={{ width: `${Math.min(targetProgress, 100)}%` }}
                />
              </div>

              {targetProgress < 100 ? (
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-red-600">
                    ${(master.monthlyTarget - master.currentRevenue).toLocaleString()} remaining
                  </span>
                  {' '}to achieve target
                </div>
              ) : (
                <div className="text-sm text-purple-600 font-medium">
                  🎉 Target Achieved! {targetProgress > 100 && `Exceeded by ${targetProgress - 100}%`}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            {userRole !== 'admin' && (
              <Button 
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={onEdit}
              >
                Edit {master.role === 'admin' ? 'Admin' : 'Master'}
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={onClose}
              className={userRole === 'admin' ? 'flex-1' : ''}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}