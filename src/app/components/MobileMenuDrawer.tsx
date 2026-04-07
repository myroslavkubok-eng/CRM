import { Link, useLocation } from 'react-router-dom';
import { X, Home, Building2, Rss, HelpCircle, User, Calendar, LogIn, LogOut, Award, Settings, Download, Smartphone, Share } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { promptInstall, canInstall, isStandalone, getPlatform } from '../../utils/pwaUtils';
import { useState } from 'react';

const logo = "/icons/logo.svg";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [platform, setPlatform] = useState(getPlatform());
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  // Handle PWA Install
  const handleInstall = async () => {
    // iOS - show instructions
    if (platform === 'ios') {
      setShowIOSInstructions(true);
      return;
    }

    // Android/Desktop - try browser prompt
    if (canInstall()) {
      const installed = await promptInstall();
      if (installed) {
        onClose();
      }
    } else {
      // If prompt not available, show fallback instructions
      alert(
        '📱 To install Katia:\n\n' +
        '1. Open browser menu (⋮)\n' +
        '2. Tap "Add to Home screen"\n' +
        '3. Tap "Add"\n\n' +
        'Then launch from your home screen!'
      );
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/salons', icon: Building2, label: 'Browse Salons' },
    { path: '/feed', icon: Rss, label: 'Beauty Feed' },
    { path: '/partner', icon: Award, label: 'Become Partner' },
    { path: '/support', icon: HelpCircle, label: 'Support' },
  ];

  const userMenuItems = user ? [
    { path: '/dashboard', icon: Calendar, label: 'My Dashboard' },
    { path: '/client', icon: User, label: 'My Profile' },
  ] : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[70]
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          shadow-2xl overflow-y-auto
        `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <img src={logo} alt="Katia" className="w-10 h-10 rounded-xl" />
              <span className="font-bold text-lg">Katia Booking</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-white">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-white/20 text-white font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{getUserDisplayName()}</p>
                <p className="text-sm text-white/80 truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-white/90">
              Sign in to access more features
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="p-4">
          {/* User Menu Items */}
          {userMenuItems.length > 0 && (
            <>
              <div className="space-y-1">
                {userMenuItems.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${isActive(path)
                        ? 'bg-purple-50 text-purple-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
              <Separator className="my-4" />
            </>
          )}

          {/* Main Menu Items */}
          <div className="space-y-1">
            {menuItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive(path)
                    ? 'bg-purple-50 text-purple-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Auth Buttons */}
          <div className="space-y-2">
            {user ? (
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
            ) : (
              <>
                <Link to="/auth" onClick={onClose}>
                  <Button className="w-full justify-start gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <LogIn className="w-5 h-5" />
                    Sign In / Sign Up
                  </Button>
                </Link>
                <Link to="/partner" onClick={onClose}>
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Award className="w-5 h-5" />
                    Register Your Salon
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Install App Button - Show only if not installed */}
          {!isStandalone() && (
            <>
              <Separator className="my-4" />
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">Install Katia App</h4>
                    <p className="text-xs text-gray-600">Fast, offline, instant access</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                    <span>⚡ Lightning fast loading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                    <span>📱 Works offline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                    <span>🔔 Push notifications</span>
                  </div>
                </div>
                <Button
                  onClick={handleInstall}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install Now
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-200 mt-4">
          <p>© 2025 Katia Booking</p>
          <p className="mt-1">Beauty at your fingertips</p>
        </div>
      </div>
    </>
  );
}