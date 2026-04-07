export type UserRole = 'owner' | 'admin' | 'master';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  salonId: string;
  photo?: string;
  phone?: string;
  services?: string[]; // For masters - list of service IDs they can perform
  createdAt: Date;
  lastLogin?: Date;
}

export interface Salon {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
  logo?: string;
  cover?: string;
  photos: string[];
  ownerId: string;
  plan?: 'starter' | 'professional' | 'business'; // Subscription plan
  billingPeriod?: 'monthly' | 'semi-annual' | 'annual'; // Billing period
  subscriptionStatus?: 'active' | 'trial' | 'expired'; // Subscription status
  services: Service[];
  staff: User[];
  isPublished?: boolean; // Whether salon is visible to clients
  publishedAt?: string | null; // When salon was published
  createdAt: Date;
}

export interface Service {
  id: string;
  category: string;
  name: string;
  price: { [currency: string]: number };
  duration: number;
  description: string;
  masterId?: string; // Optional - specific master for this service
}

export interface Booking {
  id: string;
  salonId: string;
  clientId: string;
  masterId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Hidden from masters
  salonId: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit?: Date;
  notes?: string;
  createdAt: Date;
}

export const PERMISSIONS = {
  owner: {
    canViewAllSalons: true,
    canEditSalonDetails: true,
    canAddStaff: true,
    canRemoveStaff: true,
    canViewClientPhone: true,
    canEditBookings: true,
    canExportData: true,
    canImportData: true,
    canViewAnalytics: true,
    canManageServices: true,
    canManageMarketing: true,
    canAccessAI: true,
    canViewMasterTargets: true,
    canViewMasterSalaries: true, // Only owner can view salaries
    canManageProducts: true,
    canManageBeautyFeed: true,
    requiresOwnerApproval: false, // Owner doesn't need approval
  },
  admin: {
    canViewAllSalons: false,
    canEditSalonDetails: false, // Admin cannot edit salon details
    canAddStaff: false,
    canRemoveStaff: false,
    canViewClientPhone: true, // Admin CAN view client phones
    canEditBookings: true, // Admin CAN edit bookings and receive payments
    canExportData: false, // Admin CANNOT download/export client data
    canImportData: false,
    canViewAnalytics: true,
    canManageServices: true, // Can manage but requires owner approval
    canManageMarketing: true,
    canAccessAI: true,
    canViewMasterTargets: true, // Can view targets
    canViewMasterSalaries: false, // CANNOT view salaries
    canManageProducts: true, // Can manage but requires owner approval
    canManageBeautyFeed: true, // Full access to beauty feed
    requiresOwnerApproval: true, // Admin changes require owner approval for services/products
  },
  master: {
    canViewAllSalons: false,
    canEditSalonDetails: false,
    canAddStaff: false,
    canRemoveStaff: false,
    canViewClientPhone: false,
    canEditBookings: false,
    canExportData: false,
    canImportData: false,
    canViewAnalytics: false,
    canManageServices: false,
    canManageMarketing: false,
    canAccessAI: false,
    canViewMasterTargets: false, // Masters can only view their own targets
    canViewMasterSalaries: false,
    canManageProducts: false,
    canManageBeautyFeed: false,
    requiresOwnerApproval: false,
  },
};

export function hasPermission(role: UserRole, permission: keyof typeof PERMISSIONS.owner): boolean {
  return PERMISSIONS[role][permission];
}