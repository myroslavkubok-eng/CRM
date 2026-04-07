import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Типы сущностей для регистрации
export type EntityType = 'client' | 'salon' | 'master' | 'admin';

// Данные для регистрации
export interface RegistrationData {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  // Дополнительные поля для салона
  salonName?: string;
  salonLocation?: string;
}

// Результат регистрации
export interface RegistrationResult {
  success: boolean;
  userId?: string;
  error?: string;
}

// Состояние хука
interface UseRegistrationState {
  isLoading: boolean;
  error: string | null;
}

// Ключи для localStorage
const REGISTRATION_TYPE_KEY = 'auth_registration_type';
const REGISTRATION_DATA_KEY = 'auth_registration_data';

/**
 * Сохраняет тип регистрации в localStorage
 */
export const saveRegistrationType = (type: EntityType) => {
  localStorage.setItem(REGISTRATION_TYPE_KEY, type);
};

/**
 * Получает и очищает тип регистрации из localStorage
 */
export const getAndClearRegistrationType = (): EntityType => {
  const type = localStorage.getItem(REGISTRATION_TYPE_KEY) as EntityType | null;
  localStorage.removeItem(REGISTRATION_TYPE_KEY);
  return type || 'client';
};

/**
 * Сохраняет дополнительные данные регистрации
 */
export const saveRegistrationData = (data: Partial<RegistrationData>) => {
  localStorage.setItem(REGISTRATION_DATA_KEY, JSON.stringify(data));
};

/**
 * Получает и очищает данные регистрации
 */
export const getAndClearRegistrationData = (): Partial<RegistrationData> | null => {
  const data = localStorage.getItem(REGISTRATION_DATA_KEY);
  localStorage.removeItem(REGISTRATION_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Получает URL для OAuth редиректа
 */
const getOAuthRedirectUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost';
  
  if (isLocalhost) {
    const basePath = window.location.pathname.replace(/\/$/, '');
    return `${window.location.origin}${basePath}/#/redirect`;
  }
  
  return 'https://katiabooking.github.io/Katiabooking/#/redirect';
};

/**
 * Определяет dashboard URL по типу сущности
 */
export const getDashboardByEntityType = (entityType: EntityType): string => {
  switch (entityType) {
    case 'salon':
      return '/owner';
    case 'master':
      return '/master';
    case 'admin':
      return '/admin';
    case 'client':
    default:
      return '/client';
  }
};

/**
 * Определяет страницу регистрации по типу сущности
 */
export const getRegisterPageByEntityType = (entityType: EntityType): string => {
  switch (entityType) {
    case 'salon':
      return '/register';
    case 'client':
    default:
      return '/auth';
  }
};

/**
 * Универсальный хук для регистрации пользователей
 */
export function useRegistration() {
  const [state, setState] = useState<UseRegistrationState>({
    isLoading: false,
    error: null,
  });

  /**
   * Регистрация через Email/Password
   */
  const registerWithEmail = async (
    entityType: EntityType,
    data: RegistrationData
  ): Promise<RegistrationResult> => {
    setState({ isLoading: true, error: null });

    try {
      // Сохраняем тип для последующего редиректа
      saveRegistrationType(entityType);
      
      // Сохраняем дополнительные данные (для салона)
      if (entityType === 'salon' && (data.salonName || data.salonLocation)) {
        saveRegistrationData({
          salonName: data.salonName,
          salonLocation: data.salonLocation,
        });
      }

      // Регистрация в Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || '',
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            entity_type: entityType,
            salon_name: data.salonName,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User was not created');
      }

      setState({ isLoading: false, error: null });
      
      return {
        success: true,
        userId: authData.user.id,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState({ isLoading: false, error: errorMessage });
      toast.error(`Registration failed: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Регистрация/Вход через Google
   */
  const registerWithGoogle = async (entityType: EntityType): Promise<{ error: AuthError | null }> => {
    setState({ isLoading: true, error: null });

    try {
      // Сохраняем тип для редиректа после OAuth
      saveRegistrationType(entityType);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getOAuthRedirectUrl(),
        },
      });

      if (error) {
        setState({ isLoading: false, error: error.message });
        toast.error(`Google sign in failed: ${error.message}`);
      }

      return { error };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign in failed';
      setState({ isLoading: false, error: errorMessage });
      return { error: error as AuthError };
    }
  };

  /**
   * Регистрация/Вход через Facebook
   */
  const registerWithFacebook = async (entityType: EntityType): Promise<{ error: AuthError | null }> => {
    setState({ isLoading: true, error: null });

    try {
      // Сохраняем тип для редиректа после OAuth
      saveRegistrationType(entityType);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: getOAuthRedirectUrl(),
        },
      });

      if (error) {
        setState({ isLoading: false, error: error.message });
        toast.error(`Facebook sign in failed: ${error.message}`);
      }

      return { error };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Facebook sign in failed';
      setState({ isLoading: false, error: errorMessage });
      return { error: error as AuthError };
    }
  };

  /**
   * Вход через Email/Password (для существующих пользователей)
   */
  const signInWithEmail = async (
    email: string,
    password: string,
    entityType: EntityType = 'client'
  ): Promise<RegistrationResult> => {
    setState({ isLoading: true, error: null });

    try {
      // Сохраняем тип для редиректа
      saveRegistrationType(entityType);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setState({ isLoading: false, error: null });
      
      return {
        success: true,
        userId: data.user?.id,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setState({ isLoading: false, error: errorMessage });
      toast.error(`Sign in failed: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Сброс состояния ошибки
   */
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    // Состояние
    isLoading: state.isLoading,
    error: state.error,
    
    // Методы регистрации
    registerWithEmail,
    registerWithGoogle,
    registerWithFacebook,
    signInWithEmail,
    
    // Утилиты
    clearError,
  };
}
