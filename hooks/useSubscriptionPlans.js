import { useQuery } from "@tanstack/react-query";
import { useToken } from "./useToken";

async function fetchSubscriptionPlans(token) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/subscriptions/plans`, {
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

export function useSubscriptionPlans() {
  const { token, isLoading: tokenLoading } = useToken();

  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => fetchSubscriptionPlans(token),
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 20 * 60 * 1000 // 20 minutes
  });
}
