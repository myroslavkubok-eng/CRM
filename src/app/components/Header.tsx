import { Link, useLocation } from 'react-router-dom';
import { User, Heart, Menu, LogIn, LogOut, DollarSign, Rss, HelpCircle, Building2, Calendar, Settings, Award } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { CurrencySelectorSimple } from './CurrencySelectorSimple';
import { SalonAuthModal } from './SalonAuthModal';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { useIsMobile } from './ui/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const logo = "/icons/logo.svg";

export function Header() {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const [isSalonAuthOpen, setIsSalonAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location.pathname === path;
  
  // Hide header on auth page
  if (location.pathname === '/auth' || location.pathname === '/salon-register') {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
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
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="mr-2 p-2"
            >
              <Menu className="w-6 h-6" />
            </Button>
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Katia Booking" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">Katia Booking</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/salons"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Menu className="w-4 h-4" />
              <span>Browse by Category</span>
            </Link>
            <Link
              to="/partner"
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              <Rss className="w-4 h-4" />
              <span>Become a Partner</span>
            </Link>
            <Link
              to="/feed"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Rss className="w-4 h-4" />
              <span>Feed</span>
            </Link>
            <Link
              to="/support"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </Link>
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <CurrencySelectorSimple />

            {/* Auth Section */}
            {loading ? (
              <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-md" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-purple-50">
                    <Avatar className="w-8 h-8 ring-2 ring-purple-200">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <Calendar className="w-4 h-4 mr-2" />
                      <div>
                        <div className="font-medium">My Dashboard</div>
                        <div className="text-xs text-gray-500">View bookings & rewards</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <Heart className="w-4 h-4 mr-2" />
                      <div>
                        <div className="font-medium">Favorites</div>
                        <div className="text-xs text-gray-500">Your saved salons</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <Award className="w-4 h-4 mr-2" />
                      <div>
                        <div className="font-medium">Rewards</div>
                        <div className="text-xs text-gray-500">Points & offers</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <LogIn className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Choose Login Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/auth?type=client" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      <div>
                        <div className="font-medium">Sign in as Client</div>
                        <div className="text-xs text-gray-500">Book appointments</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSalonAuthOpen(true)} className="cursor-pointer">
                    <Building2 className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">Sign in as Salon</div>
                      <div className="text-xs text-gray-500">Manage your business</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Salon Auth Modal */}
      <SalonAuthModal isOpen={isSalonAuthOpen} onClose={() => setIsSalonAuthOpen(false)} />
    </header>
  );
}