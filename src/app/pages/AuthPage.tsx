import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ClientRegisterForm } from './ClientRegisterForm';
import { SalonRegisterForm } from './SalonRegisterForm';

type AuthMode = 'choice' | 'client' | 'salon';
type AuthTab = 'signin' | 'signup';

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('choice');
  const [tab, setTab] = useState<AuthTab>('signin');

  const handleBack = () => {
    if (mode === 'choice') {
      navigate('/');
    } else {
      setMode('choice');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{mode === 'choice' ? 'Back to Home' : 'Back'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Katia
            </h1>
            <p className="text-gray-600 mt-2">Beauty & Wellness Marketplace</p>
          </div>

          {/* Choice Screen */}
          {mode === 'choice' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Welcome
              </h2>
              <p className="text-gray-600 text-center mb-8">
                How would you like to continue?
              </p>

              <div className="space-y-4">
                {/* Client Option */}
                <button
                  onClick={() => setMode('client')}
                  className="w-full p-6 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        I'm a Client
                      </h3>
                      <p className="text-sm text-gray-600">
                        Book appointments at beauty salons
                      </p>
                    </div>
                  </div>
                </button>

                {/* Salon Option */}
                <button
                  onClick={() => setMode('salon')}
                  className="w-full p-6 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-400 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        I'm a Business Owner
                      </h3>
                      <p className="text-sm text-gray-600">
                        Manage my salon and accept bookings
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Client Form */}
          {mode === 'client' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setTab('signin')}
                  className={`flex-1 py-4 text-center font-semibold transition-colors ${
                    tab === 'signin'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setTab('signup')}
                  className={`flex-1 py-4 text-center font-semibold transition-colors ${
                    tab === 'signup'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="p-8">
                <ClientRegisterForm mode={tab} />
              </div>

              {/* Switch to Salon */}
              <div className="px-8 pb-8 text-center">
                <p className="text-sm text-gray-600">
                  Are you a business owner?{' '}
                  <button
                    onClick={() => setMode('salon')}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Register your salon →
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Salon Form */}
          {mode === 'salon' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setTab('signin')}
                  className={`flex-1 py-4 text-center font-semibold transition-colors ${
                    tab === 'signin'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setTab('signup')}
                  className={`flex-1 py-4 text-center font-semibold transition-colors ${
                    tab === 'signup'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="p-8">
                <SalonRegisterForm mode={tab} />
              </div>

              {/* Switch to Client */}
              <div className="px-8 pb-8 text-center">
                <p className="text-sm text-gray-600">
                  Looking to book an appointment?{' '}
                  <button
                    onClick={() => setMode('client')}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Sign in as client →
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}