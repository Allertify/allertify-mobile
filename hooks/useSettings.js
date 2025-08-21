import { useState } from "react";
import { useToken } from "./useToken";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const useSettings = () => {
  const [allergies, setAllergies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useToken();

  // Add a simple in-memory cache to prevent duplicate requests
  let getAllergiesCache = null;
  let cacheTimestamp = null;
  const CACHE_DURATION = 60000; // 1 minute cache

  const getAllergies = async () => {
    // Check cache first
    if (getAllergiesCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return getAllergiesCache;
    }

    // Prevent multiple simultaneous requests
    if (isLoading) {
      return allergies;
    }

    setIsLoading(true);

    try {
      const result = await fetch(`${API_BASE_URL}/users/me/allergies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (result.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const data = await result.json();

      if (data?.allergies) {
        setAllergies(data.allergies);
        getAllergiesCache = data.allergies;
        cacheTimestamp = Date.now();
        return data.allergies;
      }

      setAllergies([]);
      getAllergiesCache = [];
      cacheTimestamp = Date.now();
      return [];
    } catch (error) {
      console.error("Error while getting allergies", error);
      setError(error.message);
      return allergies; // Return current state instead of empty array
    } finally {
      setIsLoading(false);
    }
  };

  const updateAllergies = async (allergiesList) => {
    setIsLoading(true);

    try {
      const result = await fetch(`${API_BASE_URL}/users/me/allergies`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          allergies: allergiesList
        })
      });

      if (result.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const data = await result.json();

      if (!data?.success) {
        throw new Error(data.message || "Update allergies failed.");
      }

      setAllergies(allergiesList);

      // Clear cache after successful update
      getAllergiesCache = allergiesList;
      cacheTimestamp = Date.now();

      return { success: true, allergies: allergiesList };
    } catch (error) {
      console.error("Error while updating allergies", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    allergies,
    error,
    isLoading,

    // methods
    getAllergies,
    updateAllergies,
    clearError
  };
};
