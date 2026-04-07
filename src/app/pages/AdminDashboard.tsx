import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SalonDashboard } from '../components/sideDashboard/SalonDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { User, Salon } from '../../types/roles';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  
  console.log('AdminDashboard render - isDemo:', isDemo, 'demo param:', searchParams.get('demo'));
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [currentSalonId, setCurrentSalonId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AdminDashboard useEffect - isDemo:', isDemo, 'authLoading:', authLoading, 'loading:', loading);
    
    if (isDemo) {
      // Demo mode - load mock data
      console.log('AdminDashboard - DEMO MODE DETECTED, calling loadDemoData()');
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
    console.log('Loading demo data for Admin Dashboard');
    // Mock admin user
    const mockUser: User = {
      id: 'demo-admin-id',
      email: 'admin@demo.com',
      firstName: 'Anna',
      lastName: 'Smith',
      role: 'admin',
      salonId: 'demo-salon-1',
      createdAt: new Date(),
    };

    // Mock salon
    const mockSalon: Salon = {
      id: 'demo-salon-1',
      name: 'Glamour Beauty Studio',
      address: '123 Main St, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      description: 'Premium beauty salon in the heart of Manhattan',
      ownerId: 'demo-owner-id',
      logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300',
      isPublished: true,
      createdAt: new Date(),
    };

    setCurrentUser(mockUser);
    setSalons([mockSalon]);
    setCurrentSalonId(mockSalon.id);
    setLoading(false);
    console.log('Demo data loaded successfully');
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
      console.log('Admin Dashboard - Role Data:', roleData);

      if (!roleData.role) {
        // No salon role found
        console.log('Admin Dashboard - No role found for user');
        toast.error('No salon access found. Please contact your salon owner.');
        navigate('/');
        return;
      }

      // Check if user is admin
      if (roleData.role.role !== 'admin') {
        console.log('Admin Dashboard - User is not admin, role:', roleData.role.role);
        toast.error('Access denied. Admin access required.');
        navigate('/redirect');
        return;
      }

      // Set current user
      const userData: User = {
        id: user.id,
        email: user.email || '',
        firstName: roleData.role.firstName || user.user_metadata?.full_name?.split(' ')[0] || 'Admin',
        lastName: roleData.role.lastName || user.user_metadata?.full_name?.split(' ')[1] || '',
        role: 'admin',
        salonId: roleData.role.salonId,
        createdAt: new Date(user.created_at),
      };

      setCurrentUser(userData);
      console.log('Admin Dashboard - User data set:', userData);

      // Get salon data for this admin
      const salonResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/salon/${roleData.role.salonId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const salonData = await salonResponse.json();
      console.log('Admin Dashboard - Salon Data:', salonData);

      if (salonData.salon) {
        setSalons([salonData.salon]);
        setCurrentSalonId(salonData.salon.id);
        console.log('Admin Dashboard - Salon loaded successfully');
      } else {
        console.log('Admin Dashboard - No salon found in response');
        toast.error('Salon not found.');
        navigate('/');
      }
    } catch (error) {
      console.error('Admin Dashboard - Error loading admin data:', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSalonChange = (salonId: string) => {
    // Admin can only work with their assigned salon
    setCurrentSalonId(salonId);
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
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || salons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No salon access found</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go Home
          </button>
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
      onLogout={handleLogout}
      isDemo={isDemo}
    />
  );
}