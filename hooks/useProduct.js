import { useQuery } from "@tanstack/react-query";

async function scanProduct(barcode, token) {
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
  return json.data;
}

export function useProduct(barcode, token, canScan = true) {
  return useQuery({
    queryKey: ["product", barcode],
    queryFn: () => scanProduct(barcode, token),
    enabled: !!barcode && !!token && canScan
  });
}
