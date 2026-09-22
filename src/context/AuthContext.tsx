import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from '../services/storage';
import { processGoogleCredential, isUserAuthenticated, logoutUser } from '../services/authService';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  loginWithGoogle: (credential: string) => Promise<UserProfile>;
  logout: () => void;
  updateUser: (user: UserProfile) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(getUserProfile());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isUserAuthenticated());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check initial authentication state on mount
    const authed = isUserAuthenticated();
    setIsAuthenticated(authed);
    setUser(getUserProfile());
  }, []);

  const loginWithGoogle = async (credential: string): Promise<UserProfile> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const updatedUser = processGoogleCredential(credential);
      setUser(updatedUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      return updatedUser;
    } catch (err: any) {
      const message = err?.message || 'Google Authentication failed. Please try again.';
      setAuthError(message);
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    const guestUser = logoutUser();
    setUser(guestUser);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const updateUser = (updated: UserProfile) => {
    saveUserProfile(updated);
    setUser(updated);
  };

  const openAuthModal = () => {
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        authError,
        loginWithGoogle,
        logout,
        updateUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
