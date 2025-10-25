import { apiClient } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    credits?: number;
  };
  token: string;
}

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/api/auth/sign-up', data);
      const { user, token } = response.data;
      
      // Store token and user in auth store
      useAuthStore.setState({ user, token, isAuthenticated: true });
      
      // Store token in localStorage for persistence
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('authToken', token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.response?.data?.message || 'Sign up failed');
    }
  },

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/api/auth/sign-in', data);
      const { user, token } = response.data;
      
      // Store token and user in auth store
      useAuthStore.setState({ user, token, isAuthenticated: true });
      
      // Store token in localStorage for persistence
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('authToken', token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.response?.data?.message || 'Sign in failed');
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await apiClient.post('/api/auth/sign-out');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Clear auth state
      useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
      
      // Clear token from localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<any> {
    try {
      const response = await apiClient.get('/api/user/profile');
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(data: any): Promise<any> {
    try {
      const response = await apiClient.put('/api/user/profile', data);
      
      // Update auth store with new user data
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.setState({ user: { ...currentUser, ...response.data } });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    return !!token;
  },

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },
};

