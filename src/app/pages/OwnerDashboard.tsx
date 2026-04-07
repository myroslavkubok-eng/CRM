import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SalonDashboard } from '../components/sideDashboard/SalonDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { User, Salon } from '../../types/roles';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export function OwnerDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  
  console.log('OwnerDashboard render - isDemo:', isDemo, 'demo param:', searchParams.get('demo'));
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [currentSalonId, setCurrentSalonId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('OwnerDashboard useEffect - isDemo:', isDemo, 'authLoading:', authLoading, 'loading:', loading);
    
    if (isDemo) {
      // Demo mode - load mock data
      console.log('OwnerDashboard - DEMO MODE DETECTED, calling loadDemoData()');
      loadDemoData();
      return;
    }

    if (authLoading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }

    loadUserData();
  }, [isDemo, authLoading, user]);

  const loadDemoData = () => {
    console.log('Loading demo data for Owner Dashboard');
    // Mock owner user
    const mockUser: User = {
      id: 'demo-owner-id',
      email: 'owner@demo.com',
      firstName: 'Maria',
      lastName: 'Johnson',
      role: 'owner',
      salonId: 'demo-salon-1',
      createdAt: new Date(),
    };

    // Mock multiple salons for owner
    const mockSalons: Salon[] = [
      {
        id: 'demo-salon-1',
        name: 'Glamour Beauty Studio',
        address: '123 Main St, New York, NY 10001',
        phone: '+1 (555) 123-4567',
        description: 'Premium beauty salon in the heart of Manhattan',
        ownerId: 'demo-owner-id',
        logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300',
        isPublished: true,
        createdAt: new Date(),
      },
      {
        id: 'demo-salon-2',
        name: 'Elegance Spa & Beauty',
        address: '456 Park Ave, Brooklyn, NY 11201',
        phone: '+1 (555) 987-6543',
        description: 'Luxury spa and beauty services',
        ownerId: 'demo-owner-id',
        logo: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=300',
        isPublished: true,
        createdAt: new Date(),
      },
    ];

    setCurrentUser(mockUser);
    setSalons(mockSalons);
    setCurrentSalonId(mockSalons[0].id);
    setLoading(false);
    console.log('Demo data loaded successfully - Owner has', mockSalons.length, 'salons');
  };

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get user role data
      const roleResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/salon-role/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const roleData = await roleResponse.json();

      if (!roleData.role) {
        // No salon role found - redirect to become partner
        toast.error('No salon found. Please register your salon first.');
        navigate('/become-partner');
        return;
      }

      // Check if user is owner
      if (roleData.role.role !== 'owner') {
        toast.error('Access denied. Owner access required.');
        navigate('/dashboard');
        return;
      }

      // Set current user
      const userData: User = {
        id: user.id,
        email: user.email || '',
        firstName: roleData.role.firstName || user.user_metadata?.full_name?.split(' ')[0] || 'Owner',
        lastName: roleData.role.lastName || user.user_metadata?.full_name?.split(' ')[1] || '',
        role: 'owner',
        salonId: roleData.role.salonId,
        createdAt: new Date(user.created_at),
      };

      setCurrentUser(userData);

      // Get all salons for this owner
      const salonsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/owner/${user.id}/salons`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const salonsData = await salonsResponse.json();

      if (salonsData.salons && salonsData.salons.length > 0) {
        setSalons(salonsData.salons);
        setCurrentSalonId(salonsData.salons[0].id);
      } else {
        // No salon found - create from onboarding or redirect
        toast.error('No salon found. Please complete salon setup.');
        navigate('/pricing');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load salon data');
    } finally {
      setLoading(false);
    }
  };

  const handleSalonChange = (salonId: string) => {
    setCurrentSalonId(salonId);
  };

  const handleAddSalon = () => {
    // Navigate to pricing to add a new salon
    navigate('/pricing');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // In demo mode, skip auth loading check
  if (!isDemo && authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your salon dashboard...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your salon dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || salons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No salon found</p>
        </div>
      </div>
    );
  }

  return (
    <SalonDashboard
      currentUser={currentUser}
      salons={salons}
      currentSalonId={currentSalonId}
      onSalonChange={handleSalonChange}
      onAddSalon={handleAddSalon}
      onLogout={handleLogout}
      isDemo={isDemo}
    />
  );
}