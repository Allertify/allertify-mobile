import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const AuthContext = createContext();

/**
 * Context hook to access authentication state and methods
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

/**
 * Authentication provider that manages global auth state
 * Uses useAuth hook for API operations and provides state management
 */
export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Store registration data temporarily for resend functionality
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    checkInitialAuthState();
  }, []);

  const checkInitialAuthState = async () => {
    try {
      const authStatus = await auth.checkAuthStatus();
      setIsAuthenticated(authStatus.isAuthenticated);
      setUser(authStatus.user);
    } catch (error) {
      console.error("Error checking initial auth state:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleLogin = async (credentials) => {
    const result = await auth.login(credentials);
    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const handleRegister = async (userData) => {
    setRegistrationData(userData);

    const result = await auth.register(userData);
    return result;
  };

  const handleVerifyOTP = async (otpData) => {
    const result = await auth.verifyOTP(otpData);
    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
      setRegistrationData(null);
    }
    return result;
  };

  // Handle resend OTP by re-registering
  const handleResendOTP = async (email) => {
    if (registrationData && registrationData.email === email) {
      console.log("Re-registering user to resend OTP");
      const reregisterResult = await auth.register(registrationData);
      return reregisterResult;
    }

    return {
      success: false,
      error: "Unable to resend OTP. Please go back and register again."
    };
  };

  const handleLogout = async () => {
    const result = await auth.logout();
    if (result.success) {
      setUser(null);
      setIsAuthenticated(false);
      setRegistrationData(null);
    }
    return result;
  };

  const value = {
    // Authentication state
    user,
    isAuthenticated,
    isInitializing,

    // Loading states from useAuth
    isLoading: auth.isLoading,
    error: auth.error,

    // Authentication methods
    login: handleLogin,
    register: handleRegister,
    verifyOTP: handleVerifyOTP,
    resendOTP: handleResendOTP,
    logout: handleLogout,

    // Utility methods
    clearError: auth.clearError,
    refreshAuthState: checkInitialAuthState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
