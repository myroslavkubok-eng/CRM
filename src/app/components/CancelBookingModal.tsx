import { useState } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface CancelBookingModalProps {
  isOpen: boolean;
  booking: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function CancelBookingModal({ isOpen, booking, onClose, onSuccess }: CancelBookingModalProps) {
  const { formatPrice } = useCurrency();
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const cancellationReasons = [
    'Schedule conflict',
    'Found another salon',
    'Personal reasons',
    'Service no longer needed',
    'Price concerns',
    'Other',
  ];

  const handleCancel = async () => {
    if (!cancellationReason) {
      toast.error('Please select a cancellation reason');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to cancel booking
      // In real app: POST /api/bookings/:id/cancel
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Send notifications to client and salon
      await sendCancellationNotifications({
        booking,
        reason: cancellationReason,
      });

      // Update salon calendar to free the time slot
      await freeSalonTimeSlot(booking.salonId, booking.id, {
        date: booking.date,
        time: booking.time,
      });

      // Process refund if applicable
      const refundAmount = calculateRefund(booking);

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-bold">Booking Cancelled</p>
          <p className="text-sm">Your appointment has been cancelled</p>
          {refundAmount > 0 && (
            <p className="text-xs text-gray-600">
              Refund of {formatPrice(refundAmount)} will be processed in 3-5 business days
            </p>
          )}
          <p className="text-xs text-gray-600">Notifications sent to you and the salon</p>
        </div>,
        {
          duration: 5000,
        }
      );

      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to cancel booking. Please try again.');
      console.error('Cancel error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock function - in real app, call backend API
  const sendCancellationNotifications = async (data: any) => {
    console.log('📧 Sending cancellation notifications:', data);
    // Backend will send:
    // 1. Cancellation email to client with refund info
    // 2. Cancellation email to salon
    // 3. SMS to client (if enabled)
    // 4. SMS to salon (if enabled)
    // 5. Push notification to salon dashboard
    // 6. Update salon's calendar availability
  };

  // Mock function - in real app, update via backend
  const freeSalonTimeSlot = async (salonId: string, bookingId: string, slot: any) => {
    console.log('📅 Freeing salon time slot:', { salonId, bookingId, slot });
    // Backend will:
    // 1. Remove booking from salon's calendar
    // 2. Mark time slot as available
    // 3. Update booking status to 'cancelled'
    // 4. Broadcast to salon's real-time dashboard
    // 5. Allow new bookings for this slot
  };

  // Calculate refund based on cancellation policy
  const calculateRefund = (booking: any) => {
    // Example policy:
    // - More than 24 hours before: 100% refund
    // - 12-24 hours before: 50% refund
    // - Less than 12 hours: No refund
    
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilBooking > 24) {
      return booking.price; // 100% refund
    } else if (hoursUntilBooking > 12) {
      return booking.price * 0.5; // 50% refund
    } else {
      return 0; // No refund
    }
  };

  const refundAmount = calculateRefund(booking);
  const refundPercentage = (refundAmount / booking.price) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-red-50">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Cancel Appointment
            </h2>
            <p className="text-red-700 text-sm mt-1">This action cannot be undone</p>
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
        <div className="p-6 space-y-6">
          {/* Booking Details */}
          <Card className="p-4 border-2 border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{booking.salonName}</h3>
                <p className="text-gray-600">{booking.service}</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700 border-0">
                {booking.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-semibold">{booking.date}</p>
              </div>
              <div>
                <p className="text-gray-600">Time</p>
                <p className="font-semibold">{booking.time}</p>
              </div>
              <div>
                <p className="text-gray-600">Staff</p>
                <p className="font-semibold">{booking.staff}</p>
              </div>
              <div>
                <p className="text-gray-600">Price</p>
                <p className="font-semibold text-purple-600">{formatPrice(booking.price)}</p>
              </div>
            </div>
          </Card>

          {/* Refund Information */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-blue-600" />
              Refund Policy
            </h3>
            <div className="space-y-2 text-sm">
              {refundPercentage === 100 ? (
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-700">Full Refund Available</p>
                    <p className="text-gray-700">
                      You'll receive <span className="font-bold">{formatPrice(refundAmount)}</span> back
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Refund will be processed to your original payment method in 3-5 business days
                    </p>
                  </div>
                </div>
              ) : refundPercentage === 50 ? (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-700">Partial Refund (50%)</p>
                    <p className="text-gray-700">
                      You'll receive <span className="font-bold">{formatPrice(refundAmount)}</span> back
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Cancellation within 12-24 hours of appointment
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700">No Refund Available</p>
                    <p className="text-gray-700">
                      Cancellation within 12 hours of appointment
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      As per our cancellation policy, no refund will be issued
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Cancellation Reason */}
          <div>
            <label className="block font-bold mb-3">
              Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {cancellationReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setCancellationReason(reason)}
                  className={`p-3 text-sm rounded-lg border-2 transition-all ${
                    cancellationReason === reason
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            {cancellationReason === 'Other' && (
              <textarea
                placeholder="Please provide more details..."
                className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            )}
          </div>

          {/* Warning */}
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Important Notice</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>The salon will be notified immediately</li>
                  <li>Your time slot will become available for other clients</li>
                  <li>Frequent cancellations may affect your booking privileges</li>
                  <li>You can rebook anytime from the salon's page</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
            >
              Keep Appointment
            </Button>
            <Button
              onClick={handleCancel}
              disabled={!cancellationReason || isSubmitting}
              variant="destructive"
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel Booking
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}