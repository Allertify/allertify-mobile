import { useMutation, useQueryClient } from "@tanstack/react-query";

async function saveScan(scanId, token) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/scans/save/${scanId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return json.message;
}

export function useSaveScan(scanId, token) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => saveScan(scanId, token),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["savedScans"] }),
        queryClient.invalidateQueries({ queryKey: ["history"] })
      ]);
      return data;
    }
  });
}
