import { useMutation, useQueryClient } from "@tanstack/react-query";

async function saveProduct(productId, listType, token) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/scans/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      productId: Number(productId),
      listType,
      action: listType === null ? "REMOVE" : "ADD"
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return json.message;
}

export function useSaveProduct(productId, listType, token) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => saveProduct(productId, listType, token),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["savedScans"] }),
        queryClient.invalidateQueries({ queryKey: ["history"] }),
        queryClient.invalidateQueries({ queryKey: ["product", productId] })
      ]);
      return data;
    }
  });
}
