import { useQuery } from "@tanstack/react-query";

async function fetchSavedScans(token) {
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

export function useSavedScans(token) {
  return useQuery({
    queryKey: ["savedScans"],
    queryFn: () => fetchSavedScans(token),
    enabled: !!token
  });
}
