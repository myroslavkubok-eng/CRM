import { useState } from 'react';
import { AlertCircle, Calendar, Clock, User, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { useCurrency } from '../../contexts/CurrencyContext';

interface Master {
  id: string;
  name: string;
  avatar: string;
  available: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  masterId?: string;
  masterName?: string;
}

interface ConflictResolutionProps {
  bookingId: string;
  clientName: string;
  serviceName: string;
  requestedDateTime: Date;
  requestedMasterId: string;
  requestedMasterName: string;
  
  // Conflict type
  conflictType: 'slot_taken' | 'master_unavailable';
  conflictReason: string;
  
  // Suggestions from salon
  suggestedAlternatives: {
    type: 'different_master' | 'different_time';
    masters?: Master[];
    timeSlots?: TimeSlot[];
  };
  
  // Callbacks
  onAcceptSuggestion: (alternative: {
    type: 'different_master' | 'different_time';
    masterId?: string;
    dateTime?: Date;
  }) => void;
  onProposeOwn: (choice: {
    masterId: string;
    dateTime: Date;
  }) => void;
  onDecline: () => void;
}

export function SmartConflictResolution({
  bookingId,
  clientName,
  serviceName,
  requestedDateTime,
  requestedMasterId,
  requestedMasterName,
  conflictType,
  conflictReason,
  suggestedAlternatives,
  onAcceptSuggestion,
  onProposeOwn,
  onDecline,
}: ConflictResolutionProps) {
  const { formatPrice } = useCurrency();
  const [selectedAlternative, setSelectedAlternative] = useState<any>(null);
  const [showCustomChoice, setShowCustomChoice] = useState(false);
  const [customMasterId, setCustomMasterId] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');

  const handleAcceptSuggestion = () => {
    if (!selectedAlternative) {
      toast.error('Please select an alternative');
      return;
    }

    onAcceptSuggestion(selectedAlternative);
    toast.success('Alternative accepted! Waiting for salon confirmation.');
  };

  const handleProposeOwn = () => {
    if (!customMasterId || !customDate || !customTime) {
      toast.error('Please fill all fields');
      return;
    }

    const dateTime = new Date(`${customDate}T${customTime}`);
    
    onProposeOwn({
      masterId: customMasterId,
      dateTime,
    });

    toast.success('Your choice sent to salon for confirmation');
  };

  return (
    <div className="space-y-4">
      {/* Conflict Alert */}
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-red-900 mb-1">
              Booking Conflict Detected
            </h3>
            <p className="text-sm text-red-800 mb-2">
              {conflictReason}
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 bg-white rounded border border-red-200">
                <div className="text-xs text-red-700 mb-1">Requested:</div>
                <div className="font-semibold text-gray-900">
                  {requestedDateTime.toLocaleDateString()} at{' '}
                  {requestedDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-gray-600">Master: {requestedMasterName}</div>
              </div>
              <div className="p-2 bg-white rounded border border-red-200">
                <div className="text-xs text-red-700 mb-1">Status:</div>
                <div className="font-semibold text-red-600">
                  ❌ Not Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Salon's Suggestions */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          💡 Salon's Suggestions
        </h3>

        {/* Different Master Suggestions */}
        {suggestedAlternatives.type === 'different_master' && suggestedAlternatives.masters && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              Same time, different master available:
            </p>
            {suggestedAlternatives.masters.map((master) => (
              <button
                key={master.id}
                onClick={() => setSelectedAlternative({
                  type: 'different_master',
                  masterId: master.id,
                })}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedAlternative?.masterId === master.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {master.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{master.name}</div>
                    <div className="text-sm text-gray-600">
                      {requestedDateTime.toLocaleDateString()} at{' '}
                      {requestedDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {master.available && (
                    <CheckCircle className={`w-6 h-6 ${
                      selectedAlternative?.masterId === master.id ? 'text-purple-600' : 'text-green-500'
                    }`} />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Different Time Suggestions */}
        {suggestedAlternatives.type === 'different_time' && suggestedAlternatives.timeSlots && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              Same master ({requestedMasterName}), different times:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {suggestedAlternatives.timeSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAlternative({
                    type: 'different_time',
                    dateTime: new Date(slot.time),
                  })}
                  disabled={!slot.available}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    !slot.available
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : selectedAlternative?.dateTime?.getTime() === new Date(slot.time).getTime()
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {slot.available ? (
                      <CheckCircle className={`w-5 h-5 ${
                        selectedAlternative?.dateTime?.getTime() === new Date(slot.time).getTime()
                          ? 'text-purple-600'
                          : 'text-green-500'
                      }`} />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Accept button */}
        {selectedAlternative && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              onClick={handleAcceptSuggestion}
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Accept This Alternative
            </Button>
          </div>
        )}
      </Card>

      {/* OR Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-gray-50 text-sm font-medium text-gray-500">OR</span>
        </div>
      </div>

      {/* Client's Own Choice */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          🎯 Choose Your Own Time & Master
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select any available slot and the salon will confirm if it's free
        </p>

        {!showCustomChoice ? (
          <Button
            onClick={() => setShowCustomChoice(true)}
            variant="outline"
            className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            Browse Available Slots
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Master selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Master
              </label>
              <select
                value={customMasterId}
                onChange={(e) => setCustomMasterId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose a master...</option>
                <option value="master-1">Anna (Stylist)</option>
                <option value="master-2">Bob (Barber)</option>
                <option value="master-3">Elena (Nail Tech)</option>
                <option value="master-4">Lisa (Stylist)</option>
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              ℹ️ Salon will check availability and confirm within 2 hours
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowCustomChoice(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleProposeOwn}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Send to Salon
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Decline option */}
      <Card className="p-4 border-gray-300">
        <h3 className="font-semibold text-gray-900 mb-2">
          Can't find a suitable time?
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          You can cancel this booking and get a full refund
        </p>
        <Button
          onClick={onDecline}
          variant="outline"
          className="w-full text-red-600 border-red-600 hover:bg-red-50"
        >
          Cancel Booking & Get Refund
        </Button>
      </Card>
    </div>
  );
}
