import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, User, Phone, Scissors, Clock, Plus, MessageCircle, Gift, Repeat, Package as PackageIcon } from 'lucide-react';
import { Button } from './ui/button';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface PackageDeal {
  id: string;
  name: string;
  description: string;
  services: { serviceId: string; quantity: number }[];
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  validityDays: number;
  isActive: boolean;
}

interface Master {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface BookingItem {
  id: string;
  serviceId: string;
  serviceName: string;
  masterId: string | null;
  masterName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
}

interface ExistingBooking {
  masterId: string;
  date: string;
  time: string;
  duration: number;
}

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  salonName: string;
  masters: Master[];
  services: Service[];
  packageDeals?: PackageDeal[];
  existingBookings: ExistingBooking[];
  onConfirm: (bookingData: {
    clientName: string;
    clientPhone: string;
    bookings: BookingItem[];
    notes: string;
    isRecurring?: boolean;
    recurringPattern?: {
      frequency: 'weekly' | 'biweekly' | 'triweekly' | 'monthly';
      occurrences: number;
    };
  }) => void;
}

export function BookAppointmentModal({
  isOpen,
  onClose,
  salonName,
  masters,
  services,
  packageDeals = [],
  existingBookings,
  onConfirm
}: BookAppointmentModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+1 234 567 890');
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [bookingType, setBookingType] = useState<'single' | 'package' | 'recurring'>('single');
  const [selectedPackage, setSelectedPackage] = useState<PackageDeal | null>(null);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'biweekly' | 'triweekly' | 'monthly'>('weekly');
  const [recurringOccurrences, setRecurringOccurrences] = useState(12);

  // Generate time slots every 15 minutes from 9:00 to 20:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Check if a time slot is available for a specific master and date
  const isSlotAvailable = (masterId: string | null, date: string, time: string, duration: number) => {
    if (!masterId || !date || !time) return true;

    const [hours, minutes] = time.split(':').map(Number);
    const slotStart = hours * 60 + minutes;
    const slotEnd = slotStart + duration;

    // Check against existing bookings
    const isBlocked = existingBookings.some(booking => {
      if (booking.masterId !== masterId || booking.date !== date) return false;

      const [bHours, bMinutes] = booking.time.split(':').map(Number);
      const bookingStart = bHours * 60 + bMinutes;
      const bookingEnd = bookingStart + booking.duration;

      // Check if slots overlap
      return (slotStart < bookingEnd && slotEnd > bookingStart);
    });

    // Check against current booking items
    const isBlockedByCurrentBookings = bookingItems.some(item => {
      if (item.masterId !== masterId || item.date !== date) return false;

      const [iHours, iMinutes] = item.time.split(':').map(Number);
      const itemStart = iHours * 60 + iMinutes;
      const itemEnd = itemStart + item.duration;

      return (slotStart < itemEnd && slotEnd > itemStart);
    });

    return !isBlocked && !isBlockedByCurrentBookings;
  };

  const addBookingItem = () => {
    const newItem: BookingItem = {
      id: `temp-${Date.now()}`,
      serviceId: '',
      serviceName: '',
      masterId: null,
      masterName: 'Any Master',
      date: '',
      time: '',
      duration: 60,
      price: 0
    };
    setBookingItems([...bookingItems, newItem]);
  };

  const updateBookingItem = (id: string, field: keyof BookingItem, value: any) => {
    setBookingItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };

          // Auto-update related fields when service changes
          if (field === 'serviceId') {
            const service = services.find(s => s.id === value);
            if (service) {
              updated.serviceName = service.name;
              updated.duration = service.duration;
              updated.price = service.price;
            }
          }

          // Auto-update master name
          if (field === 'masterId') {
            const master = masters.find(m => m.id === value);
            updated.masterName = master ? master.name : 'Any Master';
          }

          return updated;
        }
        return item;
      })
    );
  };

  const removeBookingItem = (id: string) => {
    setBookingItems(prev => prev.filter(item => item.id !== id));
  };

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!clientName.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!clientPhone.trim() || clientPhone.length < 10) {
      newErrors.phone = 'Valid phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validateForm()) {
      return;
    }

    if (bookingItems.length === 0) {
      alert('Please add at least one service to book');
      return;
    }

    // Validate all booking items
    const invalidItem = bookingItems.find(
      item => !item.serviceId || !item.date || !item.time
    );

    if (invalidItem) {
      alert('Please complete all booking details (service, date, and time)');
      return;
    }

    onConfirm({
      clientName,
      clientPhone,
      bookings: bookingItems,
      notes,
      isRecurring: bookingType === 'recurring',
      recurringPattern: bookingType === 'recurring' ? {
        frequency: recurringFrequency,
        occurrences: recurringOccurrences
      } : undefined
    });

    // Reset form
    setClientName('');
    setClientPhone('+1 234 567 890');
    setBookingItems([]);
    setNotes('');
    setErrors({});
    setBookingType('single');
    setSelectedPackage(null);
    setRecurringFrequency('weekly');
    setRecurringOccurrences(12);
  };

  // Auto-add first booking item when modal opens
  useEffect(() => {
    if (isOpen && bookingItems.length === 0) {
      addBookingItem();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
            <p className="text-sm text-gray-600 mt-1">{salonName} - Select services and masters</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Name *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Your Name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                Phone *
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+1 234 567 890"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Booking Type */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Add Services</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setBookingType('single')}
                className={`flex-1 min-w-[120px] px-3 py-1.5 rounded-lg text-sm font-medium ${
                  bookingType === 'single' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Single Service
              </button>
              <button
                onClick={() => setBookingType('package')}
                className={`flex-1 min-w-[120px] px-3 py-1.5 rounded-lg text-sm font-medium ${
                  bookingType === 'package' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Package Deal
              </button>
              <button
                onClick={() => setBookingType('recurring')}
                className={`flex-1 min-w-[120px] px-3 py-1.5 rounded-lg text-sm font-medium ${
                  bookingType === 'recurring' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Recurring Service
              </button>
            </div>

            {/* Single Service */}
            {bookingType === 'single' && (
              <>
                {bookingItems.map((item, index) => (
                  <div key={item.id} className="bg-white rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Service {index + 1}</span>
                      {bookingItems.length > 1 && (
                        <button
                          onClick={() => removeBookingItem(item.id)}
                          className="text-xs text-red-600 hover:text-red-700 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Service */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Service</label>
                        <select
                          value={item.serviceId}
                          onChange={(e) => updateBookingItem(item.id, 'serviceId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Service</option>
                          {services.map(service => (
                            <option key={service.id} value={service.id}>
                              {service.name} - ${service.price} ({service.duration}min)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Master */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Master (Optional)</label>
                        <select
                          value={item.masterId || ''}
                          onChange={(e) => updateBookingItem(item.id, 'masterId', e.target.value || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Any Master</option>
                          {masters.map(master => (
                            <option key={master.id} value={master.id}>
                              {master.avatar} {master.name} - {master.role}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Date</label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => updateBookingItem(item.id, 'date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* Time */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Time</label>
                        <select
                          value={item.time}
                          onChange={(e) => updateBookingItem(item.id, 'time', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Time</option>
                          {timeSlots.map(time => {
                            const available = isSlotAvailable(item.masterId, item.date, time, item.duration);
                            return (
                              <option 
                                key={time} 
                                value={time}
                                disabled={!available}
                                className={!available ? 'text-gray-400' : ''}
                              >
                                {time} {!available ? '(Booked)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    {/* Booking preview */}
                    {item.serviceId && item.date && item.time && (
                      <div className="bg-purple-50 rounded-lg p-3 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-purple-600" />
                            <span className="text-purple-900">
                              {item.serviceName} with {item.masterName}
                            </span>
                          </div>
                          <span className="font-semibold text-purple-900">${item.price}</span>
                        </div>
                        <p className="text-purple-700 mt-1">
                          {new Date(item.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {item.time} ({item.duration} min)
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Another Service */}
                <button
                  onClick={addBookingItem}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Booking
                </button>
              </>
            )}

            {/* Package Deal */}
            {bookingType === 'package' && (
              <>
                <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <PackageIcon className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Select Package Deal</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {packageDeals.map(deal => (
                      <div key={deal.id} className="bg-white rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-500">{deal.name}</span>
                          <button
                            onClick={() => setSelectedPackage(deal)}
                            className={`text-xs font-medium ${
                              selectedPackage?.id === deal.id ? 'text-purple-600' : 'text-gray-600'
                            }`}
                          >
                            {selectedPackage?.id === deal.id ? 'Selected' : 'Select'}
                          </button>
                        </div>

                        <p className="text-sm text-gray-600">{deal.description}</p>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">Original Price:</span>
                          <span className="text-sm font-bold text-gray-900">${deal.originalPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">Discounted Price:</span>
                          <span className="text-sm font-bold text-gray-900">${deal.discountedPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">Validity:</span>
                          <span className="text-sm font-bold text-gray-900">{deal.validityDays} days</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Package Preview */}
                {selectedPackage && (
                  <div className="bg-purple-50 rounded-lg p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="w-3 h-3 text-purple-600" />
                        <span className="text-purple-900">
                          {selectedPackage.name}
                        </span>
                      </div>
                      <span className="font-semibold text-purple-900">${selectedPackage.discountedPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-purple-700 mt-1">
                      {selectedPackage.description}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Recurring Service */}
            {bookingType === 'recurring' && (
              <>
                {bookingItems.map((item, index) => (
                  <div key={item.id} className="bg-white rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Service {index + 1}</span>
                      {bookingItems.length > 1 && (
                        <button
                          onClick={() => removeBookingItem(item.id)}
                          className="text-xs text-red-600 hover:text-red-700 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Service */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Service</label>
                        <select
                          value={item.serviceId}
                          onChange={(e) => updateBookingItem(item.id, 'serviceId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Service</option>
                          {services.map(service => (
                            <option key={service.id} value={service.id}>
                              {service.name} - ${service.price} ({service.duration}min)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Master */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Master (Optional)</label>
                        <select
                          value={item.masterId || ''}
                          onChange={(e) => updateBookingItem(item.id, 'masterId', e.target.value || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Any Master</option>
                          {masters.map(master => (
                            <option key={master.id} value={master.id}>
                              {master.avatar} {master.name} - {master.role}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Date</label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => updateBookingItem(item.id, 'date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* Time */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Time</label>
                        <select
                          value={item.time}
                          onChange={(e) => updateBookingItem(item.id, 'time', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Time</option>
                          {timeSlots.map(time => {
                            const available = isSlotAvailable(item.masterId, item.date, time, item.duration);
                            return (
                              <option 
                                key={time} 
                                value={time}
                                disabled={!available}
                                className={!available ? 'text-gray-400' : ''}
                              >
                                {time} {!available ? '(Booked)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    {/* Booking preview */}
                    {item.serviceId && item.date && item.time && (
                      <div className="bg-purple-50 rounded-lg p-3 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-purple-600" />
                            <span className="text-purple-900">
                              {item.serviceName} with {item.masterName}
                            </span>
                          </div>
                          <span className="font-semibold text-purple-900">${item.price}</span>
                        </div>
                        <p className="text-purple-700 mt-1">
                          {new Date(item.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {item.time} ({item.duration} min)
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Another Service */}
                <button
                  onClick={addBookingItem}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Booking
                </button>

                {/* Recurring Pattern */}
                <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Repeat className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Recurring Pattern</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Frequency</label>
                      <select
                        value={recurringFrequency}
                        onChange={(e) => setRecurringFrequency(e.target.value as 'weekly' | 'biweekly' | 'triweekly' | 'monthly')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Biweekly</option>
                        <option value="triweekly">Triweekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Occurrences</label>
                      <input
                        type="number"
                        value={recurringOccurrences}
                        onChange={(e) => setRecurringOccurrences(Number(e.target.value))}
                        min={1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests?"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
            />
          </div>

          {/* Notification Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">You'll receive notifications</p>
              <p className="text-xs text-blue-700 mt-1">
                Booking confirmation will be sent via WhatsApp/SMS to your phone number. 
                You'll also receive reminders 24h and 1h before your appointment.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              ${bookingItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}