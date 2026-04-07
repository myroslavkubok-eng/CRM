import { useState } from 'react';
import { X, Mail, UserPlus, Check, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { UserRole, Service } from '../../types/roles';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { toast } from 'sonner';

interface InviteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  salonId: string;
  services: Service[];
  onInvite: (email: string, firstName: string, lastName: string, role: UserRole, services?: string[]) => void;
}

export function InviteStaffModal({ isOpen, onClose, salonId, services, onInvite }: InviteStaffModalProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('master');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate invitation link with role and salon info
    const link = `${window.location.origin}/salon-register?invite=${Date.now()}&role=${role}&salon=${salonId}`;
    setInviteLink(link);
    setIsGenerating(true);
    
    // Send invitation
    onInvite(email, firstName, lastName, role, role === 'master' ? selectedServices : undefined);
    
    console.log('Invitation link generated:', link);
    console.log('Send this link via email to:', email);
    
    // Show success message
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setEmail('');
      setFirstName('');
      setLastName('');
      setRole('master');
      setSelectedServices([]);
    }, 2000);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Sent!</h2>
            <p className="text-gray-600">An email invitation has been sent to {email}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Invite Staff Member</h2>
                  <p className="text-sm text-gray-500">Add a new team member to your salon</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    placeholder="John"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  placeholder="john.doe@example.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  An invitation email will be sent to this address
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      role === 'admin'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">Administrator</div>
                    <div className="text-xs text-gray-600">
                      Full access to manage bookings, clients, and services
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('master')}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      role === 'master'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">Master</div>
                    <div className="text-xs text-gray-600">
                      Can view and manage only their own appointments
                    </div>
                  </button>
                </div>
              </div>

              {/* Service Selection for Masters */}
              {role === 'master' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Services this master can perform
                  </label>
                  <Card className="p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {services.map((service) => (
                        <label
                          key={service.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => toggleService(service.id)}
                            className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{service.name}</div>
                            <div className="text-xs text-gray-500">{service.category}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </Card>
                  {role === 'master' && selectedServices.length === 0 && (
                    <p className="text-xs text-amber-600 mt-2">
                      ⚠️ Please select at least one service for this master
                    </p>
                  )}
                </div>
              )}

              {/* Permissions Info */}
              <Card className="bg-blue-50 border-blue-200">
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {role === 'admin' ? 'Administrator' : 'Master'} Permissions
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {role === 'admin' ? (
                      <>
                        <li>✓ View all bookings and calendar</li>
                        <li>✓ Manage bookings and clients</li>
                        <li>✓ Edit services and pricing</li>
                        <li>✓ Access marketing and AI tools</li>
                        <li>✗ Cannot add/remove staff (Owner only)</li>
                        <li>✗ Cannot export data (Owner only)</li>
                      </>
                    ) : (
                      <>
                        <li>✓ View their own bookings only</li>
                        <li>✓ See client names (without phone numbers)</li>
                        <li>✗ Cannot edit or cancel bookings</li>
                        <li>✗ Cannot access client database</li>
                        <li>✗ Cannot change salon settings</li>
                      </>
                    )}
                  </ul>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={role === 'master' && selectedServices.length === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}