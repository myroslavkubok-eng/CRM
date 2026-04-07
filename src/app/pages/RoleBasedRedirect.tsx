import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { toast } from 'sonner';
import { 
  getAndClearRegistrationType, 
  getDashboardByEntityType,
  getRegisterPageByEntityType,
  EntityType 
} from '../../hooks/useRegistration';

export function RoleBasedRedirect() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/auth');
      return;
    }

    checkUserRoleAndRedirect();
  }, [user, authLoading]);

  /**
   * Проверяет, является ли пользователь супер-админом
   */
  const checkIsSuperAdmin = async (userId: string, email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('super_admins')
        .select('id, user_id')
        .ilike('email', email.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error('Error checking super admin:', error);
        return false;
      }

      if (data) {
        // Если нашли по email, но user_id пустой — обновляем
        if (!data.user_id) {
          await supabase
            .from('super_admins')
            .update({ user_id: userId })
            .eq('id', data.id);
        }
        return true;
      }

      // Если не нашли по email, пробуем по user_id
      const { data: dataByUserId, error: errorByUserId } = await supabase
        .from('super_admins')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (errorByUserId) {
        console.error('Error checking super admin by user_id:', errorByUserId);
        return false;
      }

      return !!dataByUserId;
    } catch (error) {
      console.error('Error checking super admin:', error);
      return false;
    }
  };

  const checkUserRoleAndRedirect = async () => {
    if (!user) return;

    try {
      setChecking(true);
      
      console.log('=== RoleBasedRedirect Debug ===');
      console.log('User ID:', user.id);
      console.log('User Email:', user.email);

      // 1. Проверяем супер-админа в БД
      const isSuperAdmin = await checkIsSuperAdmin(user.id, user.email || '');
      console.log('Is Super Admin:', isSuperAdmin);
      
      if (isSuperAdmin) {
        toast.success('Welcome back, Super Admin!');
        navigate('/superadmin');
        return;
      }

      // 2. Проверяем роль в салоне (owner, admin, master)
      const roleResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/salon-role/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const roleData = await roleResponse.json();
      console.log('Salon Role Data:', roleData);

      if (roleData.role) {
        // Пользователь имеет роль в салоне
        const role = roleData.role.role;
        
        switch (role) {
          case 'owner':
            toast.success('Welcome back! Redirecting to salon dashboard...');
            navigate('/owner');
            break;
          case 'admin':
            toast.success('Welcome back! Redirecting to admin dashboard...');
            navigate('/admin');
            break;
          case 'master':
            toast.success('Welcome back! Redirecting to master dashboard...');
            navigate('/master');
            break;
          default:
            navigate('/client');
        }
      } else {
        // 3. Нет роли — проверяем тип регистрации из localStorage
        const registrationType = getAndClearRegistrationType();
        console.log('Registration Type from localStorage:', registrationType);
        
        if (registrationType === 'salon') {
          // Новый салон → страница регистрации
          toast.info('Please complete your salon registration');
          navigate(getRegisterPageByEntityType('salon'));
        } else {
          // Клиент → клиентский дашборд
          toast.success('Welcome to Katia!');
          navigate(getDashboardByEntityType('client'));
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      toast.error('Failed to load your dashboard');
      
      // Fallback по типу из localStorage
      const registrationType = getAndClearRegistrationType();
      
      if (registrationType === 'salon') {
        navigate(getRegisterPageByEntityType('salon'));
      } else {
        navigate(getDashboardByEntityType('client'));
      }
    } finally {
      setChecking(false);
    }
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we set up your account</p>
        </div>
      </div>
    );
  }

  return null;
}