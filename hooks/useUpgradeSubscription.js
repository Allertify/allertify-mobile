import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToken } from "./useToken";

async function upgradeSubscription(token, tierPlanId, durationMonths) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/subscriptions/upgrade`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      tier_plan_id: tierPlanId,
      duration_months: durationMonths
    })
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || `HTTP error! status: ${response.status}`);
  }

  return json;
}

export function useUpgradeSubscription() {
  const { token } = useToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tierPlanId, durationMonths }) => upgradeSubscription(token, tierPlanId, durationMonths),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    }
  });
}
