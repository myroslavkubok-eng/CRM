import { useState } from 'react';
import { CheckCircle, XCircle, Calendar, Clock, MapPin, Phone, AlertCircle, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { useCurrency } from '../../contexts/CurrencyContext';
import {
  ClientBookingView,
  ClientRescheduleResponse,
  getBookingStatusDisplay,
  formatTimeRemaining,
} from '../types/bookingWorkflow';

interface ClientBookingTrackerProps {
  bookings: ClientBookingView[];
  onCancelBooking: (bookingId: string, reason: string) => void;
  onRespondToReschedule: (response: ClientRescheduleResponse) => void;
}

export function ClientBookingTracker({
  bookings,
  onCancelBooking,
  onRespondToReschedule,
}: ClientBookingTrackerProps) {
  const { formatPrice } = useCurrency();
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancelSubmit = () => {
    if (!selectedBookingId) return;

    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    onCancelBooking(selectedBookingId, cancelReason);
    setShowCancelModal(false);
    setCancelReason('');
    setSelectedBookingId(null);
  };

  const handleAcceptReschedule = (bookingId: string) => {
    const response: ClientRescheduleResponse = {
      bookingId,
      action: 'accept',
      requestRefund: false,
    };

    onRespondToReschedule(response);
    toast.success('Reschedule accepted! 🎉');
  };

  const handleDeclineReschedule = (bookingId: string) => {
    const response: ClientRescheduleResponse = {
      bookingId,
      action: 'decline',
      declineReason: 'New time does not work for me',
      requestRefund: true,
    };

    onRespondToReschedule(response);
    toast.success('Reschedule declined. Refund initiated.');
  };

  const renderBookingCard = (bookingView: ClientBookingView) => {
    const { booking } = bookingView;
    const statusDisplay = getBookingStatusDisplay(booking.status);

    return (
      <Card key={booking.id} className="overflow-hidden">
        {/* Status Banner */}
        <div
          className={`px-6 py-3 flex items-center justify-between ${
            bookingView.statusColor === 'green'
              ? 'bg-green-50 border-b border-green-200'
              : bookingView.statusColor === 'yellow'
              ? 'bg-yellow-50 border-b border-yellow-200'
              : bookingView.statusColor === 'red'
              ? 'bg-red-50 border-b border-red-200'
              : 'bg-gray-50 border-b border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{statusDisplay.icon}</span>
            <div>
              <div className="font-semibold text-gray-900">
                {bookingView.statusLabel}
              </div>
              {booking.status === 'pending' && booking.confirmationDeadline && (
                <div className="text-sm text-gray-600">
                  Salon has {formatTimeRemaining(
                    Math.floor((new Date(booking.confirmationDeadline).getTime() - Date.now()) / (1000 * 60))
                  )} to confirm
                </div>
              )}
            </div>
          </div>

          {/* Countdown */}
          {bookingView.showCountdown && bookingView.countdownExpiresAt && (
            <div className="text-right">
              <div className="text-xs text-gray-600">{bookingView.countdownLabel}</div>
              <div className="text-lg font-bold text-yellow-600">
                {formatTimeRemaining(
                  Math.floor((new Date(bookingView.countdownExpiresAt).getTime() - Date.now()) / (1000 * 60))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Booking Details */}
        <div className="p-6">
          {/* Salon info */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {booking.salonName}
            </h3>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">View on map</span>
            </div>
          </div>

          {/* Service */}
          <div className="mb-4 p-4 bg-purple-50 rounded-lg">
            <div className="font-semibold text-purple-900 mb-1">
              {booking.serviceName}
            </div>
            <div className="flex items-center gap-4 text-sm text-purple-800">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {booking.serviceDuration} min
              </div>
              <div className="flex items-center gap-1">
                {formatPrice(booking.servicePrice)}
              </div>
            </div>
          </div>

          {/* DateTime */}
          <div className="mb-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                {new Date(booking.startTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="text-gray-600">
                {new Date(booking.startTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' - '}
                {new Date(booking.endTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          {/* Master */}
          <div className="mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              👩
            </div>
            <div>
              <div className="font-medium text-gray-900">{booking.masterName}</div>
              <div className="text-sm text-gray-600">Your stylist</div>
            </div>
          </div>

          {/* Payment */}
          <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-800">Deposit paid:</span>
              <span className="font-bold text-green-600">
                {formatPrice(booking.depositAmount)}
              </span>
            </div>
            {booking.remainingAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800">Pay at salon:</span>
                <span className="font-bold text-gray-900">
                  {formatPrice(booking.remainingAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Reschedule Request */}
          {booking.status === 'rescheduled_pending' && booking.rescheduleRequest && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-yellow-900 mb-1">
                    Salon Requests to Reschedule
                  </div>
                  <div className="text-sm text-yellow-800">
                    {booking.rescheduleRequest.reason}
                  </div>
                </div>
              </div>

              {/* Original vs New Time */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm line-through text-gray-600">
                    {new Date(booking.rescheduleRequest.originalDateTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(booking.rescheduleRequest.newDateTime).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-xs text-yellow-700 mb-3">
                ⏰ Respond within {formatTimeRemaining(
                  Math.floor((new Date(booking.rescheduleRequest.expiresAt).getTime() - Date.now()) / (1000 * 60))
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleAcceptReschedule(booking.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  ✅ Accept New Time
                </Button>
                <Button
                  onClick={() => handleDeclineReschedule(booking.id)}
                  variant="outline"
                  className="flex-1 text-red-600 hover:bg-red-50"
                >
                  ❌ Decline & Refund
                </Button>
              </div>
            </div>
          )}

          {/* Pending Message */}
          {booking.status === 'pending' && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Loader className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                <div className="flex-1">
                  <div className="font-semibold text-blue-900 mb-1">
                    Waiting for salon confirmation
                  </div>
                  <div className="text-sm text-blue-800">
                    We'll notify you as soon as the salon confirms your booking.
                    This usually takes a few minutes.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmed Message */}
          {booking.status === 'confirmed' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-green-900 mb-1">
                    Your booking is confirmed!
                  </div>
                  <div className="text-sm text-green-800">
                    See you on {new Date(booking.startTime).toLocaleDateString()}!
                    We'll send you a reminder 24 hours before.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {bookingView.availableActions.map((action) => (
              <Button
                key={action.type}
                onClick={() => {
                  if (action.type === 'cancel') {
                    setSelectedBookingId(booking.id);
                    setShowCancelModal(true);
                  }
                }}
                variant={action.variant === 'danger' ? 'outline' : 'outline'}
                className={
                  action.variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50'
                    : action.variant === 'primary'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : ''
                }
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  // Group bookings
  const upcomingBookings = bookings.filter(
    (b) => ['pending', 'confirmed', 'rescheduled_pending'].includes(b.booking.status)
  );
  const pastBookings = bookings.filter(
    (b) => ['completed', 'cancelled_by_client', 'cancelled_by_salon', 'declined_by_salon', 'no_show', 'expired'].includes(b.booking.status)
  );

  return (
    <div className="space-y-6">
      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Upcoming Bookings ({upcomingBookings.length})
          </h2>
          <div className="space-y-4">
            {upcomingBookings.map(renderBookingCard)}
          </div>
        </div>
      )}

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Past Bookings ({pastBookings.length})
          </h2>
          <div className="space-y-4">
            {pastBookings.map(renderBookingCard)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {bookings.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No bookings yet
          </h3>
          <p className="text-gray-600 mb-6">
            Book your first appointment to get started
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            Browse Salons
          </Button>
        </Card>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Cancel Booking
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g., Schedule conflict"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
              />
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 mb-4">
              ⚠️ Refund amount depends on cancellation policy
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  setSelectedBookingId(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Keep Booking
              </Button>
              <Button
                onClick={handleCancelSubmit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Cancel Booking
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
