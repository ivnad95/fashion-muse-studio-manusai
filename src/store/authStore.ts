import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  credits?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  clearError: () => set({ error: null }),
}));

