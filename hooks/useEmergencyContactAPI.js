import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Low-level emergency contact hook that handles API calls and storage management
 * This hook focuses purely on emergency contact operations without state management
 */
export const useEmergencyContactAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmergencyContact = async (token) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/me/contacts`, {
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Store in AsyncStorage for caching
      await AsyncStorage.setItem("userEmergencyContact", JSON.stringify(result.data));

      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error while getting emergency contact", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const createEmergencyContact = async (token, contact) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!contact.name || !contact.phone_number || !contact.relationship) {
        throw new Error("Name, phone number, and relationship are required");
      }

      const requestBody = {
        name: contact.name.trim(),
        phone_number: contact.phone_number.trim(),
        relationship: contact.relationship.trim()
      };

      const response = await fetch(`${API_BASE_URL}/users/me/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Create contact error response:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result?.success) {
        throw new Error(result.message || "Create emergency contact failed.");
      }
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error while creating emergency contact", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmergencyContact = async (token, contactId, contact) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!contact.name || !contact.phone_number || !contact.relationship) {
        throw new Error("Name, phone number, and relationship are required");
      }

      if (!contactId) {
        throw new Error("Contact ID is required for update");
      }

      const requestBody = {
        name: contact.name.trim(),
        phone_number: contact.phone_number.trim(),
        relationship: contact.relationship.trim()
      };

      const response = await fetch(`${API_BASE_URL}/users/me/contacts/${contactId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Update contact error response:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result?.success) {
        throw new Error(data.message || "Update emergency contact failed.");
      }
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error while updating emergency contact", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmergencyContact = async (token, contactId) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!contactId) {
        throw new Error("Contact ID is required for deletion");
      }

      const response = await fetch(`${API_BASE_URL}/users/me/contacts/${contactId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Delete contact error response:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result?.success) {
        throw new Error(result.message || "Delete emergency contact failed.");
      }

      return { success: true };
    } catch (error) {
      console.error("Error while deleting emergency contact", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getStoredEmergencyContact = async () => {
    try {
      const storedContact = await AsyncStorage.getItem("userEmergencyContact");
      return storedContact ? JSON.parse(storedContact) : null;
    } catch (error) {
      console.error("Error getting stored emergency contact:", error);
      return null;
    }
  };

  const updateStoredEmergencyContact = async (contact) => {
    try {
      if (contact === null || contact === undefined) {
        await AsyncStorage.removeItem("userEmergencyContact");
      } else {
        await AsyncStorage.setItem("userEmergencyContact", JSON.stringify(contact));
      }
    } catch (error) {
      console.error("Error updating stored emergency contact:", error);
    }
  };

  const clearStoredEmergencyContact = async () => {
    try {
      await AsyncStorage.removeItem("userEmergencyContact");
    } catch (error) {
      console.error("Error clearing stored emergency contact:", error);
    }
  };

  const clearError = () => setError(null);

  return {
    // API methods
    fetchEmergencyContact,
    createEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    getStoredEmergencyContact,
    updateStoredEmergencyContact,
    clearStoredEmergencyContact,

    // Loading and error states
    isLoading,
    error,
    clearError
  };
};
