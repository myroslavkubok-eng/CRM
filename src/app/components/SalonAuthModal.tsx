import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Building2, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useRegistration } from '../../hooks/useRegistration';
import { toast } from 'sonner';

interface SalonAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SalonAuthModal({ isOpen, onClose }: SalonAuthModalProps) {
  const navigate = useNavigate();
  const { 
    isLoading, 
    signInWithEmail, 
    registerWithGoogle, 
    registerWithFacebook 
  } = useRegistration();
  
  const [mode, setMode] = useState<'choice' | 'signin'>('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    await registerWithGoogle('salon');
    // После успешного вызова произойдёт редирект на Google,
    // затем вернёмся на /redirect где RoleBasedRedirect обработает роль
  };

  const handleFacebookAuth = async () => {
    await registerWithFacebook('salon');
    // Аналогично — редирект обработает RoleBasedRedirect
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signInWithEmail(email, password, 'salon');
    
    if (result.success) {
      onClose();
      navigate('/redirect');
    }
  };

  const handleCreateNewSalon = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Salon Access</h2>
              <p className="text-sm text-gray-500">
                {mode === 'choice' ? 'Choose an option' : 'Sign in to your account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'choice' ? (
            <div className="space-y-4">
              {/* Sign In Option */}
              <Card
                className="border-2 border-gray-200 hover:border-purple-400 transition-all cursor-pointer p-6"
                onClick={() => setMode('signin')}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <LogIn className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      I have an account
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sign in to your existing salon dashboard
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>

              {/* Create New Salon Option */}
              <Card
                className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-400 transition-all cursor-pointer p-6"
                onClick={handleCreateNewSalon}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Create new salon
                    </h3>
                    <p className="text-sm text-gray-600">
                      Set up your salon and start accepting bookings
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-purple-600">
                      <span>Quick setup</span>
                      <span className="w-1 h-1 rounded-full bg-purple-600" />
                      <span>Start today</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                </div>
              </Card>

              <p className="text-xs text-gray-500 text-center mt-6">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => setMode('choice')}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to options
              </button>

              {/* Social Auth */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-11 border-gray-300 hover:bg-gray-50"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-11 border-gray-300 hover:bg-gray-50"
                  onClick={handleFacebookAuth}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Email Sign In Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <button
                  type="button"
                  className="w-full text-sm text-purple-600 hover:text-purple-700"
                  onClick={() => toast.info('Password reset feature coming soon!')}
                >
                  Forgot password?
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}