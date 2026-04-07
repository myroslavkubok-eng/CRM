import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User, Heart, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from './ui/use-mobile';

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Hide on desktop or specific pages
  if (!isMobile || 
      location.pathname === '/auth' || 
      location.pathname === '/register' ||
      location.pathname.startsWith('/owner') ||
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/master') ||
      location.pathname.startsWith('/superadmin')) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
      show: true
    },
    {
      path: '/salons',
      icon: Building2,
      label: 'Salons',
      show: true
    },
    {
      path: '/feed',
      icon: Search,
      label: 'Feed',
      show: true
    },
    {
      path: user ? '/dashboard' : '/auth',
      icon: user ? Calendar : User,
      label: user ? 'Dashboard' : 'Login',
      show: true
    }
  ].filter(item => item.show);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg
                transition-all duration-200 min-w-[4rem]
                ${active 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }
              `}
            >
              <Icon 
                className={`w-5 h-5 ${active ? 'scale-110' : ''}`} 
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
