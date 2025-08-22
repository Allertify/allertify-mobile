import { useEffect, useState, useCallback, useRef } from "react";
import { useToken } from "@/hooks/useToken";
import { useEmergencyContactAPI } from "./useEmergencyContactAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

let globalEmergencyContact = null;
let globalListeners = [];
let hasFetchedFromAPI = false;
let isInitializing = false;

// Initialize from storage on module load
const initializeGlobalState = async () => {
  if (isInitializing) return;
  isInitializing = true;

  try {
    const storedContact = await AsyncStorage.getItem("userEmergencyContact");
    if (storedContact) {
      globalEmergencyContact = JSON.parse(storedContact);
    }
  } catch (error) {
    console.error("Error initializing global state:", error);
  } finally {
    isInitializing = false;
  }
};

initializeGlobalState();

const notifyListeners = (newContact) => {
  globalEmergencyContact = newContact;
  globalListeners.forEach((listener) => listener(newContact));
};

export const useEmergencyContact = () => {
  const { token, isLoading: tokenLoading } = useToken();
  const {
    fetchEmergencyContact,
    createEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    getStoredEmergencyContact,
    updateStoredEmergencyContact,
    isLoading: apiLoading,
    error,
    clearError
  } = useEmergencyContactAPI();

  const [emergencyContact, setEmergencyContact] = useState(globalEmergencyContact);
  const [isLoading, setIsLoading] = useState(false);
  const hasInitialized = useRef(false);
  const hasFetchedOnce = useRef(false);

  // Register this component instance as a listener
  useEffect(() => {
    const listener = (newContact) => {
      setEmergencyContact(newContact);
    };

    globalListeners.push(listener);

    if (globalEmergencyContact) {
      setEmergencyContact(globalEmergencyContact);
    }

    return () => {
      globalListeners = globalListeners.filter((l) => l !== listener);
    };
  }, []);

  const getEmergencyContact = useCallback(
    async (forceRefresh = false) => {
      if (isLoading && !forceRefresh) {
        return emergencyContact;
      }

      setIsLoading(true);
      try {
        if (!token) {
          // If no token, try to get stored contact
          const stored = await getStoredEmergencyContact();
          notifyListeners(stored);
          return stored;
        }

        const result = await fetchEmergencyContact(token);
        if (result.success) {
          notifyListeners(result.data);
          hasFetchedFromAPI = true;
          return result.data;
        } else {
          // If API fails, fall back to stored contact
          const stored = await getStoredEmergencyContact();
          notifyListeners(stored);
          return stored;
        }
      } catch (error) {
        console.error("Error in getEmergencyContact:", error);
        // Fall back to stored contact
        const stored = await getStoredEmergencyContact();
        notifyListeners(stored);
        return stored;
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchEmergencyContact, getStoredEmergencyContact]
  );

  const addEmergencyContact = useCallback(
    async (contact) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const result = await createEmergencyContact(token, contact);

      if (result.success) {
        const newContact = result.data;
        await updateStoredEmergencyContact(newContact);
        notifyListeners(newContact);

        // Force a small delay to ensure state is updated
        setTimeout(() => {
          notifyListeners(newContact);
        }, 100);
      } else {
        console.error("Failed to add contact:", result.error);
      }

      return result;
    },
    [token, createEmergencyContact, updateStoredEmergencyContact]
  );

  const editEmergencyContact = useCallback(
    async (contactId, contact) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      console.log("Editing emergency contact:", contactId, contact);
      const result = await updateEmergencyContact(token, contactId, contact);

      if (result.success) {
        const updatedContact = result.data;
        await updateStoredEmergencyContact(updatedContact);
        notifyListeners(updatedContact);

        // Additional state sync to ensure UI updates
        setTimeout(() => {
          notifyListeners(updatedContact);
        }, 50);
      } else {
        console.error("Failed to update contact:", result.error);
      }

      return result;
    },
    [token, updateEmergencyContact, updateStoredEmergencyContact]
  );

  const removeEmergencyContact = useCallback(
    async (contactId) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const result = await deleteEmergencyContact(token, contactId);

      if (result.success) {
        await updateStoredEmergencyContact(null);
        notifyListeners(null);
      } else {
        console.error("Failed to remove contact:", result.error);
      }

      return result;
    },
    [token, deleteEmergencyContact, updateStoredEmergencyContact]
  );

  // Initialize from storage immediately when hook is used
  useEffect(() => {
    const initializeFromStorage = async () => {
      if (hasInitialized.current) return;

      // If global state is already initialized, use it
      if (globalEmergencyContact) {
        console.log("Using already initialized global state:", globalEmergencyContact);
        setEmergencyContact(globalEmergencyContact);
        hasInitialized.current = true;
        return;
      }

      // Otherwise, load from storage
      const stored = await getStoredEmergencyContact();
      if (stored) {
        notifyListeners(stored);
      } else {
        console.log("No stored contact found");
      }

      hasInitialized.current = true;
    };

    initializeFromStorage();
  }, [getStoredEmergencyContact]);

  // Fetch from API once when token is available
  useEffect(() => {
    const fetchFromAPIOnce = async () => {
      if (hasInitialized.current && token && !tokenLoading && !hasFetchedOnce.current && !hasFetchedFromAPI) {
        hasFetchedOnce.current = true;
        await getEmergencyContact(true);
      }
    };

    fetchFromAPIOnce();
  }, [token, tokenLoading, getEmergencyContact]);

  // Helper function to check if contact exists
  const hasEmergencyContact = useCallback(() => {
    const hasContact = emergencyContact !== null && emergencyContact !== undefined;
    return hasContact;
  }, [emergencyContact]);

  return {
    emergencyContact,
    hasEmergencyContact: hasEmergencyContact(),
    error,
    isLoading: isLoading || apiLoading,

    getEmergencyContact,
    addEmergencyContact,
    editEmergencyContact,
    removeEmergencyContact,

    clearError
  };
};
