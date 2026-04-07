import type { User, Salon } from '../../../types/roles';

export interface SalonDashboardProps {
  currentUser: User;
  salons: Salon[];
  currentSalonId: string;
  onSalonChange: (salonId: string) => void;
  onAddSalon?: () => void;
  onLogout: () => void;
  isDemo?: boolean;
}

export interface SidebarProps {
  currentUser: User;
  salons: Salon[];
  currentSalonId: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSalonChange: (salonId: string) => void;
  onAddSalon?: () => void;
  onLogout: () => void;
}

export interface TabProps {
  currentUser: User;
  currentSalon: Salon | undefined;
  isDemo?: boolean;
}
