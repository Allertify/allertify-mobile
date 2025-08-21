import { useQuery } from "@tanstack/react-query";

async function getUserData(token) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}

export function useUserData(token) {
  return useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(token),
    enabled: !!token
  });
}
