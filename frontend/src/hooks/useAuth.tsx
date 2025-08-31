import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context data
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  // For this mock setup, we just need a simple boolean state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // In a real app, this would involve API calls, setting tokens, etc.
  const login = () => {
    console.log("Simulating user login...");
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("Simulating user logout...");
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
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
