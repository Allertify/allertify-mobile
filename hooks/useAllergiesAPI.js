import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Low-level settings hook that handles API calls and storage management
 * This hook focuses purely on settings operations without state management
 */
export const useAllergiesAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllergies = async (token) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/me/allergies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const allergiesData = data?.data || [];
      const allergenObjects = allergiesData.map((item) => item.allergen);
      const allergenNames = allergenObjects.map((allergyObj) => allergyObj.name);

      // This is the correct line to change
      await AsyncStorage.setItem("userAllergies", JSON.stringify(allergenNames));

      console.log(allergenObjects);

      return { success: true, data: allergiesData };
    } catch (error) {
      console.error("Error while getting allergies", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateAllergies = async (token, allergiesList) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/me/allergies`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          allergies: allergiesList
        })
      });

      if (response.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data?.success) {
        throw new Error(data.message || "Update allergies failed.");
      }

      // Update AsyncStorage cache
      await AsyncStorage.setItem("userAllergies", JSON.stringify(allergiesList));

      // console.log("Successfully updated allergies to:", allergiesList);
      // console.log("Code", response.status);
      return { success: true, data: allergiesList };
    } catch (error) {
      console.error("Error while updating allergies", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getStoredAllergies = async () => {
    try {
      const storedAllergies = await AsyncStorage.getItem("userAllergies");
      return storedAllergies ? JSON.parse(storedAllergies) : [];
    } catch (error) {
      console.error("Error getting stored allergies:", error);
      return [];
    }
  };

  const clearStoredAllergies = async () => {
    try {
      await AsyncStorage.removeItem("userAllergies");
    } catch (error) {
      console.error("Error clearing stored allergies:", error);
    }
  };

  const clearError = () => setError(null);

  return {
    // API methods
    fetchAllergies,
    updateAllergies,
    getStoredAllergies,
    clearStoredAllergies,

    // Loading and error states
    isLoading,
    error,
    clearError
  };
};
