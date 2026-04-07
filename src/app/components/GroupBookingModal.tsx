import { useState } from 'react';
import { Users, Plus, Trash2, Calendar, Clock, DollarSign, Sparkles, Check, X, Gift, Crown, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface GroupMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: {
    id: string;
    name: string;
    price: number;
    duration: number;
    masterId: string;
    masterName: string;
  }[];
  totalPrice: number;
  isPayer: boolean;
}

interface GroupBookingPackage {
  id: string;
  name: string;
  description: string;
  icon: string;
  minPeople: number;
  maxPeople: number;
  discount: number;
  includedServices: string[];
  pricePerPerson: number;
}

const mockPackages: GroupBookingPackage[] = [
  {
    id: 'bridal',
    name: 'Bridal Party Package',
    description: 'Perfect for bride & bridesmaids',
    icon: '👰',
    minPeople: 4,
    maxPeople: 10,
    discount: 20,
    includedServices: ['Hair Styling', 'Makeup', 'Manicure', 'Champagne'],
    pricePerPerson: 299,
  },
  {
    id: 'girls-day',
    name: 'Girls Day Out',
    description: 'Spa day with your besties',
    icon: '💅',
    minPeople: 3,
    maxPeople: 8,
    discount: 15,
    includedServices: ['Manicure', 'Pedicure', 'Massage 30min', 'Refreshments'],
    pricePerPerson: 199,
  },
  {
    id: 'birthday',
    name: 'Birthday Celebration',
    description: 'Make it special!',
    icon: '🎂',
    minPeople: 5,
    maxPeople: 12,
    discount: 15,
    includedServices: ['Any 2 Services', 'Cake', 'Decorations', 'Photos'],
    pricePerPerson: 249,
  },
  {
    id: 'corporate',
    name: 'Corporate Event',
    description: 'Team building & pampering',
    icon: '💼',
    minPeople: 8,
    maxPeople: 20,
    discount: 25,
    includedServices: ['Express Services', 'Catering', 'Private Area'],
    pricePerPerson: 149,
  },
];

interface GroupBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  salonName: string;
}

