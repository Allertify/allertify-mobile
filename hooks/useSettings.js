import { useEffect, useState, useCallback, useRef } from "react";
import { useToken } from "./useToken";
import { useSettingsAPI } from "./useSettingsAPI";

// Global state to keep allergies synchronized across all instances
let globalAllergies = [];
let globalListeners = [];

const notifyListeners = (newAllergies) => {
  globalAllergies = newAllergies;
  globalListeners.forEach((listener) => listener(newAllergies));
};

export const useSettings = () => {
  const { token, isLoading: tokenLoading } = useToken();
  const {
    fetchAllergies,
    updateAllergies,
    getStoredAllergies,
    isLoading: apiLoading,
    error,
    clearError
  } = useSettingsAPI();

  const [allergies, setAllergies] = useState(globalAllergies);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Register this component instance as a listener
  useEffect(() => {
    const listener = (newAllergies) => {
      setAllergies(newAllergies);
    };

    globalListeners.push(listener);

    // Cleanup on unmount
    return () => {
      globalListeners = globalListeners.filter((l) => l !== listener);
    };
  }, []);

  const getAllergies = useCallback(
    async (forceRefresh = false) => {
      if (isLoading && !forceRefresh) {
        return allergies;
      }

      setIsLoading(true);
      try {
        if (!token) {
          // If no token, try to get stored allergies
          const stored = await getStoredAllergies();
          notifyListeners(stored);
          return stored;
        }

        const result = await fetchAllergies(token);
        if (result.success) {
          notifyListeners(result.data);
          return result.data;
        } else {
          // If API fails, fall back to stored allergies
          const stored = await getStoredAllergies();
          notifyListeners(stored);
          return stored;
        }
      } catch (error) {
        console.error("Error in getAllergies:", error);
        // Fall back to stored allergies
        const stored = await getStoredAllergies();
        notifyListeners(stored);
        return stored;
      } finally {
        setIsLoading(false);
      }
    },
    [token, isLoading, fetchAllergies, getStoredAllergies]
  );

  const handleUpdateAllergies = useCallback(
    async (allergiesList) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const result = await updateAllergies(token, allergiesList);
      if (result.success) {
        // Update global state immediately
        notifyListeners(result.data);
      }
      return result;
    },
    [token, updateAllergies]
  );

  // Initialize allergies on first load
  useEffect(() => {
    const initializeAllergies = async () => {
      if (hasInitialized) return;

      // First load from cache immediately
      const stored = await getStoredAllergies();
      if (stored.length > 0) {
        notifyListeners(stored);
      }

      setHasInitialized(true);

      // Then fetch from API if we have a token
      if (token && !tokenLoading) {
        getAllergies(true);
      }
    };

    initializeAllergies();
  }, [token, tokenLoading, hasInitialized, getAllergies, getStoredAllergies]);

  useEffect(() => {
    // console.log("Allergies state updated:", allergies);
  }, [allergies]);

  return {
    allergies,
    error,
    isLoading: isLoading || apiLoading,
    getAllergies,
    updateAllergies: handleUpdateAllergies,
    clearError
  };
};
