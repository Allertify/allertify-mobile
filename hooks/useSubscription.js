import { useQuery } from "@tanstack/react-query";
import { useToken } from "./useToken";

async function fetchSubscription(token) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/subscriptions/me`, {
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

export function useSubscription() {
  const { token, isLoading: tokenLoading } = useToken();

  return useQuery({
    queryKey: ["subscription"],
    queryFn: () => fetchSubscription(token),
    enabled: !!token
  });
}
