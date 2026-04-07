import { useState } from 'react';
import { X, Sparkles, DollarSign, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCurrency, CURRENCIES } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (service: NewService) => void;
}

export interface NewService {
  category: string;
  name: string;
  duration: number;
  price: number;
  currency: string;
  description: string;
}

const serviceCategories = [
  'Haircut',
  'Coloring',
  'Styling',
  'Manicure',
  'Pedicure',
  'Makeup',
  'Massage',
  'Facial',
  'Waxing',
  'Other'
];

export function AddServiceModal({ isOpen, onClose, onSubmit }: AddServiceModalProps) {
  const { currency, setCurrency, formatPrice } = useCurrency();
  
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !name || !duration || !price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newService: NewService = {
      category,
      name,
      duration: parseInt(duration),
      price: parseFloat(price),
      currency: currency.code,
      description,
    };

    onSubmit(newService);
    
    // Reset form
    setCategory('');
    setName('');
    setDuration('');
    setPrice('');
    setDescription('');
    
    toast.success('Service added successfully! 🎉');
    onClose();
  };

  const handleClose = () => {
    setCategory('');
    setName('');
    setDuration('');
    setPrice('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New Service</h2>
                <p className="text-purple-100 text-sm">Create a new service for your salon</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              Category <span className="text-red-500">*</span>
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              required
            >
              <option value="">Select category...</option>
              {serviceCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Service Name */}
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              Service Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Women's Haircut"
              className="h-11"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Duration (minutes) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 60"
              min="15"
              step="15"
              className="h-11"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Duration in 15-minute increments</p>
          </div>

          {/* Price with Currency Selector */}
          <div>
            <Label htmlFor="price" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Price <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 50"
                  min="0"
                  step="0.01"
                  className="h-11"
                  required
                />
              </div>
              <select
                value={currency.code}
                onChange={(e) => {
                  const selectedCurrency = CURRENCIES.find(c => c.code === e.target.value);
                  if (selectedCurrency) setCurrency(selectedCurrency);
                }}
                className="h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[120px]"
              >
                {CURRENCIES.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.flag} {cur.code} ({cur.symbol})
                  </option>
                ))}
              </select>
            </div>
            {price && (
              <p className="text-xs text-gray-500 mt-1">
                Preview: {formatPrice(parseFloat(price))}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-gray-700 font-medium mb-2">
              Description
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the service details..."
              className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Add more details about this service</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Add Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}