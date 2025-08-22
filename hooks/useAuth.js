import { useState } from "react";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Low-level authentication hook that handles API calls and token management
 * This hook focuses purely on authentication operations without state management
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      const data = result.data;

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error while registering user", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();
      const data = result.data;

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // console.log("Login response:", data);

      if (data.accessToken) {
        await SecureStore.setItemAsync("userToken", data.accessToken);
      }
      if (data.user) {
        await SecureStore.setItemAsync("userData", JSON.stringify(data.user));
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error while logging user", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userData");
      return { success: true };
    } catch (error) {
      console.error("Error while logging out", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getStoredUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const userData = await SecureStore.getItemAsync("userData");

      if (token && userData) {
        return {
          token,
          user: JSON.parse(userData)
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting stored user:", error);
      return null;
    }
  };

  const verifyOTP = async (otpData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(otpData)
      });

      const result = await response.json();
      const data = result.data;

      // console.log("OTP verification response:", data);

      if (!response.ok) {
        throw new Error(result.message || "OTP verification failed");
      }

      if (result.data.accessToken) {
        await SecureStore.setItemAsync("userToken", data.accessToken);
      }
      if (result.data.user) {
        await SecureStore.setItemAsync("userData", JSON.stringify(data.user));
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error while verifying OTP", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const storedUser = await getStoredUser();

      if (storedUser && storedUser.token) {
        return { isAuthenticated: true, user: storedUser.user };
      }

      return { isAuthenticated: false, user: null };
    } catch (error) {
      console.error("Error checking auth status:", error);
      return { isAuthenticated: false, user: null };
    }
  };

  const clearError = () => setError(null);

  return {
    // API methods
    register,
    login,
    verifyOTP,
    logout,
    getStoredUser,
    checkAuthStatus,

    // Loading and error states
    isLoading,
    error,
    clearError
  };
};
