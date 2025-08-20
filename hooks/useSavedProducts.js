import { useQuery } from "@tanstack/react-query";

async function fetchSavedProducts(token) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/scans/saved`, {
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

export function useSavedProducts(token) {
  return useQuery({
    queryKey: ["savedProducts"],
    queryFn: () => fetchSavedProducts(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  });
}
