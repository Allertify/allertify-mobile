import { useQuery } from "@tanstack/react-query";

async function fetchHistory(token) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/scans/history`, {
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

export function useHistory(token) {
  return useQuery({
    queryKey: ["history"],
    queryFn: () => fetchHistory(token),
    enabled: !!token
  });
}
