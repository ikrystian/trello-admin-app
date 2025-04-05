'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthState, AuthContextType, SignInCredentials, SignUpCredentials } from '@/types/auth';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setState({
              user: data.user,
              isLoading: false,
              error: null,
            });
          } else {
            setState({
              user: null,
              isLoading: false,
              error: null,
            });
          }
        } else {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          error: 'Failed to fetch session',
        });
      }
    };

    checkAuth();
  }, []);

  // Sign in function
  const signIn = async (credentials: SignInCredentials) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

      setState({
        user: data.user,
        isLoading: false,
        error: null,
      });

      toast.success('Zalogowano pomyślnie!');
      router.push('/dashboard');
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign in',
      });
      toast.error(error instanceof Error ? error.message : 'Błąd logowania');
    }
  };

  // Sign up function
  const signUp = async (credentials: SignUpCredentials) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }

      toast.success('Konto utworzone pomyślnie!');
      router.push('/sign-in');
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign up',
      });
      toast.error(error instanceof Error ? error.message : 'Błąd rejestracji');
    }
  };

  // Sign out function
  const signOut = async () => {
    setState({ ...state, isLoading: true, error: null });

    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
      });

      setState({
        user: null,
        isLoading: false,
        error: null,
      });

      toast.success('Wylogowano pomyślnie!');
      router.push('/?logged_out=true');
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign out',
      });
      toast.error('Błąd wylogowania');
    }
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
