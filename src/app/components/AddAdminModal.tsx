import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Clock, Shield } from 'lucide-react';
import { Button } from './ui/button';
import type { Master, WorkingHours } from '../../contexts/MastersContext';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (admin: Master) => void;
  editingAdmin?: Master | null;
}

const defaultWorkingHours: WorkingHours[] = [
  { day: 'monday', isWorking: true, startTime: '09:00', endTime: '18:00' },
  { day: 'tuesday', isWorking: true, startTime: '09:00', endTime: '18:00' },
  { day: 'wednesday', isWorking: true, startTime: '09:00', endTime: '18:00' },
  { day: 'thursday', isWorking: true, startTime: '09:00', endTime: '18:00' },
  { day: 'friday', isWorking: true, startTime: '09:00', endTime: '18:00' },
  { day: 'saturday', isWorking: false, startTime: '00:00', endTime: '00:00' },
  { day: 'sunday', isWorking: false, startTime: '00:00', endTime: '00:00' },
];

export function AddAdminModal({ isOpen, onClose, onSubmit, editingAdmin }: AddAdminModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(defaultWorkingHours);
  const [sendInvite, setSendInvite] = useState(true);

  useEffect(() => {
    if (editingAdmin) {
      setFirstName(editingAdmin.firstName);
      setLastName(editingAdmin.lastName);
      setPhone(editingAdmin.phone);
      setEmail(editingAdmin.email);
      setWorkingHours(editingAdmin.workingHours);
    } else {
      // Reset form
      setFirstName('');
      setLastName('');
      setPhone('');
      setEmail('');
      setWorkingHours(defaultWorkingHours);
      setSendInvite(true);
    }
  }, [editingAdmin, isOpen]);

  const handleClose = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setWorkingHours(defaultWorkingHours);
    setSendInvite(true);
    onClose();
  };

  const handleSubmit = () => {
    if (!firstName || !lastName || !phone || !email) return;

    const daysOff = workingHours
      .filter(wh => !wh.isWorking)
      .map(wh => wh.day);

    const admin: Master = {
      id: editingAdmin?.id || Date.now().toString(),
      firstName,
      lastName,
      phone,
      email,
      role: 'admin',
      categories: [],
      services: [],
      workingHours,
      daysOff,
      vacations: editingAdmin?.vacations || [],
      extraWorkDays: editingAdmin?.extraWorkDays || [],
      rating: 0,
      completedBookings: 0,
      revenue: 0,
      baseSalary: 0,
      monthlyTarget: 0,
      currentRevenue: 0,
      bonusType: 'fixed',
      bonusValue: 0
    };

    onSubmit(admin);
    handleClose();
  };

  const updateWorkingHours = (index: number, field: keyof WorkingHours, value: any) => {
    const updated = [...workingHours];
    updated[index] = { ...updated[index], [field]: value };
    setWorkingHours(updated);
  };

  if (!isOpen) return null;

  const isValid = firstName && lastName && phone && email;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Shield className="w-7 h-7" />
                {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
              </h2>
              <p className="text-white/90 text-sm">
                Administrator with full access to bookings and client database
              </p>
            </div>
            <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+48 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@salon.com"
                />
              </div>
            </div>

            {/* Send Invitation */}
            {!editingAdmin && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendInvite}
                    onChange={(e) => setSendInvite(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-blue-900">Send Email Invitation</div>
                    <div className="text-sm text-blue-700">
                      The admin will receive an email with login credentials and access instructions
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Working Schedule
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {workingHours.map((wh, index) => (
                <div key={wh.day} className="flex items-center gap-4">
                  <label className="flex items-center gap-2 w-32">
                    <input
                      type="checkbox"
                      checked={wh.isWorking}
                      onChange={(e) => updateWorkingHours(index, 'isWorking', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">{wh.day}</span>
                  </label>

                  {wh.isWorking && (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={wh.startTime}
                        onChange={(e) => updateWorkingHours(index, 'startTime', e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={wh.endTime}
                        onChange={(e) => updateWorkingHours(index, 'endTime', e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {!wh.isWorking && (
                    <span className="text-sm text-gray-500">Day off</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Admin Permissions Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="font-medium text-blue-900 mb-2">👔 Admin Permissions</div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ View and manage all bookings in the calendar</li>
              <li>✓ Access complete client database with phone numbers</li>
              <li>✓ Cannot view financial data or salary information</li>
              <li>✓ Cannot add/remove masters or other admins</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              {editingAdmin ? 'Update Admin' : 'Add Admin'}
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
