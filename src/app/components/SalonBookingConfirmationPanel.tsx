import { useState } from 'react';
import { CheckCircle, XCircle, Calendar, Clock, User, Phone, Mail, DollarSign, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useCurrency } from '../../contexts/CurrencyContext';
import {
  BookingWithWorkflow,
  SalonBookingView,
  SalonConfirmationAction,
  getTimeUntilAutoDecline,
  formatTimeRemaining,
  isBookingUrgent,
} from '../types/bookingWorkflow';

interface SalonBookingConfirmationPanelProps {
  bookings: SalonBookingView[];
  onConfirm: (action: SalonConfirmationAction) => void;
  onDecline: (action: SalonConfirmationAction) => void;
  onReschedule: (action: SalonConfirmationAction) => void;
}

export function SalonBookingConfirmationPanel({
  bookings,
  onConfirm,
  onDecline,
  onReschedule,
}: SalonBookingConfirmationPanelProps) {
  const { formatPrice } = useCurrency();
  
  const [selectedBooking, setSelectedBooking] = useState<SalonBookingView | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Filter and sort bookings
  const pendingBookings = bookings.filter(b => b.isPending);
  const urgentBookings = pendingBookings.filter(b => b.isUrgent);
  const conflictBookings = pendingBookings.filter(b => b.hasConflict);
  const normalBookings = pendingBookings.filter(b => !b.isUrgent && !b.hasConflict);

  const handleConfirm = (booking: SalonBookingView) => {
    const action: SalonConfirmationAction = {
      bookingId: booking.booking.id,
      action: 'confirm',
      actorId: 'salon-owner', // TODO: Get from auth
      actorName: 'Salon Owner',
    };

    onConfirm(action);
    toast.success('Booking confirmed! 🎉');
  };

  const handleDeclineSubmit = () => {
    if (!selectedBooking) return;

    if (!declineReason.trim()) {
      toast.error('Please provide a reason for declining');
      return;
    }

    const action: SalonConfirmationAction = {
      bookingId: selectedBooking.booking.id,
      action: 'decline',
      declineReason,
      actorId: 'salon-owner',
      actorName: 'Salon Owner',
    };

    onDecline(action);
    setShowDeclineModal(false);
    setDeclineReason('');
    setSelectedBooking(null);
    toast.success('Booking declined. Client will be refunded.');
  };

  const handleRescheduleSubmit = () => {
    if (!selectedBooking) return;

    if (!rescheduleDate || !rescheduleTime || !rescheduleReason.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    const newDateTime = new Date(`${rescheduleDate}T${rescheduleTime}`);

    const action: SalonConfirmationAction = {
      bookingId: selectedBooking.booking.id,
      action: 'reschedule',
      newDateTime,
      rescheduleReason,
      actorId: 'salon-owner',
      actorName: 'Salon Owner',
    };

    onReschedule(action);
    setShowRescheduleModal(false);
    setRescheduleDate('');
    setRescheduleTime('');
    setRescheduleReason('');
    setSelectedBooking(null);
    toast.success('Reschedule request sent to client');
  };

  const renderBookingCard = (bookingView: SalonBookingView) => {
    const { booking } = bookingView;
    const timeUntil = getTimeUntilAutoDecline(booking);
    const isUrgent = bookingView.isUrgent;

    return (
      <Card
        key={booking.id}
        className={`p-6 ${
          isUrgent
            ? 'border-red-300 bg-red-50'
            : bookingView.hasConflict
            ? 'border-yellow-300 bg-yellow-50'
            : 'border-gray-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isUrgent ? 'bg-red-100' : 'bg-purple-100'
            }`}>
              <User className={`w-6 h-6 ${isUrgent ? 'text-red-600' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                {booking.clientName}
                {booking.isNewClient && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    🆕 New
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {booking.clientPhone}
              </div>
            </div>
          </div>

          {/* Auto-decline timer */}
          {timeUntil !== null && (
            <div className={`text-right ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`}>
              <div className="text-xs font-semibold">Auto-decline in:</div>
              <div className={`text-lg font-bold ${isUrgent ? 'animate-pulse' : ''}`}>
                {formatTimeRemaining(timeUntil)}
              </div>
            </div>
          )}
        </div>

        {/* Conflict warning */}
        {bookingView.hasConflict && bookingView.conflictDetails && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-yellow-900 mb-1">
                  Calendar Conflict
                </div>
                <div className="text-sm text-yellow-800">
                  {bookingView.conflictDetails.conflictType === 'confirmed' && (
                    <>
                      Master already has a confirmed booking at this time
                      {bookingView.conflictDetails.conflictingBookingClient && (
                        <> with {bookingView.conflictDetails.conflictingBookingClient}</>
                      )}
                    </>
                  )}
                  {bookingView.conflictDetails.conflictType === 'temp_hold' && (
                    <>Another client is pending confirmation for this time</>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking details */}
        <div className="space-y-3 mb-4">
          {/* Service */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              ✂️
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{booking.serviceName}</div>
              <div className="text-sm text-gray-600">
                {booking.serviceDuration} minutes • {formatPrice(booking.servicePrice)}
              </div>
            </div>
          </div>

          {/* DateTime */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                {new Date(booking.startTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="text-sm text-gray-600">
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              👩
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{booking.masterName}</div>
              <div className="text-sm text-gray-600">
                {bookingView.masterAvailable ? (
                  <span className="text-green-600">✅ Available</span>
                ) : (
                  <span className="text-red-600">❌ Not available</span>
                )}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-green-600">
                Deposit paid: {formatPrice(booking.depositAmount)}
              </div>
              <div className="text-sm text-gray-600">
                Remaining: {formatPrice(booking.remainingAmount)} (at salon)
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => handleConfirm(bookingView)}
            disabled={!bookingView.canConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm Booking
          </Button>
          <Button
            onClick={() => {
              setSelectedBooking(bookingView);
              setShowRescheduleModal(true);
            }}
            disabled={!bookingView.canReschedule}
            variant="outline"
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Reschedule
          </Button>
          <Button
            onClick={() => {
              setSelectedBooking(bookingView);
              setShowDeclineModal(true);
            }}
            disabled={!bookingView.canDecline}
            variant="outline"
            className="text-red-600 hover:bg-red-50 gap-2"
          >
            <XCircle className="w-4 h-4" />
            Decline
          </Button>
        </div>
      </Card>
    );
  };

  if (pendingBookings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Pending Bookings
        </h3>
        <p className="text-gray-600">
          All booking requests have been reviewed
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</div>
          <div className="text-sm text-yellow-800">Pending Requests</div>
        </Card>
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="text-2xl font-bold text-red-600">{urgentBookings.length}</div>
          <div className="text-sm text-red-800">Urgent (&lt; 30 min)</div>
        </Card>
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{conflictBookings.length}</div>
          <div className="text-sm text-orange-800">Conflicts</div>
        </Card>
      </div>

      {/* Urgent bookings */}
      {urgentBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            🚨 Urgent - Auto-decline soon!
          </h3>
          <div className="space-y-3">
            {urgentBookings.map(renderBookingCard)}
          </div>
        </div>
      )}

      {/* Conflict bookings */}
      {conflictBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-yellow-600 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            ⚠️ Calendar Conflicts
          </h3>
          <div className="space-y-3">
            {conflictBookings.map(renderBookingCard)}
          </div>
        </div>
      )}

      {/* Normal bookings */}
      {normalBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            📋 Pending Requests
          </h3>
          <div className="space-y-3">
            {normalBookings.map(renderBookingCard)}
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Decline Booking Request
            </h3>
            <p className="text-gray-600 mb-4">
              Client: <strong>{selectedBooking.booking.clientName}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for declining *
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g., Master is not available at this time"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              />
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 mb-4">
              ℹ️ Client will receive a full refund of {formatPrice(selectedBooking.booking.depositAmount)}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowDeclineModal(false);
                  setDeclineReason('');
                  setSelectedBooking(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeclineSubmit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Decline & Refund
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Propose New Time
            </h3>
            <p className="text-gray-600 mb-4">
              Client: <strong>{selectedBooking.booking.clientName}</strong>
            </p>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Time
                </label>
                <div className="p-3 bg-gray-100 rounded-lg text-gray-700">
                  {new Date(selectedBooking.booking.startTime).toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Date *
                  </label>
                  <Input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Time *
                  </label>
                  <Input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason *
                </label>
                <textarea
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="e.g., Original time is already booked"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                />
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 mb-4">
              ℹ️ Client will have 24 hours to accept or decline the new time
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setRescheduleDate('');
                  setRescheduleTime('');
                  setRescheduleReason('');
                  setSelectedBooking(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRescheduleSubmit}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Send Proposal
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
