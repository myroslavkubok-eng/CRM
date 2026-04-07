import { useState } from 'react';
import { Bot, Send, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function AIToolsTab() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [communicationTone, setCommunicationTone] = useState('Friendly & Casual 😊');
  const [responseDelay, setResponseDelay] = useState(5);
  const [chatMessage, setChatMessage] = useState('');

  // Dynamic messages based on communication tone
  const getGreetingMessage = () => {
    switch (communicationTone) {
      case 'Friendly & Casual 😊':
        return "Hello! 👋 I'm the AI assistant for Glamour Salon. How can I help you today?";
      case 'Professional & Formal 💼':
        return "Good day. I am the automated assistant for Glamour Salon. How may I assist you today?";
      case 'Warm & Welcoming 🤗':
        return "Welcome! 🤗 I'm so happy to help you at Glamour Salon. What can I do for you today?";
      case 'Enthusiastic & Energetic 🎉':
        return "Hey there! 🎉 Super excited to help you at Glamour Salon! What brings you here today? ✨";
      default:
        return "Hello! 👋 I'm the AI assistant for Glamour Salon. How can I help you today?";
    }
  };

  const getResponseMessage = () => {
    switch (communicationTone) {
      case 'Friendly & Casual 😊':
        return "Let me check that for you! 😊 Yes, we have openings at 10:00 AM and 2:00 PM with Alice. Which one works best? ✨";
      case 'Professional & Formal 💼':
        return "I have verified our availability. We have two appointments available: 10:00 AM and 2:00 PM with Alice. Which time would you prefer?";
      case 'Warm & Welcoming 🤗':
        return "I'd love to help you with that! 💕 We have wonderful slots at 10:00 AM and 2:00 PM with Alice. Which time feels right for you? 🤗";
      case 'Enthusiastic & Energetic 🎉':
        return "Great news! 🌟 We've got AMAZING times for you - 10:00 AM or 2:00 PM with Alice! Both are fantastic! Which one gets you more excited? 🎊";
      default:
        return "Let me check that for you! 😊 Yes, we have openings at 10:00 AM and 2:00 PM with Alice. Which one works best? ✨";
    }
  };

  const chatMessages = [
    {
      id: 1,
      sender: 'ai',
      text: getGreetingMessage()
    },
    {
      id: 2,
      sender: 'user',
      text: getResponseMessage(),
      bubble: true
    },
    {
      id: 3,
      sender: 'hint',
      text: 'Try changing the "Tone" setting on the left!'
    }
  ];

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-6">
      {/* Left Column - AI Configuration */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Configuration</h2>
            <p className="text-sm text-gray-500">Customize your AI assistant's behavior</p>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Enable AI Assistant */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Enable AI Assistant</h3>
                  <p className="text-xs text-gray-500">Allow AI to handle incoming chats</p>
                </div>
                <button
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    aiEnabled ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      aiEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Communication Tone */}
            <div>
              <label className="text-sm font-bold text-gray-900 mb-3 block">
                Communication Tone
              </label>
              <select
                value={communicationTone}
                onChange={(e) => setCommunicationTone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Friendly & Casual 😊</option>
                <option>Professional & Formal 💼</option>
                <option>Warm & Welcoming 🤗</option>
                <option>Enthusiastic & Energetic 🎉</option>
              </select>
            </div>

            {/* Response Delay */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-900">
                  Response Delay (5s)
                </label>
                <button className="text-gray-400 hover:text-gray-600">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={responseDelay}
                  onChange={(e) => setResponseDelay(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1s</span>
                  <span>10s</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Auto-Confirm Bookings */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Auto-Confirm Bookings</h3>
                  <p className="text-xs text-gray-500">Automatically approve available slots</p>
                </div>
                <button
                  onClick={() => setAutoConfirm(!autoConfirm)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    autoConfirm ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      autoConfirm ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Chat Preview */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Salon Assistant</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4 mb-6 min-h-[400px]">
            {chatMessages.map((message) => (
              <div key={message.id}>
                {message.sender === 'ai' && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                      <p className="text-sm text-gray-900">{message.text}</p>
                    </div>
                  </div>
                )}

                {message.sender === 'user' && message.bubble && (
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-purple-600 rounded-2xl rounded-tr-sm px-4 py-3 max-w-md">
                      <p className="text-sm text-white">{message.text}</p>
                    </div>
                  </div>
                )}

                {message.sender === 'hint' && (
                  <div className="flex justify-center">
                    <div className="inline-block bg-purple-100 text-purple-600 rounded-full px-4 py-2 text-xs font-medium">
                      {message.text}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="relative">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type a message"
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-500 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white">
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-3">Chat preview mode</p>
        </CardContent>
      </Card>
    </div>
  );
}