import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, User, Mail, Phone, Briefcase, CalendarPlus, DollarSign, TrendingUp, Percent, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useServices } from '../../contexts/ServicesContext';
import { useMasters } from '../../contexts/MastersContext';
import type { Master, WorkingHours, Vacation, ExtraWorkDay } from '../../contexts/MastersContext';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { toast } from 'sonner';

interface AddMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (master: Master) => void;
  editingMaster?: Master | null;
  salonId?: string;
  invitedBy?: string;
  isDemo?: boolean;
}

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const SERVICE_CATEGORIES = [
  'Manicure', 'Pedicure', 'Eyelashes', 'Brow', 'Barber', 'Hair stylist',
  'Cosmetology', 'Facial', 'Laser', 'Make up', 'Tattoo', 'Piercing',
  'PMU', 'Spa', 'Massage', 'Fitness', 'Waxing', 'Other'
];

export function AddMasterModal({ isOpen, onClose, onSubmit, editingMaster, salonId, invitedBy, isDemo = false }: AddMasterModalProps) {
  const { services } = useServices();
  const { registerMaster } = useMasters();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Categories and Services
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Working Hours
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(
    DAYS_OF_WEEK.map(day => ({
      day: day.value as WorkingHours['day'],
      isWorking: day.value !== 'sunday',
      startTime: '09:00',
      endTime: '18:00'
    }))
  );

  // Vacations
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [newVacationStart, setNewVacationStart] = useState('');
  const [newVacationEnd, setNewVacationEnd] = useState('');
  const [newVacationReason, setNewVacationReason] = useState('');

  // Extra Work Days
  const [extraWorkDays, setExtraWorkDays] = useState<ExtraWorkDay[]>([]);
  const [newExtraDate, setNewExtraDate] = useState('');
  const [newExtraStartTime, setNewExtraStartTime] = useState('09:00');
  const [newExtraEndTime, setNewExtraEndTime] = useState('18:00');

  // Financial fields
  const [baseSalary, setBaseSalary] = useState(3000);
  const [monthlyTarget, setMonthlyTarget] = useState(15000);
  const [bonusType, setBonusType] = useState<'percentage' | 'fixed'>('percentage');
  const [bonusValue, setBonusValue] = useState(10);

  // Load editing master data
  useEffect(() => {
    if (editingMaster) {
      setFirstName(editingMaster.firstName);
      setLastName(editingMaster.lastName);
      setPhone(editingMaster.phone);
      setEmail(editingMaster.email);
      setSelectedCategories(editingMaster.categories);
      setSelectedServices(editingMaster.services);
      setWorkingHours(editingMaster.workingHours);
      setVacations(editingMaster.vacations);
      setExtraWorkDays(editingMaster.extraWorkDays);
      setBaseSalary(editingMaster.baseSalary);
      setMonthlyTarget(editingMaster.monthlyTarget);
      setBonusType(editingMaster.bonusType);
      setBonusValue(editingMaster.bonusValue);
    }
  }, [editingMaster]);

  const resetForm = () => {
    setStep(1);
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setSelectedCategories([]);
    setSelectedServices([]);
    setWorkingHours(
      DAYS_OF_WEEK.map(day => ({
        day: day.value as WorkingHours['day'],
        isWorking: day.value !== 'sunday',
        startTime: '09:00',
        endTime: '18:00'
      }))
    );
    setVacations([]);
    setExtraWorkDays([]);
    setNewVacationStart('');
    setNewVacationEnd('');
    setNewVacationReason('');
    setNewExtraDate('');
    setNewExtraStartTime('09:00');
    setNewExtraEndTime('18:00');
    setBaseSalary(3000);
    setMonthlyTarget(15000);
    setBonusType('percentage');
    setBonusValue(10);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
      // Remove services from this category
      const categoryServiceIds = services
        .filter(s => s.category === category)
        .map(s => s.id);
      setSelectedServices(selectedServices.filter(id => !categoryServiceIds.includes(id)));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleWorkingHourChange = (day: string, field: 'isWorking' | 'startTime' | 'endTime', value: boolean | string) => {
    setWorkingHours(workingHours.map(wh => 
      wh.day === day ? { ...wh, [field]: value } : wh
    ));
  };

  const addVacation = () => {
    if (newVacationStart && newVacationEnd) {
      const vacation: Vacation = {
        id: Date.now().toString(),
        startDate: new Date(newVacationStart),
        endDate: new Date(newVacationEnd),
        reason: newVacationReason
      };
      setVacations([...vacations, vacation]);
      setNewVacationStart('');
      setNewVacationEnd('');
      setNewVacationReason('');
    }
  };

  const removeVacation = (id: string) => {
    setVacations(vacations.filter(v => v.id !== id));
  };

  const addExtraWorkDay = () => {
    if (newExtraDate) {
      const extraDay: ExtraWorkDay = {
        id: Date.now().toString(),
        date: new Date(newExtraDate),
        startTime: newExtraStartTime,
        endTime: newExtraEndTime
      };
      setExtraWorkDays([...extraWorkDays, extraDay]);
      setNewExtraDate('');
      setNewExtraStartTime('09:00');
      setNewExtraEndTime('18:00');
    }
  };

  const removeExtraWorkDay = (id: string) => {
    setExtraWorkDays(extraWorkDays.filter(d => d.id !== id));
  };

  // Generate a random password for the master
  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleSubmit = async () => {
    // If editing existing master, just update locally (editing is handled separately)
    if (editingMaster) {
      const daysOff = workingHours
        .filter(wh => !wh.isWorking)
        .map(wh => wh.day);

      const master: Master = {
        id: editingMaster.id,
        firstName,
        lastName,
        phone,
        email,
        role: 'master',
        categories: selectedCategories,
        services: selectedServices,
        workingHours,
        daysOff,
        vacations,
        extraWorkDays,
        rating: editingMaster.rating || 0,
        completedBookings: editingMaster.completedBookings || 0,
        revenue: editingMaster.revenue || 0,
        baseSalary,
        monthlyTarget,
        currentRevenue: editingMaster.currentRevenue || 0,
        bonusType,
        bonusValue
      };

      onSubmit(master);
      handleClose();
      return;
    }

    // Demo mode: work locally as before
    if (isDemo) {
      const daysOff = workingHours
        .filter(wh => !wh.isWorking)
        .map(wh => wh.day);

      const master: Master = {
        id: Date.now().toString(),
        firstName,
        lastName,
        phone,
        email,
        role: 'master',
        categories: selectedCategories,
        services: selectedServices,
        workingHours,
        daysOff,
        vacations,
        extraWorkDays,
        rating: 0,
        completedBookings: 0,
        revenue: 0,
        baseSalary,
        monthlyTarget,
        currentRevenue: 0,
        bonusType,
        bonusValue
      };

      onSubmit(master);
      handleClose();
      return;
    }

    // Production mode: register new master via API
    if (!salonId || !invitedBy) {
      toast.error('Missing salon ID or inviter information');
      return;
    }

    setIsLoading(true);

    try {
      const daysOff = workingHours
        .filter(wh => !wh.isWorking)
        .map(wh => wh.day);

      // Generate password for the master
      const password = generatePassword();

      // Register master via API using context function
      const result = await registerMaster(
        {
          firstName,
          lastName,
          email,
          phone,
          password,
          categories: selectedCategories,
          services: selectedServices,
          workingHours,
          daysOff,
          vacations,
          extraWorkDays,
          baseSalary,
          monthlyTarget,
          bonusType,
          bonusValue
        },
        salonId!,
        invitedBy!
      );

      if (!result.success) {
        const errorMsg = result.error || 'Failed to register master';
        console.error('Registration failed:', errorMsg);
        toast.error(errorMsg);
        return; // Don't close modal on error
      }

      // Create master object for local state
      const master: Master = {
        id: result.masterId || Date.now().toString(),
        firstName,
        lastName,
        phone,
        email,
        role: 'master',
        categories: selectedCategories,
        services: selectedServices,
        workingHours,
        daysOff,
        vacations,
        extraWorkDays,
        rating: 0,
        completedBookings: 0,
        revenue: 0,
        baseSalary,
        monthlyTarget,
        currentRevenue: 0,
        bonusType,
        bonusValue
      };

      onSubmit(master);
      toast.success(`Master ${firstName} ${lastName} has been registered successfully!`);
      toast.info(`Password: ${password} (send this to the master via secure channel)`);
      handleClose();
    } catch (error: any) {
      console.error('Error registering master:', error);
      const errorMessage = error?.message || 'Failed to register master';
      
      // Provide more specific error messages
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        userFriendlyMessage = 'Network error. Please check your internet connection and try again.';
      } else if (errorMessage.includes('HTTP error')) {
        userFriendlyMessage = 'Server error. Please try again later or contact support.';
      }
      
      toast.error(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = firstName && lastName && phone && email;
  const isStep2Valid = selectedCategories.length > 0 && selectedServices.length > 0;
  const isStep3Valid = true; // Working hours are optional
  const isStep4Valid = baseSalary > 0 && monthlyTarget > 0 && bonusValue > 0;

  if (!isOpen) return null;

  const availableServices = services.filter(service => 
    selectedCategories.includes(service.category)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold mb-2">
            {editingMaster ? 'Edit Master' : 'Add New Master'}
          </h2>
          <p className="text-white/90 text-sm">
            {step === 1 && 'Personal Information'}
            {step === 2 && 'Categories & Services'}
            {step === 3 && 'Working Hours & Schedule'}
            {step === 4 && 'Salary & Monthly Target'}
          </p>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4].map(num => (
              <div
                key={num}
                className={`flex-1 h-1 rounded-full transition-all ${
                  step >= num ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="+48 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="master@salon.com"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> An invitation email will be sent to this address once the master is added.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Categories & Services */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Categories Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Select Categories *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {SERVICE_CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedCategories.includes(category)
                          ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                          : 'border-gray-300 hover:border-purple-300 text-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services Selection */}
              {selectedCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Specific Services * ({selectedServices.length} selected)
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {availableServices.length > 0 ? (
                      availableServices.map(service => (
                        <label
                          key={service.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => handleServiceToggle(service.id)}
                            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500">{service.category} • {service.duration} min</div>
                          </div>
                        </label>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No services available for selected categories
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Working Hours & Schedule */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Working Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Working Hours
                </label>
                <div className="space-y-2">
                  {DAYS_OF_WEEK.map(day => {
                    const workingDay = workingHours.find(wh => wh.day === day.value);
                    return (
                      <div key={day.value} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <label className="flex items-center gap-2 w-32">
                          <input
                            type="checkbox"
                            checked={workingDay?.isWorking || false}
                            onChange={(e) => handleWorkingHourChange(day.value, 'isWorking', e.target.checked)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="font-medium text-gray-700">{day.label}</span>
                        </label>
                        
                        {workingDay?.isWorking && (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="time"
                              value={workingDay.startTime}
                              onChange={(e) => handleWorkingHourChange(day.value, 'startTime', e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={workingDay.endTime}
                              onChange={(e) => handleWorkingHourChange(day.value, 'endTime', e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vacations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Vacation Periods
                </label>
                
                {/* Add Vacation Form */}
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={newVacationStart}
                        onChange={(e) => setNewVacationStart(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={newVacationEnd}
                        onChange={(e) => setNewVacationEnd(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Reason (optional)</label>
                      <input
                        type="text"
                        value={newVacationReason}
                        onChange={(e) => setNewVacationReason(e.target.value)}
                        placeholder="e.g., Annual leave"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={addVacation}
                    disabled={!newVacationStart || !newVacationEnd}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vacation
                  </Button>
                </div>

                {/* Vacation List */}
                {vacations.length > 0 && (
                  <div className="space-y-2">
                    {vacations.map(vacation => (
                      <div key={vacation.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">
                            {new Date(vacation.startDate).toLocaleDateString()} - {new Date(vacation.endDate).toLocaleDateString()}
                          </div>
                          {vacation.reason && (
                            <div className="text-sm text-gray-600">{vacation.reason}</div>
                          )}
                        </div>
                        <Button
                          onClick={() => removeVacation(vacation.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Extra Work Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <CalendarPlus className="w-4 h-4 inline mr-2" />
                  Extra Work Days
                </label>
                
                {/* Add Extra Work Day Form */}
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Date</label>
                      <input
                        type="date"
                        value={newExtraDate}
                        onChange={(e) => setNewExtraDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={newExtraStartTime}
                        onChange={(e) => setNewExtraStartTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Time</label>
                      <input
                        type="time"
                        value={newExtraEndTime}
                        onChange={(e) => setNewExtraEndTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={addExtraWorkDay}
                        disabled={!newExtraDate}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Extra Work Days List */}
                {extraWorkDays.length > 0 && (
                  <div className="space-y-2">
                    {extraWorkDays.map(extraDay => (
                      <div key={extraDay.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">
                            {new Date(extraDay.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {extraDay.startTime} - {extraDay.endTime}
                          </div>
                        </div>
                        <Button
                          onClick={() => removeExtraWorkDay(extraDay.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Salary & Monthly Target */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Financial Settings:</strong> Set base salary, monthly target, and bonus structure. Bonuses are only paid when the monthly target is achieved.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Base Salary (Monthly) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="3000"
                    min="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Fixed amount paid regardless of performance</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Monthly Revenue Target *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={monthlyTarget}
                    onChange={(e) => setMonthlyTarget(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="15000"
                    min="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Revenue goal to unlock bonus payment</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Percent className="w-4 h-4 inline mr-2" />
                  Bonus Structure *
                </label>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="percentage"
                      value="percentage"
                      checked={bonusType === 'percentage'}
                      onChange={() => setBonusType('percentage')}
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <label htmlFor="percentage" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900">Percentage of Revenue</div>
                      <div className="text-xs text-gray-600">Bonus calculated as % of total revenue when target is met</div>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="fixed"
                      value="fixed"
                      checked={bonusType === 'fixed'}
                      onChange={() => setBonusType('fixed')}
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <label htmlFor="fixed" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900">Fixed Amount</div>
                      <div className="text-xs text-gray-600">One-time bonus amount when target is achieved</div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {bonusType === 'percentage' ? (
                    <>
                      <Percent className="w-4 h-4 inline mr-2" />
                      Bonus Percentage *
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Bonus Amount *
                    </>
                  )}
                </label>
                <div className="relative">
                  {bonusType === 'fixed' && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  )}
                  <input
                    type="number"
                    value={bonusValue}
                    onChange={(e) => setBonusValue(Number(e.target.value))}
                    className={`w-full ${bonusType === 'fixed' ? 'pl-8' : 'pl-4'} pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder={bonusType === 'percentage' ? '10' : '500'}
                    min="0"
                  />
                  {bonusType === 'percentage' && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {bonusType === 'percentage' 
                    ? `${bonusValue}% of revenue = $${Math.round(monthlyTarget * bonusValue / 100).toLocaleString()} (when target met)` 
                    : `Fixed bonus of $${bonusValue.toLocaleString()} when target is achieved`}
                </p>
              </div>

              {/* Salary Preview */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-4">
                <div className="text-sm font-medium mb-3">💰 Salary Preview (Target Achieved)</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Base Salary</span>
                    <span className="font-bold">${baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Bonus ({bonusType === 'percentage' ? `${bonusValue}%` : 'Fixed'})</span>
                    <span className="font-bold">
                      +${bonusType === 'percentage' 
                        ? Math.round(monthlyTarget * bonusValue / 100).toLocaleString()
                        : bonusValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-white/30 pt-2 flex items-center justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold">
                      ${(baseSalary + (bonusType === 'percentage' ? Math.round(monthlyTarget * bonusValue / 100) : bonusValue)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  <strong>⚠️ Important:</strong> If the monthly target is NOT met, the master will receive only the base salary without any bonus.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
          <div>
            {step > 1 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !isStep1Valid) ||
                  (step === 2 && !isStep2Valid)
                }
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStep1Valid || !isStep2Valid || !isStep3Valid || !isStep4Valid || isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  editingMaster ? 'Update Master' : 'Add Master & Send Invitation'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}