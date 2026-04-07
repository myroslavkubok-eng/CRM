import { useState } from 'react';
import { Calendar, Clock, User, X, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar as CalendarComponent } from './ui/calendar';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface RescheduleBookingModalProps {
  isOpen: boolean;
  booking: any;
  salon?: any;
  onClose: () => void;
  onSuccess: (updatedBooking: any) => void;
}

export function RescheduleBookingModal({ isOpen, booking, salon, onClose, onSuccess }: RescheduleBookingModalProps) {
  const { formatPrice } = useCurrency();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  // Generate time slots (every 15 minutes from 9:00 AM to 8:00 PM)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 20;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hourStr = hour > 12 ? hour - 12 : hour;
        const minuteStr = minute.toString().padStart(2, '0');
        const period = hour >= 12 ? 'PM' : 'AM';
        slots.push(`${hourStr}:${minuteStr} ${period}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Mock booked slots - in real app, fetch from salon's calendar
  const bookedSlots = ['9:00 AM', '9:15 AM', '10:30 AM', '11:00 AM', '2:00 PM', '3:30 PM'];

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to reschedule booking
      // In real app: POST /api/bookings/:id/reschedule
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Format new date
      const newDate = selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const updatedBooking = {
        ...booking,
        date: newDate,
        time: selectedTime,
      };

      // Send notifications to client and salon
      await sendNotifications({
        type: 'reschedule',
        booking: updatedBooking,
        oldDate: booking.date,
        oldTime: booking.time,
      });

      // Update calendar in real-time
      await updateSalonCalendar(salon.id, booking.id, {
        date: newDate,
        time: selectedTime,
      });

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-bold">Booking Rescheduled!</p>
          <p className="text-sm">New time: {newDate} at {selectedTime}</p>
          <p className="text-xs text-gray-600">Notifications sent to you and the salon</p>
        </div>,
        {
          duration: 5000,
        }
      );

      onSuccess(updatedBooking);
      onClose();
    } catch (error) {
      toast.error('Failed to reschedule booking. Please try again.');
      console.error('Reschedule error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock function - in real app, call backend API
  const sendNotifications = async (data: any) => {
    console.log('📧 Sending notifications:', data);
    // Backend will send:
    // 1. Email to client
    // 2. Email to salon
    // 3. SMS to client (if enabled)
    // 4. SMS to salon (if enabled)
    // 5. Push notification to salon dashboard
  };

  // Mock function - in real app, update via backend
  const updateSalonCalendar = async (salonId: string, bookingId: string, newSlot: any) => {
    console.log('📅 Updating salon calendar:', { salonId, bookingId, newSlot });
    // Backend will:
    // 1. Check for conflicts (double booking prevention)
    // 2. Update booking in database
    // 3. Update salon's calendar
    // 4. Broadcast to salon's real-time dashboard
  };

  const isComplete = selectedDate && selectedTime;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              Reschedule Appointment
            </h2>
            <p className="text-gray-600 text-sm mt-1">Choose a new date and time</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Current Booking Info */}
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Current Appointment</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <p><span className="font-semibold">{booking.salonName}</span> - {booking.service}</p>
                  <p>{booking.date} at {booking.time}</p>
                  <p>Staff: {booking.staff}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Select Date */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Select New Date
              </h3>
              <Card className="p-4 border-2 border-purple-100">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md"
                />
              </Card>
            </div>

            {/* Select Time */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Select New Time
              </h3>
              <Card className="p-4 border-2 border-purple-100">
                {selectedDate ? (
                  <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-2">
                    {timeSlots.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      return (
                        <Button
                          key={slot}
                          variant={selectedTime === slot ? 'default' : 'outline'}
                          size="sm"
                          disabled={isBooked}
                          onClick={() => setSelectedTime(slot)}
                          className={`${
                            selectedTime === slot
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : ''
                          } ${isBooked ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {slot}
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="font-semibold">Please select a date first</p>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* New Appointment Preview */}
          {isComplete && (
            <Card className="p-4 mt-6 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-bold text-green-900 mb-1">New Appointment</h3>
                  <div className="space-y-1 text-sm text-green-800">
                    <p><span className="font-semibold">{booking.salonName}</span> - {booking.service}</p>
                    <p>
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })} at {selectedTime}
                    </p>
                    <p>Staff: {booking.staff}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <div>
                <p className="font-medium">Both you and the salon will be notified</p>
                <p className="text-xs text-gray-500">via Email, SMS, and Push Notification</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReschedule}
                disabled={!isComplete || isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Rescheduling...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Reschedule
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}