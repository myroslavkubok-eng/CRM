import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useRegistration, saveRegistrationData } from '../../hooks/useRegistration';
import { toast } from 'sonner';

interface SalonRegisterFormProps {
  mode: 'signin' | 'signup';
}

export function SalonRegisterForm({ mode }: SalonRegisterFormProps) {
  const navigate = useNavigate();
  const { 
    isLoading, 
    registerWithEmail, 
    registerWithGoogle, 
    registerWithFacebook,
    signInWithEmail 
  } = useRegistration();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [salonName, setSalonName] = useState('');
  const [salonLocation, setSalonLocation] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup') {
      // Validation
      if (!fullName.trim()) {
        toast.error('Please enter your full name');
        return;
      }
      if (!salonName.trim()) {
        toast.error('Please enter your salon name');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
      if (!agreeTerms) {
        toast.error('Please agree to the Terms of Service');
        return;
      }

      const result = await registerWithEmail('salon', {
        email,
        password,
        fullName,
        phone,
        salonName,
        salonLocation,
      });

      if (result.success) {
        toast.success('Account created! Redirecting to complete setup...');
        navigate('/redirect');
      }
    } else {
      // Sign in
      const result = await signInWithEmail(email, password, 'salon');
      
      if (result.success) {
        navigate('/redirect');
      }
    }
  };

  const handleGoogleAuth = async () => {
    // Сохраняем данные салона перед OAuth (если есть)
    if (mode === 'signup' && (salonName || salonLocation)) {
      saveRegistrationData({ salonName, salonLocation });
    }
    await registerWithGoogle('salon');
  };

  const handleFacebookAuth = async () => {
    // Сохраняем данные салона перед OAuth (если есть)
    if (mode === 'signup' && (salonName || salonLocation)) {
      saveRegistrationData({ salonName, salonLocation });
    }
    await registerWithFacebook('salon');
  };

  return (
    <div className="space-y-6">
      {/* Header for Salon */}
      <div className="text-center pb-4 border-b border-gray-200">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-3">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-bold text-gray-900">
          {mode === 'signup' ? 'Register Your Salon' : 'Salon Owner Login'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {mode === 'signup' 
            ? 'Start accepting bookings today' 
            : 'Access your salon dashboard'}
        </p>
      </div>

      {/* Social Auth Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 border-gray-300 hover:bg-gray-50"
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
          {mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 border-gray-300 hover:bg-gray-50"
          onClick={handleFacebookAuth}
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          {mode === 'signup' ? 'Sign up with Facebook' : 'Continue with Facebook'}
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">
            Or {mode === 'signup' ? 'register' : 'sign in'} with email
          </span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {mode === 'signup' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salon Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="Beauty Palace"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salon Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={salonLocation}
                  onChange={(e) => setSalonLocation(e.target.value)}
                  placeholder="Dubai Marina, UAE"
                  className="pl-10 h-12"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="salon@email.com"
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="pl-10 h-12"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 pr-10 h-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {mode === 'signup' && (
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
          )}
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 h-12"
                required
              />
            </div>
          </div>
        )}

        {mode === 'signin' && (
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-purple-600 hover:text-purple-700"
              onClick={() => toast.info('Password reset feature coming soon!')}
            >
              Forgot password?
            </button>
          </div>
        )}

        {mode === 'signup' && (
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-gray-300 mt-1"
            />
            <span className="text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
            </span>
          </label>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
            </div>
          ) : (
            mode === 'signup' ? 'Register Salon' : 'Sign In'
          )}
        </Button>
      </form>

      {/* Pricing Note for Signup */}
      {mode === 'signup' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            🎉 Start with a <strong>14-day free trial</strong> — no credit card required!
          </p>
        </div>
      )}
    </div>
  );
}
