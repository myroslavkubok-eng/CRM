import { useState } from 'react';
import { Bot, Send, Loader, Calendar, User, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  bookingData?: {
    service?: string;
    master?: string;
    date?: string;
    time?: string;
    price?: number;
  };
  actions?: {
    type: 'confirm_booking' | 'select_time' | 'select_master' | 'pay_deposit';
    label: string;
    data?: any;
  }[];
}

interface AIBookingAgentProps {
  salonId: string;
  salonName: string;
  onBookingCreated: (bookingData: any) => void;
}

export function AIBookingAgent({
  salonId,
  salonName,
  onBookingCreated,
}: AIBookingAgentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hi! I'm your AI booking assistant for ${salonName}. I can help you book appointments, check availability, and answer questions.\n\nWhat would you like to do today?`,
      timestamp: new Date(),
      actions: [
        { type: 'select_time', label: '📅 Book an Appointment' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>({});

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI processing (in production, call backend AI endpoint)
    setTimeout(() => {
      const aiResponse = processUserInput(input, currentBooking);
      setMessages(prev => [...prev, aiResponse]);
      
      if (aiResponse.bookingData) {
        setCurrentBooking(prev => ({
          ...prev,
          ...aiResponse.bookingData,
        }));
      }
      
      setIsProcessing(false);
    }, 1000);
  };

  const processUserInput = (input: string, booking: any): Message => {
    const lowerInput = input.toLowerCase();

    // Service selection
    if (lowerInput.includes('haircut') || lowerInput.includes('cut')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Great! You want a haircut. 💇‍♂️\n\nWhen would you like to come?',
        timestamp: new Date(),
        bookingData: { service: 'Haircut', price: 200 },
        actions: [
          { type: 'select_time', label: '📅 Today' },
          { type: 'select_time', label: '📅 Tomorrow' },
          { type: 'select_time', label: '📅 Choose Date' },
        ],
      };
    }

    // Time selection
    if (lowerInput.includes('tomorrow') || lowerInput.includes('today')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Perfect! What time works best for you?\n\nHere are available slots:',
        timestamp: new Date(),
        bookingData: { date: lowerInput.includes('tomorrow') ? 'Tomorrow' : 'Today' },
        actions: [
          { type: 'select_time', label: '🕐 10:00 AM', data: '10:00' },
          { type: 'select_time', label: '🕑 2:00 PM', data: '14:00' },
          { type: 'select_time', label: '🕔 5:00 PM', data: '17:00' },
        ],
      };
    }

    // Master selection
    if (booking.service && booking.date && !booking.master) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Which master would you prefer?\n\nAll are available at your chosen time:',
        timestamp: new Date(),
        actions: [
          { type: 'select_master', label: '👩 Anna (Senior Stylist)', data: 'master-1' },
          { type: 'select_master', label: '👨 Bob (Barber)', data: 'master-2' },
          { type: 'select_master', label: '👩 Lisa (Stylist)', data: 'master-3' },
        ],
      };
    }

    // Booking confirmation
    if (booking.service && booking.date && booking.time && booking.master) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Perfect! Here's your booking summary:\n\n📋 ${booking.service}\n👤 Master: ${booking.master}\n📅 ${booking.date} at ${booking.time}\n💰 Price: AED ${booking.price}\n\nDeposit required: AED ${booking.price * 0.25} (25%)\n\nShall I proceed with the booking?`,
        timestamp: new Date(),
        actions: [
          { type: 'confirm_booking', label: '✅ Confirm & Pay Deposit' },
        ],
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I can help you with:\n• Booking appointments\n• Checking availability\n• Service information\n• Pricing\n\nWhat would you like to know?',
      timestamp: new Date(),
    };
  };

  const handleAction = async (action: any) => {
    if (action.type === 'confirm_booking') {
      // Create booking through workflow
      setIsProcessing(true);
      
      // Simulate booking creation
      setTimeout(() => {
        const systemMessage: Message = {
          id: Date.now().toString(),
          role: 'system',
          content: '✅ Booking request sent!\n\n⏳ Status: Pending confirmation\n\nThe salon will review and confirm your booking within 2 hours. You\'ll receive a notification once confirmed.\n\nYour deposit has been authorized but won\'t be charged until the salon confirms.',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, systemMessage]);
        setIsProcessing(false);
        
        // Callback to parent
        onBookingCreated({
          ...currentBooking,
          status: 'pending',
          salonId,
        });
        
        toast.success('Booking request sent! ⏳');
      }, 1500);
    } else if (action.type === 'select_time') {
      const message: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: action.data || action.label,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, message]);
      
      setTimeout(() => {
        const response = processUserInput(action.label, currentBooking);
        setMessages(prev => [...prev, response]);
        
        if (response.bookingData) {
          setCurrentBooking(prev => ({
            ...prev,
            ...response.bookingData,
            time: action.data,
          }));
        }
      }, 500);
    } else if (action.type === 'select_master') {
      setCurrentBooking(prev => ({
        ...prev,
        master: action.label.split(' ')[1], // Extract name
        masterId: action.data,
      }));
      
      const message: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: action.label,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, message]);
      
      setTimeout(() => {
        const response = processUserInput('master selected', {
          ...currentBooking,
          master: action.label.split(' ')[1],
          masterId: action.data,
        });
        setMessages(prev => [...prev, response]);
      }, 500);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Booking Assistant</h3>
            <p className="text-sm text-purple-100">Powered by ChatGPT</p>
          </div>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : message.role === 'system'
                  ? 'bg-green-50 text-green-900 border border-green-200'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4" />
                  <span className="text-xs font-semibold">AI Assistant</span>
                </div>
              )}
              
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>

              {/* Booking data preview */}
              {message.bookingData && (
                <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs space-y-1">
                  {message.bookingData.service && (
                    <div>✂️ {message.bookingData.service}</div>
                  )}
                  {message.bookingData.date && (
                    <div>📅 {message.bookingData.date}</div>
                  )}
                  {message.bookingData.time && (
                    <div>🕐 {message.bookingData.time}</div>
                  )}
                  {message.bookingData.master && (
                    <div>👤 {message.bookingData.master}</div>
                  )}
                  {message.bookingData.price && (
                    <div>💰 AED {message.bookingData.price}</div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              {message.actions && message.actions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.actions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAction(action)}
                      size="sm"
                      className={`w-full justify-start text-left ${
                        action.type === 'confirm_booking'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-white text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}

              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader className="w-5 h-5 text-purple-600 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          💡 Try: "I want a haircut tomorrow at 2 PM"
        </div>
      </div>
    </Card>
  );
}
