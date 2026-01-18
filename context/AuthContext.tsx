import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (data: any) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fix: Changed component props to use React.PropsWithChildren to correctly type a component that accepts children. This resolves the TypeScript error in App.tsx.
export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('trackcodex_token');
    if (token) {
      setIsAuthenticated(true);
      setUser({ username: 'alexcoder' }); // Mock user
    }
    setIsLoading(false);
  }, []);

  const login = (data: any) => {
    localStorage.setItem('trackcodex_token', 'dummy-token');
    setIsAuthenticated(true);
    setUser({ username: 'alexcoder' });
    navigate('/dashboard/home');
  };

  const logout = () => {
    localStorage.removeItem('trackcodex_token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
