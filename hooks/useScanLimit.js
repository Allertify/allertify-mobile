import { useQuery } from "@tanstack/react-query";

async function fetchScanLimit(token) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/scans/limit`, {
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

export function useScanLimit(token) {
  return useQuery({
    queryKey: ["scanLimit"],
    queryFn: () => fetchScanLimit(token),
    enabled: !!token
  });
}
