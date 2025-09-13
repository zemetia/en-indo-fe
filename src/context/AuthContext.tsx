// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserData, UserData, Logout } from '@/lib/helper';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const data = getUserData();
    if (data) {
      setUser(data);
    } else {
        // If no user data, no need to keep loading, redirect handled by middleware/guards
        setUser(null);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    Logout();
    setUser(null); // Clear user state
  };

  const value = { user, isLoading, logout: handleLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
