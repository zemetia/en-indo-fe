'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserData } from '@/lib/helper';
import { authService, PasswordSetupRequest } from '@/lib/auth-service';

interface PasswordSetupContextType {
  // State
  isFirstTime: boolean;
  userInfo: UserData | null;
  isSubmitting: boolean;
  error: string | null;
  
  // Actions
  setupPassword: (request: PasswordSetupRequest) => Promise<void>;
  completeSetup: () => Promise<void>;
  setError: (error: string | null) => void;
  setUserInfo: (user: UserData) => void;
}

const PasswordSetupContext = createContext<PasswordSetupContextType | undefined>(undefined);

export const PasswordSetupProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFirstTime = userInfo?.requires_password_setup || false;

  const setupPassword = async (request: PasswordSetupRequest) => {
    if (!userInfo) {
      throw new Error('User information not available');
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      await authService.setupPassword(request);
      
      // Update user info to reflect password setup completion
      const updatedUserInfo: UserData = {
        ...userInfo,
        requires_password_setup: false,
        default_password_hint: undefined,
      };
      
      setUserInfo(updatedUserInfo);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to setup password. Please try again.';
      setError(errorMessage);
      throw err; // Re-throw so components can handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeSetup = async () => {
    if (!userInfo) {
      throw new Error('User information not available');
    }

    try {
      await authService.completeFirstTimeSetup(userInfo);
      
      // Clear the context state after successful completion
      setUserInfo(null);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to complete setup';
      setError(errorMessage);
      throw err;
    }
  };

  const value: PasswordSetupContextType = {
    isFirstTime,
    userInfo,
    isSubmitting,
    error,
    setupPassword,
    completeSetup,
    setError,
    setUserInfo,
  };

  return (
    <PasswordSetupContext.Provider value={value}>
      {children}
    </PasswordSetupContext.Provider>
  );
};

export const usePasswordSetup = () => {
  const context = useContext(PasswordSetupContext);
  if (context === undefined) {
    throw new Error('usePasswordSetup must be used within a PasswordSetupProvider');
  }
  return context;
};