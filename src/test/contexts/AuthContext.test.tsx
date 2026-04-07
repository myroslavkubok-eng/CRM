import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AuthProvider - Initial State', () => {
    it('должен инициализироваться с loading = true', () => {
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.loading).toBe(true);
    });

    it('должен загрузить сессию при монтировании', async () => {
      const mockSession = {
        user: { id: '123', email: 'test@example.com' },
        access_token: 'token',
      };

      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: mockSession }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.session).toEqual(mockSession);
      expect(result.current.user).toEqual(mockSession.user);
    });

    it('должен обработать отсутствие сессии', async () => {
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.session).toBeNull();
      expect(result.current.user).toBeNull();
    });
  });

  describe('signInWithEmail', () => {
    it('должен успешно войти с валидными credentials', async () => {
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));
      const mockSignIn = vi.fn(() => Promise.resolve({ error: null }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;
      (supabase.auth.signInWithPassword as any) = mockSignIn;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response;
      await act(async () => {
        response = await result.current.signInWithEmail('test@example.com', 'password123');
      });

      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(response?.error).toBeNull();
    });

    it('должен вернуть ошибку при неверных credentials', async () => {
      const mockError = { message: 'Invalid credentials' };
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));
      const mockSignIn = vi.fn(() => Promise.resolve({ error: mockError }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;
      (supabase.auth.signInWithPassword as any) = mockSignIn;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response;
      await act(async () => {
        response = await result.current.signInWithEmail('wrong@example.com', 'wrongpass');
      });

      expect(response?.error).toEqual(mockError);
    });

    it('должен обработать пустые поля email/password', async () => {
      const mockError = { message: 'Email and password required' };
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));
      const mockSignIn = vi.fn(() => Promise.resolve({ error: mockError }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;
      (supabase.auth.signInWithPassword as any) = mockSignIn;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response;
      await act(async () => {
        response = await result.current.signInWithEmail('', '');
      });

      expect(response?.error).toBeTruthy();
    });
  });

  describe('signUpWithEmail', () => {
    it('должен успешно зарегистрировать нового пользователя', async () => {
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));
      const mockSignUp = vi.fn(() => Promise.resolve({ error: null }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;
      (supabase.auth.signUp as any) = mockSignUp;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response;
      await act(async () => {
        response = await result.current.signUpWithEmail(
          'newuser@example.com',
          'password123',
          'John Doe'
        );
      });

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'John Doe',
          },
        },
      });
      expect(response?.error).toBeNull();
    });

    it('должен вернуть ошибку если пользователь уже существует', async () => {
      const mockError = { message: 'User already exists' };
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));
      const mockSignUp = vi.fn(() => Promise.resolve({ error: mockError }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;
      (supabase.auth.signUp as any) = mockSignUp;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response;
      await act(async () => {
        response = await result.current.signUpWithEmail(
          'existing@example.com',
          'password123',
          'Jane Doe'
        );
      });

      expect(response?.error).toEqual(mockError);
    });

    it('должен сохранить full_name в user metadata', async () => {
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));
      const mockSignUp = vi.fn(() => Promise.resolve({ error: null }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;
      (supabase.auth.signUp as any) = mockSignUp;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signUpWithEmail('user@example.com', 'pass123', 'Test User');
      });

      expect(mockSignUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: {
            data: {
              full_name: 'Test User',
            },
          },
        })
      );
    });
  });

  describe('signInWithGoogle', () => {
    it('должен инициировать Google OAuth flow', async () => {
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));
      const mockSignInWithOAuth = vi.fn(() => Promise.resolve({ error: null }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;
      (supabase.auth.signInWithOAuth as any) = mockSignInWithOAuth;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response;
      await act(async () => {
        response = await result.current.signInWithGoogle();
      });

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      expect(response?.error).toBeNull();
    });

    it('должен обработать ошибку Google OAuth', async () => {
      const mockError = { message: 'OAuth failed' };
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));
      const mockSignInWithOAuth = vi.fn(() => Promise.resolve({ error: mockError }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;
      (supabase.auth.signInWithOAuth as any) = mockSignInWithOAuth;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response;
      await act(async () => {
        response = await result.current.signInWithGoogle();
      });

      expect(response?.error).toEqual(mockError);
    });
  });

  describe('signInWithFacebook', () => {
    it('должен инициировать Facebook OAuth flow', async () => {
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));
      const mockSignInWithOAuth = vi.fn(() => Promise.resolve({ error: null }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;
      (supabase.auth.signInWithOAuth as any) = mockSignInWithOAuth;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response;
      await act(async () => {
        response = await result.current.signInWithFacebook();
      });

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      expect(response?.error).toBeNull();
    });
  });

  describe('signOut', () => {
    it('должен успешно выйти из системы', async () => {
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      }));
      const mockSignOut = vi.fn(() => Promise.resolve({ error: null }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;
      (supabase.auth.signOut as any) = mockSignOut;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockSignOut).toHaveBeenCalled();
    });

    it('должен очистить user и session после выхода', async () => {
      const mockSession = {
        user: { id: '123', email: 'test@example.com' },
        access_token: 'token',
      };

      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: mockSession }, error: null })
      );

      let authChangeCallback: any;
      const mockOnAuthStateChange = vi.fn((callback: any) => {
        authChangeCallback = callback;
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        };
      });

      const mockSignOut = vi.fn(() => {
        // Симулируем вызов auth state change с null session
        setTimeout(() => {
          if (authChangeCallback) {
            authChangeCallback('SIGNED_OUT', null);
          }
        }, 0);
        return Promise.resolve({ error: null });
      });

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;
      (supabase.auth.signOut as any) = mockSignOut;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // До выхода - пользователь должен быть
      expect(result.current.user).toBeTruthy();

      await act(async () => {
        await result.current.signOut();
      });

      // После выхода - должен очиститься
      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.session).toBeNull();
      });
    });
  });

  describe('Auth State Changes', () => {
    it('должен обновить состояние при изменении auth', async () => {
      const mockSession = {
        user: { id: '123', email: 'test@example.com' },
        access_token: 'token',
      };

      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );

      let authChangeCallback: any;
      const mockOnAuthStateChange = vi.fn((callback: any) => {
        authChangeCallback = callback;
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        };
      });

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Изначально нет пользователя
      expect(result.current.user).toBeNull();

      // Симулируем вход
      act(() => {
        if (authChangeCallback) {
          authChangeCallback('SIGNED_IN', mockSession);
        }
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockSession.user);
        expect(result.current.session).toEqual(mockSession);
      });
    });

    it('должен отписаться от auth changes при unmount', async () => {
      const unsubscribeMock = vi.fn();
      const mockGetSession = vi.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      );
      const mockOnAuthStateChange = vi.fn(() => ({
        data: { subscription: { unsubscribe: unsubscribeMock } },
      }));

      (supabase.auth.getSession as any) = mockGetSession;
      (supabase.auth.onAuthStateChange as any) = mockOnAuthStateChange;

      const { unmount } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(mockOnAuthStateChange).toHaveBeenCalled();
      });

      unmount();

      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });
});