export function GroupBookingModal({ isOpen, onClose, salonName }: GroupBookingModalProps) {
  const [step, setStep] = useState<'package' | 'details' | 'members' | 'payment'>(  'package');
  const [selectedPackage, setSelectedPackage] = useState<GroupBookingPackage | null>(null);
  const [groupName, setGroupName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('10:00');
  const [eventType, setEventType] = useState<'wedding' | 'birthday' | 'corporate' | 'other'>('wedding');
  const [members, setMembers] = useState<GroupMember[]>([
    {
      id: '1',
      name: '',
      email: '',
      phone: '',
      services: [],
      totalPrice: 0,
      isPayer: true,
    },
  ]);
  const [splitPayment, setSplitPayment] = useState(false);
  const { formatPrice } = useCurrency();

  const addMember = () => {
    setMembers([
      ...members,
      {
        id: Date.now().toString(),
        name: '',
        email: '',
        phone: '',
        services: [],
        totalPrice: 0,
        isPayer: false,
      },
    ]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const updateMember = (id: string, field: keyof GroupMember, value: any) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const setPayer = (id: string) => {
    setMembers(members.map(m => ({ ...m, isPayer: m.id === id })));
  };

  const totalMembers = members.length;
  const totalPrice = selectedPackage 
    ? selectedPackage.pricePerPerson * totalMembers 
    : members.reduce((sum, m) => sum + m.totalPrice, 0);
  
  const totalDiscount = selectedPackage 
    ? (selectedPackage.pricePerPerson * totalMembers * selectedPackage.discount) / 100
    : 0;
  
  const finalPrice = totalPrice - totalDiscount;
  const pricePerPerson = totalMembers > 0 ? finalPrice / totalMembers : 0;

  const handleBooking = () => {
    if (!groupName || !eventDate || totalMembers < 2) {
      toast.error('Please complete all required fields');
      return;
    }

    toast.success('Group booking created!', {
      description: `${totalMembers} people on ${new Date(eventDate).toLocaleDateString()}`,
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xl">Group Booking</h3>
              <p className="text-sm text-white/90">{salonName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { key: 'package', label: 'Choose Package', icon: Gift },
              { key: 'details', label: 'Event Details', icon: Calendar },
              { key: 'members', label: 'Add Members', icon: Users },
              { key: 'payment', label: 'Payment', icon: DollarSign },
            ].map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.key;
              const isCompleted = 
                (s.key === 'package' && selectedPackage) ||
                (s.key === 'details' && groupName && eventDate) ||
                (s.key === 'members' && members.length >= 2);
              
              return (
                <div key={s.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted ? 'bg-green-500 border-green-500' :
                      isActive ? 'bg-purple-600 border-purple-600' :
                      'bg-white border-gray-300'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      isActive ? 'text-purple-600' : 'text-gray-600'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Choose Package */}
          {step === 'package' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Package</h3>
                <p className="text-gray-600">Special deals for group bookings</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockPackages.map(pkg => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`text-left p-6 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{pkg.icon}</div>
                        {isSelected && (
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      <h4 className="font-bold text-xl text-gray-900 mb-1">{pkg.name}</h4>
                      <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>{pkg.minPeople}-{pkg.maxPeople} people</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span>{pkg.discount}% group discount</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Included:</div>
                        <div className="flex flex-wrap gap-1">
                          {pkg.includedServices.map(service => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Per person</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {formatPrice(pkg.pricePerPerson)}
                          </div>
                          <div className="text-xs text-green-600">Save {pkg.discount}%</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Package Option */}
              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setSelectedPackage(null);
                    setStep('details');
                  }}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  or create a custom group booking →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Event Details */}
          {step === 'details' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Event Details</h3>
                <p className="text-gray-600">Tell us about your special occasion</p>
              </div>

              {selectedPackage && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{selectedPackage.icon}</div>
                    <div>
                      <div className="font-bold text-gray-900">{selectedPackage.name}</div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(selectedPackage.pricePerPerson)}/person • {selectedPackage.discount}% discount
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group/Event Name *
                </label>
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Sarah's Bridal Party"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'wedding', label: 'Wedding', icon: '💍' },
                    { value: 'birthday', label: 'Birthday', icon: '🎂' },
                    { value: 'corporate', label: 'Corporate', icon: '💼' },
                    { value: 'other', label: 'Other', icon: '🎉' },
                  ].map(type => (
                    <button
                      key={type.value}
                      onClick={() => setEventType(type.value as any)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        eventType === type.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <Input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <Input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Add Members */}
          {step === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Group Members</h3>
                  <p className="text-gray-600">Add everyone in your party</p>
                </div>
                <Button
                  onClick={addMember}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>

              {selectedPackage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-blue-900 mb-1">
                        Package: {selectedPackage.name}
                      </div>
                      <div className="text-sm text-blue-700">
                        All members will receive: {selectedPackage.includedServices.join(', ')}
                      </div>
                      <div className="text-sm text-blue-700 mt-1">
                        Minimum {selectedPackage.minPeople} people required for this package
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {members.map((member, index) => (
                  <div
                    key={member.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      member.isPayer 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          member.isPayer 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Member {index + 1}
                            {member.isPayer && (
                              <Badge className="ml-2 bg-purple-600">
                                <Crown className="w-3 h-3 mr-1" />
                                Organizer
                              </Badge>
                            )}
                          </div>
                          {selectedPackage && (
                            <div className="text-xs text-gray-600">
                              {formatPrice(selectedPackage.pricePerPerson)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!member.isPayer && (
                          <Button
                            onClick={() => setPayer(member.id)}
                            variant="outline"
                            size="sm"
                          >
                            Set as Organizer
                          </Button>
                        )}
                        {members.length > 1 && (
                          <Button
                            onClick={() => removeMember(member.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={member.name}
                        onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                        placeholder="Full Name"
                      />
                      <Input
                        value={member.email}
                        onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                        placeholder="Email"
                        type="email"
                      />
                      <Input
                        value={member.phone}
                        onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                        placeholder="Phone"
                        type="tel"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {selectedPackage && totalMembers < selectedPackage.minPeople && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">
                      Add {selectedPackage.minPeople - totalMembers} more {selectedPackage.minPeople - totalMembers === 1 ? 'person' : 'people'} to unlock this package
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 'payment' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment</h3>
                <p className="text-gray-600">Review and confirm your booking</p>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Event:</span>
                    <span className="font-medium text-gray-900">{groupName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Date:</span>
                    <span className="font-medium text-gray-900">
                      {eventDate && new Date(eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {eventTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">People:</span>
                    <span className="font-medium text-gray-900">{totalMembers}</span>
                  </div>
                  {selectedPackage && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Package:</span>
                      <span className="font-medium text-gray-900">{selectedPackage.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Price Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Subtotal ({totalMembers} × {formatPrice(selectedPackage?.pricePerPerson || 0)}):</span>
                    <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Group Discount ({selectedPackage?.discount}%):</span>
                      <span className="font-medium">-{formatPrice(totalDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 text-right mt-1">
                      {formatPrice(pricePerPerson)} per person
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Payment Method</h4>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      checked={!splitPayment}
                      onChange={() => setSplitPayment(false)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        Full Payment by Organizer
                      </div>
                      <div className="text-sm text-gray-600">
                        {members.find(m => m.isPayer)?.name || 'Organizer'} pays {formatPrice(finalPrice)} now
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      checked={splitPayment}
                      onChange={() => setSplitPayment(true)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        Split Payment
                      </div>
                      <div className="text-sm text-gray-600">
                        Each person pays {formatPrice(pricePerPerson)} separately
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div>
            {step !== 'package' && (
              <Button
                onClick={() => {
                  const steps: ('package' | 'details' | 'members' | 'payment')[] = ['package', 'details', 'members', 'payment'];
                  const currentIndex = steps.indexOf(step);
                  if (currentIndex > 0) {
                    setStep(steps[currentIndex - 1]);
                  }
                }}
                variant="outline"
              >
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            {step !== 'payment' ? (
              <Button
                onClick={() => {
                  const steps: ('package' | 'details' | 'members' | 'payment')[] = ['package', 'details', 'members', 'payment'];
                  const currentIndex = steps.indexOf(step);
                  
                  // Validation
                  if (step === 'package' && !selectedPackage) {
                    toast.error('Please select a package or choose custom booking');
                    return;
                  }
                  if (step === 'details' && (!groupName || !eventDate)) {
                    toast.error('Please fill in all event details');
                    return;
                  }
                  if (step === 'members' && members.length < 2) {
                    toast.error('Please add at least 2 members');
                    return;
                  }
                  if (step === 'members' && selectedPackage && members.length < selectedPackage.minPeople) {
                    toast.error(`This package requires at least ${selectedPackage.minPeople} people`);
                    return;
                  }
                  
                  if (currentIndex < steps.length - 1) {
                    setStep(steps[currentIndex + 1]);
                  }
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleBooking}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
              >
                <Check className="w-5 h-5 mr-2" />
                Confirm Booking - {formatPrice(finalPrice)}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
