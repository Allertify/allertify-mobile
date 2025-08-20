import { useQuery } from "@tanstack/react-query";

async function fetchProduct(barcode, token) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/scans/barcode/${barcode}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();

  if (json && json.success === false) {
    throw new Error(json.message || "Failed to fetch product");
  }

  return json?.data;
}

export function useProduct(barcode, token) {
  return useQuery({
    queryKey: ["product", barcode],
    queryFn: () => fetchProduct(barcode, token),
    enabled: !!barcode && !!token,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  });
}
