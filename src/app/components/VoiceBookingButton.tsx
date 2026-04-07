import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Check, Calendar, Clock, User, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface VoiceCommand {
  timestamp: number;
  transcript: string;
  type: 'user' | 'assistant';
  confidence?: number;
}

interface ParsedBooking {
  service?: string;
  master?: string;
  date?: string;
  time?: string;
  confirmed: boolean;
}

interface VoiceBookingButtonProps {
  onBookingCreated?: (booking: ParsedBooking) => void;
  variant?: 'floating' | 'inline' | 'large';
  className?: string;
}

export function VoiceBookingButton({ 
  onBookingCreated, 
  variant = 'floating',
  className = '' 
}: VoiceBookingButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<VoiceCommand[]>([]);
  const [parsedBooking, setParsedBooking] = useState<ParsedBooking>({
    confirmed: false,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        const confidence = event.results[last][0].confidence;

        if (event.results[last].isFinal) {
          handleVoiceInput(transcript, confidence);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          toast.error('No speech detected', {
            description: 'Please try speaking again',
          });
        }
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const addToConversation = (text: string, type: 'user' | 'assistant', confidence?: number) => {
    setConversation(prev => [
      ...prev,
      {
        timestamp: Date.now(),
        transcript: text,
        type,
        confidence,
      },
    ]);
  };

  const handleVoiceInput = (transcript: string, confidence: number) => {
    addToConversation(transcript, 'user', confidence);
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const response = processVoiceCommand(transcript);
      addToConversation(response.message, 'assistant');
      speak(response.message);
      
      if (response.booking) {
        setParsedBooking(prev => ({ ...prev, ...response.booking }));
      }

      setIsProcessing(false);
    }, 800);
  };

  const processVoiceCommand = (command: string): { message: string; booking?: Partial<ParsedBooking> } => {
    const lower = command.toLowerCase();

    // Check for greeting
    if (lower.includes('hey katia') || lower.includes('hi katia') || lower.includes('hello')) {
      return {
        message: "Hello! I'm Katia, your voice booking assistant. What service would you like to book today?",
      };
    }

    // Service detection
    const services = ['manicure', 'pedicure', 'haircut', 'massage', 'facial', 'coloring', 'makeup'];
    const detectedService = services.find(s => lower.includes(s));
    
    if (detectedService && !parsedBooking.service) {
      return {
        message: `Great choice! ${detectedService} it is. Which master would you prefer, or should I suggest someone?`,
        booking: { service: detectedService },
      };
    }

    // Master detection
    const masters = ['maria', 'anna', 'sofia', 'julia', 'emma'];
    const detectedMaster = masters.find(m => lower.includes(m));
    
    if (detectedMaster && !parsedBooking.master) {
      return {
        message: `Perfect! ${detectedMaster.charAt(0).toUpperCase() + detectedMaster.slice(1)} is excellent. What day works for you?`,
        booking: { master: detectedMaster },
      };
    }

    // Date detection
    if ((lower.includes('tomorrow') || lower.includes('today') || lower.includes('friday') || lower.includes('saturday') || 
         lower.includes('monday') || lower.includes('tuesday') || lower.includes('wednesday') || lower.includes('thursday') ||
         lower.includes('sunday')) && !parsedBooking.date) {
      let date = 'tomorrow';
      if (lower.includes('today')) date = 'today';
      else if (lower.includes('friday')) date = 'Friday';
      else if (lower.includes('saturday')) date = 'Saturday';
      else if (lower.includes('sunday')) date = 'Sunday';
      else if (lower.includes('monday')) date = 'Monday';
      else if (lower.includes('tuesday')) date = 'Tuesday';
      else if (lower.includes('wednesday')) date = 'Wednesday';
      else if (lower.includes('thursday')) date = 'Thursday';
      
      return {
        message: `Got it, ${date}. What time would you like? Morning, afternoon, or evening?`,
        booking: { date },
      };
    }

    // Time detection
    const timePatterns = [
      /(\d{1,2})\s*(am|pm|o'clock)/i,
      /(morning|afternoon|evening)/i,
      /at\s*(\d{1,2})/i,
    ];
    
    let detectedTime: string | undefined;
    for (const pattern of timePatterns) {
      const match = lower.match(pattern);
      if (match && !parsedBooking.time) {
        if (match[0].includes('morning')) detectedTime = '10:00 AM';
        else if (match[0].includes('afternoon')) detectedTime = '2:00 PM';
        else if (match[0].includes('evening')) detectedTime = '6:00 PM';
        else detectedTime = match[0];
        break;
      }
    }

    if (detectedTime && !parsedBooking.time) {
      return {
        message: `Perfect! Let me confirm: ${parsedBooking.service || 'Service'} with ${parsedBooking.master || 'your preferred master'} on ${parsedBooking.date || 'your chosen date'} at ${detectedTime}. Should I book this for you?`,
        booking: { time: detectedTime },
      };
    }

    // Confirmation
    if ((lower.includes('yes') || lower.includes('confirm') || lower.includes('book it')) && 
        parsedBooking.service && parsedBooking.date && parsedBooking.time) {
      onBookingCreated?.({
        ...parsedBooking,
        confirmed: true,
      });
      
      toast.success('Booking confirmed!', {
        description: `${parsedBooking.service} on ${parsedBooking.date} at ${parsedBooking.time}`,
      });

      return {
        message: `Excellent! Your ${parsedBooking.service} appointment is confirmed for ${parsedBooking.date} at ${parsedBooking.time}. You'll receive a confirmation message shortly. Is there anything else I can help you with?`,
        booking: { confirmed: true },
      };
    }

    // Cancellation
    if (lower.includes('cancel') || lower.includes('no') || lower.includes('nevermind')) {
      setParsedBooking({ confirmed: false });
      return {
        message: "No problem! Feel free to start over anytime. Just say 'Hey Katia' when you're ready.",
      };
    }

    // Default fallback
    return {
      message: "I didn't quite catch that. Could you please repeat? You can say things like 'Book a manicure with Maria tomorrow at 2 PM'.",
    };
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported', {
        description: 'Please use a modern browser like Chrome',
      });
      return;
    }

    setIsListening(true);
    setIsExpanded(true);
    recognitionRef.current.start();
    
    // Initial greeting
    const greeting = "Hello! I'm Katia. I'm listening. What would you like to book today?";
    addToConversation(greeting, 'assistant');
    speak(greeting);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsListening(false);
    setIsSpeaking(false);
  };

  // Floating button variant
  if (variant === 'floating' && !isExpanded) {
    return (
      <button
        onClick={startListening}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50 ${className}`}
      >
        <Mic className="w-7 h-7 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
      </button>
    );
  }

  // Inline button variant
  if (variant === 'inline') {
    return (
      <Button
        onClick={isListening ? stopListening : startListening}
        className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white ${className}`}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 mr-2" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Voice Booking
          </>
        )}
      </Button>
    );
  }

  // Expanded/Large variant (conversation UI)
  return (
    <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden z-50 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ${
              isSpeaking ? 'animate-pulse' : ''
            }`}>
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Voice Booking</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-xs text-white/90">
                  {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setIsExpanded(false);
              stopListening();
            }}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Booking Progress */}
      {(parsedBooking.service || parsedBooking.master || parsedBooking.date || parsedBooking.time) && (
        <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
          <div className="space-y-2 text-sm">
            {parsedBooking.service && (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Service: <strong>{parsedBooking.service}</strong></span>
              </div>
            )}
            {parsedBooking.master && (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Master: <strong>{parsedBooking.master}</strong></span>
              </div>
            )}
            {parsedBooking.date && (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Date: <strong>{parsedBooking.date}</strong></span>
              </div>
            )}
            {parsedBooking.time && (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Time: <strong>{parsedBooking.time}</strong></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conversation */}
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {conversation.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">AI Voice Booking</h4>
            <p className="text-sm text-gray-600 mb-4">
              Say: "Hey Katia, book a manicure with Maria tomorrow at 2 PM"
            </p>
            <Badge variant="secondary" className="text-xs">
              Powered by AI Voice Recognition
            </Badge>
          </div>
        )}

        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.type === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}
            >
              {msg.type === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Katia AI</span>
                </div>
              )}
              <p className="text-sm">{msg.transcript}</p>
              {msg.confidence !== undefined && (
                <div className="text-xs opacity-70 mt-1">
                  {(msg.confidence * 100).toFixed(0)}% confident
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <Button
          onClick={isListening ? stopListening : startListening}
          className={`w-full h-12 font-bold transition-all ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Voice Booking
            </>
          )}
        </Button>
        
        <p className="text-xs text-center text-gray-500 mt-3">
          Tip: Speak clearly and naturally
        </p>
      </div>
    </div>
  );
}
