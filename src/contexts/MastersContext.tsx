import { createContext, useContext, useState, ReactNode } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

export interface WorkingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isWorking: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface Vacation {
  id: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
}

export interface ExtraWorkDay {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export interface Master {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar?: string;
  role: 'master' | 'admin'; // Master or Admin role
  categories: string[]; // Categories the master works in
  services: string[]; // Specific service IDs the master can perform
  workingHours: WorkingHours[];
  daysOff: string[]; // Days of week: ['monday', 'sunday']
  vacations: Vacation[];
  extraWorkDays: ExtraWorkDay[];
  rating?: number;
  completedBookings?: number;
  revenue?: number;
  // Financial fields
  baseSalary: number; // Fixed monthly salary
  monthlyTarget: number; // Target revenue for the month
  currentRevenue: number; // Current revenue for the month
  bonusType: 'percentage' | 'fixed'; // Type of bonus when target is achieved
  bonusValue: number; // Percentage (e.g., 10 for 10%) or fixed amount (e.g., 500)
}

interface MastersContextType {
  masters: Master[];
  addMaster: (master: Master) => void;
  updateMaster: (master: Master) => void;
  deleteMaster: (id: string) => void;
  getMasterById: (id: string) => Master | undefined;
  getMastersByCategory: (category: string) => Master[];
  getMastersByService: (serviceId: string) => Master[];
  isMasterAvailable: (masterId: string, date: Date) => boolean;
  getMasterWorkingHours: (masterId: string, date: Date) => { startTime: string; endTime: string } | null;
  loadMasters: (salonId: string) => Promise<void>;
  registerMaster: (masterData: any, salonId: string, invitedBy: string) => Promise<{ success: boolean; error?: string; masterId?: string }>;
  isLoading: boolean;
}

const MastersContext = createContext<MastersContextType | undefined>(undefined);

export function MastersProvider({ children }: { children: ReactNode }) {
  const [masters, setMasters] = useState<Master[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load masters from database
  const loadMasters = async (salonId: string) => {
    if (!salonId) {
      console.warn('loadMasters: No salonId provided');
      return;
    }
    
    setIsLoading(true);
    try {
      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/salon/${salonId}/masters`;
      console.log('Loading masters from:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      // Handle 404 - salon might not have masters yet, return empty array
      if (response.status === 404) {
        console.log('No masters found for salon (404), returning empty array');
        setMasters([]);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to load masters: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If not JSON, use the text
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Masters data received:', data);
      
      // Handle case when API returns error in response
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Transform database format to Master format
      const loadedMasters: Master[] = (data.masters || []).map((m: any) => ({
        id: m.id,
        firstName: m.firstName || '',
        lastName: m.lastName || '',
        phone: m.phone || '',
        email: m.email || '',
        avatar: m.avatar,
        role: m.role || 'master',
        categories: m.categories || [],
        services: m.services || [],
        workingHours: m.workingHours || [],
        daysOff: m.daysOff || [],
        vacations: (m.vacations || []).map((v: any) => ({
          id: v.id || Date.now().toString(),
          startDate: v.startDate ? new Date(v.startDate) : new Date(),
          endDate: v.endDate ? new Date(v.endDate) : new Date(),
          reason: v.reason || '',
        })),
        extraWorkDays: (m.extraWorkDays || []).map((e: any) => ({
          id: e.id || Date.now().toString(),
          date: e.date ? new Date(e.date) : new Date(),
          startTime: e.startTime || '09:00',
          endTime: e.endTime || '18:00',
        })),
        rating: m.rating || 0,
        completedBookings: m.completedBookings || 0,
        revenue: m.revenue || 0,
        baseSalary: m.baseSalary || 0,
        monthlyTarget: m.monthlyTarget || 0,
        currentRevenue: m.currentRevenue || 0,
        bonusType: m.bonusType || 'percentage',
        bonusValue: m.bonusValue || 0,
      }));

      console.log(`Loaded ${loadedMasters.length} masters`);
      setMasters(loadedMasters);
    } catch (error) {
      console.error('Error loading masters:', error);
      // Set empty array on error to avoid showing stale data
      setMasters([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with demo data if no masters loaded
  const [initialized, setInitialized] = useState(false);
  if (!initialized && masters.length === 0) {
    setInitialized(true);
    setMasters([
    {
      id: '1',
      firstName: 'Anna',
      lastName: 'Kowalska',
      phone: '+48 123 456 789',
      email: 'anna.kowalska@salon.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      role: 'master',
      categories: ['Manicure', 'Pedicure'],
      services: ['3', '4'], // Manicure, Pedicure service IDs
      workingHours: [
        { day: 'monday', isWorking: true, startTime: '09:00', endTime: '18:00' },
        { day: 'tuesday', isWorking: true, startTime: '09:00', endTime: '18:00' },
        { day: 'wednesday', isWorking: true, startTime: '09:00', endTime: '18:00' },
        { day: 'thursday', isWorking: true, startTime: '09:00', endTime: '18:00' },
        { day: 'friday', isWorking: true, startTime: '09:00', endTime: '18:00' },
        { day: 'saturday', isWorking: true, startTime: '10:00', endTime: '16:00' },
        { day: 'sunday', isWorking: false, startTime: '00:00', endTime: '00:00' },
      ],
      daysOff: ['sunday'],
      vacations: [],
      extraWorkDays: [],
      rating: 4.9,
      completedBookings: 245,
      revenue: 12450,
      baseSalary: 3000,
      monthlyTarget: 15000,
      currentRevenue: 12450,
      bonusType: 'percentage',
      bonusValue: 10
    },
    {
      id: '2',
      firstName: 'Maria',
      lastName: 'Nowak',
      phone: '+48 987 654 321',
      email: 'maria.nowak@salon.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      role: 'master',
      categories: ['Hair stylist', 'Make up'],
      services: ['1', '5', '11'], // Haircut, Full Color, Makeup
      workingHours: [
        { day: 'monday', isWorking: true, startTime: '10:00', endTime: '19:00' },
        { day: 'tuesday', isWorking: true, startTime: '10:00', endTime: '19:00' },
        { day: 'wednesday', isWorking: true, startTime: '10:00', endTime: '19:00' },
        { day: 'thursday', isWorking: true, startTime: '10:00', endTime: '19:00' },
        { day: 'friday', isWorking: true, startTime: '10:00', endTime: '19:00' },
        { day: 'saturday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'sunday', isWorking: false, startTime: '00:00', endTime: '00:00' },
      ],
      daysOff: ['sunday'],
      vacations: [],
      extraWorkDays: [],
      rating: 4.8,
      completedBookings: 189,
      revenue: 10230,
      baseSalary: 3500,
      monthlyTarget: 16000,
      currentRevenue: 10230,
      bonusType: 'percentage',
      bonusValue: 10
    },
    {
      id: '3',
      firstName: 'Ewa',
      lastName: 'Wiśniewska',
      phone: '+48 555 123 456',
      email: 'ewa.wisniewska@salon.com',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      role: 'master',
      categories: ['Eyelashes', 'Brow'],
      services: ['7', '9'], // Eyelash Extensions, Eyebrow Shaping
      workingHours: [
        { day: 'monday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'tuesday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'wednesday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'thursday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'friday', isWorking: true, startTime: '09:00', endTime: '17:00' },
        { day: 'saturday', isWorking: false, startTime: '00:00', endTime: '00:00' },
        { day: 'sunday', isWorking: false, startTime: '00:00', endTime: '00:00' },
      ],
      daysOff: ['saturday', 'sunday'],
      vacations: [],
      extraWorkDays: [],
      rating: 5.0,
      completedBookings: 312,
      revenue: 15600,
      baseSalary: 4000,
      monthlyTarget: 17000,
      currentRevenue: 15600,
      bonusType: 'percentage',
      bonusValue: 10
    }
    ]);
  }

  const addMaster = (master: Master) => {
    setMasters([...masters, master]);
  };

  const updateMaster = (updatedMaster: Master) => {
    setMasters(masters.map(master => 
      master.id === updatedMaster.id ? updatedMaster : master
    ));
  };

  const deleteMaster = (id: string) => {
    setMasters(masters.filter(master => master.id !== id));
  };

  const getMasterById = (id: string) => {
    return masters.find(master => master.id === id);
  };

  const getMastersByCategory = (category: string) => {
    return masters.filter(master => master.categories.includes(category));
  };

  const getMastersByService = (serviceId: string) => {
    return masters.filter(master => master.services.includes(serviceId));
  };

  const isMasterAvailable = (masterId: string, date: Date): boolean => {
    const master = getMasterById(masterId);
    if (!master) return false;

    // Check if date is in vacation period
    const isOnVacation = master.vacations.some(vacation => {
      const vacationStart = new Date(vacation.startDate);
      const vacationEnd = new Date(vacation.endDate);
      return date >= vacationStart && date <= vacationEnd;
    });

    if (isOnVacation) return false;

    // Get day of week
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];

    // Check if it's an extra work day
    const hasExtraWorkDay = master.extraWorkDays.some(extraDay => {
      const extraDate = new Date(extraDay.date);
      return extraDate.toDateString() === date.toDateString();
    });

    if (hasExtraWorkDay) return true;

    // Check if it's a regular working day
    const workingDay = master.workingHours.find(wh => wh.day === dayOfWeek);
    return workingDay ? workingDay.isWorking : false;
  };

  const getMasterWorkingHours = (masterId: string, date: Date): { startTime: string; endTime: string } | null => {
    const master = getMasterById(masterId);
    if (!master || !isMasterAvailable(masterId, date)) return null;

    // Check for extra work day first
    const extraWorkDay = master.extraWorkDays.find(extraDay => {
      const extraDate = new Date(extraDay.date);
      return extraDate.toDateString() === date.toDateString();
    });

    if (extraWorkDay) {
      return {
        startTime: extraWorkDay.startTime,
        endTime: extraWorkDay.endTime
      };
    }

    // Get regular working hours
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
    const workingDay = master.workingHours.find(wh => wh.day === dayOfWeek);

    if (workingDay && workingDay.isWorking) {
      return {
        startTime: workingDay.startTime,
        endTime: workingDay.endTime
      };
    }

    return null;
  };

  // Register master through API
  const registerMaster = async (
    masterData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
      categories: string[];
      services: string[];
      workingHours: WorkingHours[];
      daysOff: string[];
      vacations: Vacation[];
      extraWorkDays: ExtraWorkDay[];
      baseSalary: number;
      monthlyTarget: number;
      bonusType: 'percentage' | 'fixed';
      bonusValue: number;
    },
    salonId: string,
    invitedBy: string
  ): Promise<{ success: boolean; error?: string; masterId?: string }> => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!masterData.firstName || !masterData.lastName || !masterData.email || !masterData.password) {
        throw new Error('Missing required fields: firstName, lastName, email, and password are required');
      }

      if (!salonId || !invitedBy) {
        throw new Error('Missing salon ID or inviter information');
      }

      if (!projectId || !publicAnonKey) {
        throw new Error('Configuration error: Supabase credentials are missing');
      }

      // Prepare request body with proper date serialization
      const requestBody = {
        firstName: masterData.firstName.trim(),
        lastName: masterData.lastName.trim(),
        email: masterData.email.trim(),
        phone: masterData.phone?.trim() || '',
        password: masterData.password,
        salonId,
        invitedBy,
        categories: masterData.categories || [],
        services: masterData.services || [],
        workingHours: masterData.workingHours || [],
        daysOff: masterData.daysOff || [],
        vacations: (masterData.vacations || []).map(v => ({
          id: v.id || Date.now().toString(),
          startDate: v.startDate instanceof Date ? v.startDate.toISOString() : (typeof v.startDate === 'string' ? v.startDate : new Date(v.startDate).toISOString()),
          endDate: v.endDate instanceof Date ? v.endDate.toISOString() : (typeof v.endDate === 'string' ? v.endDate : new Date(v.endDate).toISOString()),
          reason: v.reason || ''
        })),
        extraWorkDays: (masterData.extraWorkDays || []).map(e => ({
          id: e.id || Date.now().toString(),
          date: e.date instanceof Date ? e.date.toISOString() : (typeof e.date === 'string' ? e.date : new Date(e.date).toISOString()),
          startTime: e.startTime || '09:00',
          endTime: e.endTime || '18:00'
        })),
        baseSalary: masterData.baseSalary || 0,
        monthlyTarget: masterData.monthlyTarget || 0,
        bonusType: masterData.bonusType || 'percentage',
        bonusValue: masterData.bonusValue || 0
      };

      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/register/master`;
      console.log('Registering master:', {
        url: apiUrl,
        data: { ...requestBody, password: '***' }
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to register master');
      }

      // Reload masters from database
      await loadMasters(salonId);

      return {
        success: true,
        masterId: data.data?.user_id
      };
    } catch (error) {
      console.error('Error registering master:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to register master. Please check your connection and try again.';
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MastersContext.Provider
      value={{
        masters,
        addMaster,
        updateMaster,
        deleteMaster,
        getMasterById,
        getMastersByCategory,
        getMastersByService,
        isMasterAvailable,
        getMasterWorkingHours,
        loadMasters,
        registerMaster,
        isLoading
      }}
    >
      {children}
    </MastersContext.Provider>
  );
}

export function useMasters() {
  const context = useContext(MastersContext);
  if (context === undefined) {
    throw new Error('useMasters must be used within a MastersProvider');
  }
  return context;
}