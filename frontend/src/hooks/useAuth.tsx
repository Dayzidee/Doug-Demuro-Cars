import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the user profile based on the backend schema
interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'staff' | 'manager' | 'admin';
}

// Define the shape of the context data
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (token: string) => Promise<void>; // Login now takes a token
  logout: () => void;
  isLoading: boolean; // To handle the initial auth check
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const profile = await response.json();
        setUser(profile);
      } else {
        localStorage.removeItem('supabase_token');
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUser(null);
    }
  };

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
    localStorage.setItem('supabase_token', token);
    setIsLoading(true);
    await fetchUserProfile(token);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('supabase_token');
    setUser(null);
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    isLoading
  };

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
