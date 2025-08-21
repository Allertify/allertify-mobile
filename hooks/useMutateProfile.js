import { useMutation } from "@tanstack/react-query";

async function updateProfile(token, fullName, phoneNumber) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      full_name: fullName,
      phone_number: phoneNumber
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export function useUpdateProfile(token, fullName, phoneNumber) {
  return useMutation({
    mutationFn: () => updateProfile(token, fullName, phoneNumber),
    onSuccess: async (data) => {
      return data;
    }
  });
}
