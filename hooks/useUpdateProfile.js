import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import * as SecureStore from "expo-secure-store";
import { userRefreshManager } from "./userRefreshManager";

async function updateProfile(token, profileData) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
  }

  const data = await response.json();
  return data;
}

function transformUserData(apiUser) {
  return {
    id: apiUser.id,
    email: apiUser.email,
    fullName: apiUser.full_name, // Transform snake_case to camelCase
    isVerified: apiUser.is_verified,
    role: apiUser.role,
    phoneNumber: apiUser.phone_number,
    profilePictureUrl: apiUser.profile_picture_url,
    updatedAt: apiUser.updatedAt
  };
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: ({ token, profileData }) => updateProfile(token, profileData),
    onSuccess: async (responseData) => {
      // Update the stored user data - transform API response to client format
      if (responseData?.data) {
        const transformedUser = transformUserData(responseData.data);
        console.log("Transformed user data:", transformedUser);

        // Force refresh by clearing and re-setting storage
        await SecureStore.deleteItemAsync("userData");
        await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay
        await SecureStore.setItemAsync("userData", JSON.stringify(transformedUser));

        console.log("Force updated storage with:", transformedUser);

        // Trigger global refresh for ALL useUser instances
        userRefreshManager.triggerGlobalRefresh();
      }

      return responseData;
    }
  });
}
