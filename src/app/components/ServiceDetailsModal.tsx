import { X, Clock, DollarSign, Tag, Percent, FileText, Edit2, Save } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id?: string;
    category: string;
    name: string;
    duration: number; // in minutes
    price: number;
    description?: string;
    discount?: number; // percentage
    originalPrice?: number;
  } | null;
  bookingDetails?: {
    clientName: string;
    date: string;
    time: string;
    masterName: string;
    status: 'paid' | 'deposit' | 'unpaid';
  };
  onSave?: (updatedService: {
    id?: string;
    category: string;
    name: string;
    duration: number;
    price: number;
    description?: string;
    discount?: number;
    originalPrice?: number;
  }) => void;
}

const SERVICE_CATEGORY_COLORS: { [key: string]: string } = {
  'Manicure': 'bg-pink-500',
  'Pedicure': 'bg-orange-500',
  'Eyelashes': 'bg-purple-500',
  'Brow': 'bg-amber-600',
  'Barber': 'bg-blue-500',
  'Hair stylist': 'bg-indigo-500',
  'Cosmetology': 'bg-cyan-500',
  'Facial': 'bg-rose-500',
  'Laser': 'bg-red-500',
  'Make up': 'bg-fuchsia-500',
  'Tattoo': 'bg-slate-600',
  'Piercing': 'bg-gray-500',
  'PMU': 'bg-violet-500',
  'Spa': 'bg-emerald-500',
  'Massage': 'bg-teal-500',
  'Fitness': 'bg-lime-600',
  'Waxing': 'bg-yellow-500',
  'Other': 'bg-zinc-500',
};

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
];

export function ServiceDetailsModal({ isOpen, onClose, service, bookingDetails, onSave }: ServiceDetailsModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState(service);

  // Update editedService when service changes
  useEffect(() => {
    if (isOpen && service && JSON.stringify(editedService) !== JSON.stringify(service)) {
      setEditedService(service);
    }
  }, [isOpen, service, editedService]);

  if (!isOpen) return null;

  const currentService = isEditing ? editedService : service;
  const categoryColor = currentService ? SERVICE_CATEGORY_COLORS[currentService.category] || 'bg-gray-500' : 'bg-gray-500';
  
  const finalPrice = currentService && currentService.originalPrice 
    ? currentService.price 
    : currentService ? currentService.price : 0;
  
  const hasDiscount = currentService && currentService.discount && currentService.discount > 0;
  const originalPrice = currentService && currentService.originalPrice || currentService ? currentService.price : 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}min`;
    }
  };

  const statusColors = {
    paid: 'bg-green-100 text-green-800 border-green-200',
    deposit: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    unpaid: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusLabels = {
    paid: 'Paid',
    deposit: 'Deposit Paid',
    unpaid: 'Not Paid'
  };

  const handleSave = () => {
    if (onSave && editedService) {
      onSave(editedService);
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header with Category Color */}
        <div className={`${categoryColor} p-6 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="text-white/90 text-sm font-medium mb-2">
                {currentService ? currentService.category : 'Unknown'}
              </div>
              <h2 className="text-2xl font-bold mb-1">{currentService ? currentService.name : 'Unknown'}</h2>
              {bookingDetails && (
                <div className="text-white/90 text-sm">
                  with {bookingDetails.masterName}
                </div>
              )}
            </div>
            
            {hasDiscount && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                <Percent className="w-5 h-5" />
                <span className="font-bold text-lg">{currentService ? currentService.discount : 0}% OFF</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Booking Details if provided */}
          {bookingDetails && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Booking Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Client</div>
                  <div className="font-medium text-gray-900">{bookingDetails.clientName}</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1">Payment Status</div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[bookingDetails.status]}`}>
                    {statusLabels[bookingDetails.status]}
                  </span>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1">Date</div>
                  <div className="font-medium text-gray-900">
                    {new Date(bookingDetails.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1">Time</div>
                  <div className="font-medium text-gray-900">{bookingDetails.time}</div>
                </div>
              </div>
            </div>
          )}

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Service Details</h3>
            
            {isEditing ? (
              /* EDIT MODE - Form Fields */
              <>
                {/* Service Name */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-500 mb-1 block">Service Name</label>
                    <input
                      type="text"
                      value={editedService?.name || ''}
                      onChange={(e) => setEditedService(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter service name"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${categoryColor} flex items-center justify-center flex-shrink-0`}>
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-500 mb-1 block">Category</label>
                    <select
                      value={editedService?.category || ''}
                      onChange={(e) => setEditedService(prev => prev ? {...prev, category: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Object.keys(SERVICE_CATEGORY_COLORS).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-500 mb-1 block">Duration (minutes)</label>
                    <input
                      type="number"
                      value={editedService?.duration || 0}
                      onChange={(e) => setEditedService(prev => prev ? {...prev, duration: parseInt(e.target.value) || 0} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter duration in minutes"
                      min="1"
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-500 mb-1 block">Price</label>
                    <input
                      type="number"
                      value={editedService?.price || 0}
                      onChange={(e) => setEditedService(prev => prev ? {...prev, price: parseFloat(e.target.value) || 0} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Discount */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Percent className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-500 mb-1 block">Discount (%)</label>
                    <input
                      type="number"
                      value={editedService?.discount || 0}
                      onChange={(e) => {
                        const discount = parseInt(e.target.value) || 0;
                        const price = editedService?.price || 0;
                        const originalPrice = price / (1 - discount / 100);
                        setEditedService(prev => prev ? {
                          ...prev, 
                          discount,
                          originalPrice: discount > 0 ? originalPrice : undefined
                        } : null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter discount percentage"
                      min="0"
                      max="100"
                    />
                    {editedService && editedService.discount && editedService.discount > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Original price: {selectedCurrency.symbol}{editedService.originalPrice?.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-500 mb-1 block">Description</label>
                    <textarea
                      value={editedService?.description || ''}
                      onChange={(e) => setEditedService(prev => prev ? {...prev, description: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                      placeholder="Enter service description"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* VIEW MODE - Display Information */
              <>
                {/* Duration */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-semibold text-gray-900">{currentService ? formatDuration(currentService.duration) : 'Unknown'}</div>
                  </div>
                </div>

                {/* Price with Currency Selector */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-2">Price</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-baseline gap-2">
                        {hasDiscount && (
                          <span className="text-lg text-gray-400 line-through">
                            {selectedCurrency.symbol}{originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-gray-900">
                          {selectedCurrency.symbol}{finalPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Currency Selector */}
                      <select
                        value={selectedCurrency.code}
                        onChange={(e) => {
                          const currency = CURRENCIES.find(c => c.code === e.target.value);
                          if (currency) setSelectedCurrency(currency);
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {CURRENCIES.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} ({currency.symbol})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {hasDiscount && (
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        <Tag className="w-3.5 h-3.5" />
                        You save {selectedCurrency.symbol}{(originalPrice - finalPrice).toFixed(2)} ({currentService ? currentService.discount : 0}%)
                      </div>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${categoryColor} flex items-center justify-center flex-shrink-0`}>
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Category</div>
                    <div className="font-semibold text-gray-900">{currentService ? currentService.category : 'Unknown'}</div>
                  </div>
                </div>

                {/* Description */}
                {currentService && currentService.description && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Description</div>
                      <div className="text-gray-700 leading-relaxed">{currentService.description}</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {isEditing ? (
              <>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSave}>
                  Save
                </Button>
              </>
            ) : (
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setIsEditing(true)}>
                Edit Service
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}