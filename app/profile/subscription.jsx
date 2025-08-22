import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useSubscription } from "@/hooks/useSubscription";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { useToken } from "@/hooks/useToken";
import { useUpgradeSubscription } from "@/hooks/useUpgradeSubscription";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

function PlanCard({ plan, isCurrentPlan, onSelect, isUpgrading }) {
  const isBasic = plan.plan_type === "basic";

  return (
    <Pressable
      style={[styles.planCard, isCurrentPlan && styles.currentPlanCard, isUpgrading && styles.upgradingCard]}
      onPress={onSelect}
      disabled={isUpgrading}
    >
      <View style={styles.planHeader}>
        <View style={styles.planIconContainer}>
          <LinearGradient
            colors={isBasic ? ["#E8F5E8", "#4CAF50"] : ["#FFF8E1", "#FFC107"]}
            style={styles.planIcon}
            start={[0, 0]}
            end={[1, 1]}
          >
            <Ionicons
              name={isBasic ? "card-outline" : "diamond-outline"}
              size={24}
              color={isBasic ? "#2E7D32" : "#B8860B"}
            />
          </LinearGradient>
        </View>
        <View style={styles.planInfo}>
          <ThemedText style={styles.planName}>
            {plan.plan_type.charAt(0).toUpperCase() + plan.plan_type.slice(1)}
          </ThemedText>
          {isCurrentPlan && (
            <View style={styles.currentBadge}>
              <ThemedText style={styles.currentBadgeText}>Current Plan</ThemedText>
            </View>
          )}
        </View>
      </View>

      <View style={styles.planFeatures}>
        <View style={styles.feature}>
          <Ionicons name="scan-outline" size={16} color="#666" />
          <ThemedText style={styles.featureText}>{plan.scan_count_limit} scans per month</ThemedText>
        </View>
        <View style={styles.feature}>
          <Ionicons name="bookmark-outline" size={16} color="#666" />
          <ThemedText style={styles.featureText}>{plan.saved_product_limit} saved products</ThemedText>
        </View>
      </View>

      {!isCurrentPlan && (
        <View style={styles.actionContainer}>
          <ThemedText style={styles.upgradeText}>{isBasic ? "Upgrade to Premium" : "Switch to Basic"}</ThemedText>
        </View>
      )}
    </Pressable>
  );
}

export default function SubscriptionScreen() {
  const { token, isLoading: tokenLoading } = useToken();
  const { data: plansData, isLoading: plansLoading, error: plansError, isError: plansIsError } = useSubscriptionPlans();
  const { data: currentSubscription, isLoading: subscriptionLoading } = useSubscription();
  const { mutate: upgradeSubscription, isPending: isUpgrading } = useUpgradeSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDurationModal, setShowDurationModal] = useState(false);

  if (tokenLoading || plansLoading || subscriptionLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  if (plansIsError) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{plansError.message}</ThemedText>
      </View>
    );
  }

  if (!plansData) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>No subscription plans available</ThemedText>
      </View>
    );
  }

  const handlePlanSelect = (plan) => {
    if (isCurrentPlan(plan)) {
      return;
    }

    setSelectedPlan(plan);
    setShowDurationModal(true);
  };

  const handleUpgrade = (durationMonths) => {
    if (!selectedPlan) return;

    upgradeSubscription(
      {
        tierPlanId: selectedPlan.id,
        durationMonths: durationMonths
      },
      {
        onSuccess: (data) => {
          setShowDurationModal(false);
          setSelectedPlan(null);
          Alert.alert("Success", `Successfully upgraded to ${selectedPlan.plan_type} plan!`, [{ text: "OK" }]);
        },
        onError: (error) => {
          Alert.alert("Upgrade Failed", error.message || "Failed to upgrade subscription. Please try again.", [
            { text: "OK" }
          ]);
        }
      }
    );
  };

  const isCurrentPlan = (plan) => {
    if (!currentSubscription?.subscription?.tier_plan) return false;
    return currentSubscription.subscription.tier_plan.plan_type === plan.plan_type;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ThemedText style={styles.description}>Choose the plan that best fits your needs</ThemedText>
      </View>

      <View style={styles.plansContainer}>
        {plansData.plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={isCurrentPlan(plan)}
            onSelect={() => handlePlanSelect(plan)}
            isUpgrading={isUpgrading}
          />
        ))}
      </View>

      <View style={styles.infoSection}>
        <ThemedText style={styles.infoTitle}>What's included?</ThemedText>
        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <ThemedText style={styles.infoText}>Allergen detection</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <ThemedText style={styles.infoText}>Product history and saved lists</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <ThemedText style={styles.infoText}>Emergency contact management</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <ThemedText style={styles.infoText}>Allergen profile management</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.bottomSpacing} />

      <Modal
        visible={showDurationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDurationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Choose Duration</ThemedText>
              <ThemedText style={styles.modalSubtitle}>
                Select how long you want to subscribe to {selectedPlan?.plan_type}
              </ThemedText>
            </View>

            <View style={styles.durationOptions}>
              {[1, 3, 6, 12].map((months) => (
                <Pressable
                  key={months}
                  style={styles.durationOption}
                  onPress={() => handleUpgrade(months)}
                  disabled={isUpgrading}
                >
                  <ThemedText style={styles.durationText}>
                    {months} {months === 1 ? "Month" : "Months"}
                  </ThemedText>
                  {isUpgrading && <ActivityIndicator size="small" color={Colors.blue} />}
                </Pressable>
              ))}
            </View>

            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setShowDurationModal(false);
                setSelectedPlan(null);
              }}
              disabled={isUpgrading}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7ECFF",
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7ECFF"
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7ECFF",
    padding: 24
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center"
  },
  header: {
    padding: 24,
    paddingBottom: 16
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2746b7ff",
    textAlign: "center",
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center"
  },
  plansContainer: {
    paddingHorizontal: 24,
    gap: 16
  },
  planCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e9ecef"
  },
  currentPlanCard: {
    borderWidth: 2,
    borderColor: "#4CAF50"
  },
  upgradingCard: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  planIconContainer: {
    marginRight: 16
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  planInfo: {
    flex: 1
  },
  planName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4
  },
  currentBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start"
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white"
  },
  planFeatures: {
    gap: 12
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  featureText: {
    fontSize: 14,
    color: "#666"
  },
  actionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0"
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2746b7ff",
    textAlign: "center"
  },
  infoSection: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center"
  },
  infoList: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    gap: 12
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  infoText: {
    fontSize: 14,
    color: "#666"
  },
  bottomSpacing: {
    height: 100
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: "90%",
    maxWidth: 400
  },
  modalHeader: {
    marginBottom: 24
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 8
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center"
  },
  durationOptions: {
    gap: 12,
    marginBottom: 24
  },
  durationOption: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  durationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333"
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#dc3545",
    borderRadius: 12,
    paddingVertical: 16
  },
  cancelButtonText: {
    color: "#dc3545",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  }
});
