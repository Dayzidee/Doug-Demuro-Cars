import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the user profile based on the backend schema
interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'staff' | 'manager' | 'admin';
}

import apiClient from '../services/api';

// Define the shape for registration data
interface RegisterData {
    full_name: string;
    email: string;
    password: string;
}

// Define the shape of the context data
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (token: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (token: string) => {
    try {
      // The /auth/me endpoint should return the user's profile
      const response = await fetch('/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const profile = await response.json();
        setUser(profile);
      } else {
        // If the token is invalid or expired, clear it
        localStorage.removeItem('supabase_token');
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUser(null);
    }
  };

  // Check for an existing session on initial component mount
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('supabase_token');
      if (token) {
        await fetchUserProfile(token);
      }
      setIsLoading(false);
    };
    checkUserSession();
  }, []);

  const login = async (token: string) => {
    // In a real app, you'd get the token from the login API response
    localStorage.setItem('supabase_token', token);
    setIsLoading(true);
    await fetchUserProfile(token);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('supabase_token');
    setUser(null);
  };

  const register = async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    const { token } = response.data;
    await login(token);
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    register,
    logout,
    isLoading
  };

  // Don't render children until the initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
