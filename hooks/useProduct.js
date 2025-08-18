import { useQuery } from "@tanstack/react-query";

const fetchProduct = async (barcode, allergies) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      barcode: barcode,
      allergies: allergies
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useProduct = (productId, allergies) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId, allergies),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  });
};
