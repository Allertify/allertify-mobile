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
import { useRouter } from "expo-router";

function PlanCard({ plan, isCurrentPlan, onSelect, isUpgrading }) {
  const isBasic = plan.plan_type === "basic";
  const isFree = plan.plan_type === "FREE";
  const isPremium = plan.plan_type === "PREMIUM";

  const getCardColors = () => {
    if (isFree) return ["#667eea", "#764ba2"];
    if (isPremium) return ["#ffecd2", "#fcb69f", "#ff9a9e"];
    return ["#aca0ffff", "#ffa0c4ff"];
  };

  const getIconName = () => {
    if (isFree) return "card-outline";
    if (isPremium) return "diamond";
    return "star";
  };

  return (
    <Pressable style={[styles.planCard, isUpgrading && styles.upgradingCard]} onPress={onSelect} disabled={isUpgrading}>
      <LinearGradient colors={getCardColors()} style={styles.planCardGradient} start={[0, 0]} end={[1, 0.8]}>
        {isCurrentPlan && (
          <View style={styles.currentPlanBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
            <ThemedText style={styles.currentPlanText}>Current Plan</ThemedText>
          </View>
        )}

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
      </LinearGradient>
    </Pressable>
  );
}

function FeatureCard({ icon, title, description, colors }) {
  return (
    <View style={styles.featureCard}>
      <LinearGradient colors={colors} style={styles.featureCardGradient} start={[0, 0]} end={[1, 1]}>
        <View style={styles.featureIconContainer}>
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </View>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureDescription}>{description}</ThemedText>
      </LinearGradient>
    </View>
  );
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const { token, isLoading: tokenLoading } = useToken();
  const { data: plansData, isLoading: plansLoading, error: plansError, isError: plansIsError } = useSubscriptionPlans();
  const { data: currentSubscription, isLoading: subscriptionLoading } = useSubscription();
  const { mutate: upgradeSubscription, isPending: isUpgrading } = useUpgradeSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDurationModal, setShowDurationModal] = useState(false);

  if (tokenLoading || plansLoading || subscriptionLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (plansIsError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#ff6b6b" />
        <ThemedText style={styles.errorText}>{plansError.message}</ThemedText>
      </View>
    );
  }

  if (!plansData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-outline" size={64} color="#CBD5E0" />
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

  const features = [
    {
      icon: "shield-checkmark",
      title: "Allergen Detection",
      description: "Advanced scanning for allergen identification",
      colors: ["#ff6b6b", "#ffa500"]
    },
    {
      icon: "time",
      title: "Product History",
      description: "Track and save your scanned products",
      colors: ["#2ed573", "#7bed9f"]
    },
    {
      icon: "call",
      title: "Emergency Contacts",
      description: "Quick access to emergency contacts",
      colors: ["#667eea", "#764ba2"]
    },
    {
      icon: "person",
      title: "Profile Management",
      description: "Manage your allergen profiles easily",
      colors: ["#adb1ffff", "#9fe8fcff"]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </Pressable>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Subscription Plans</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Choose the plan that fits your needs</ThemedText>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Plans Grid */}
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

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={20} color="#2D3748" />
              <ThemedText style={styles.sectionTitle}>What's Included</ThemedText>
            </View>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  colors={feature.colors}
                />
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Duration Selection Modal */}
      <Modal
        visible={showDurationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDurationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.modalHeader} start={[0, 0]} end={[1, 0]}>
              <ThemedText style={styles.modalTitle}>Choose Duration</ThemedText>
              <ThemedText style={styles.modalSubtitle}>
                Select subscription length for {selectedPlan?.plan_type}
              </ThemedText>
            </LinearGradient>

            <View style={styles.durationOptions}>
              {[
                { months: 1, label: "1 Month", badge: "" },
                { months: 3, label: "3 Months", badge: "Save 10%" },
                { months: 6, label: "6 Months", badge: "Save 20%" },
                { months: 12, label: "12 Months", badge: "Save 30%" }
              ].map((option) => (
                <Pressable
                  key={option.months}
                  style={styles.durationOption}
                  onPress={() => handleUpgrade(option.months)}
                  disabled={isUpgrading}
                >
                  <View style={styles.durationContent}>
                    <ThemedText style={styles.durationText}>{option.label}</ThemedText>
                    {option.badge && (
                      <View style={styles.savingsBadge}>
                        <ThemedText style={styles.savingsText}>{option.badge}</ThemedText>
                      </View>
                    )}
                  </View>
                  {isUpgrading ? (
                    <ActivityIndicator size="small" color="#667eea" />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7ECFF",
    flex: 1,
    paddingTop: 25
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
    padding: 24,
    gap: 16
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center"
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2
  },
  headerContent: {
    flex: 1
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666"
  },

  scrollView: {
    flex: 1
  },
  content: {
    padding: 20
  },

  // Plans Styles
  plansContainer: {
    gap: 16,
    marginBottom: 32
  },
  planCard: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8
  },
  planCardGradient: {
    padding: 24,
    minHeight: 180
  },
  upgradingCard: {
    opacity: 0.6
  },
  currentPlanBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6
  },
  currentPlanText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF"
  },
  planIconContainer: {
    alignItems: "center",
    marginBottom: 16
  },
  planIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center"
  },
  planContent: {
    alignItems: "center",
    gap: 12
  },
  planName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF"
  },
  planFeatures: {
    gap: 8,
    alignItems: "center"
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  featureText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500"
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    marginTop: 8
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF"
  },

  // Features Section
  featuresSection: {
    marginBottom: 32
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748"
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  featureCard: {
    width: "48%",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4
  },
  featureCardGradient: {
    padding: 20,
    alignItems: "center",
    height: 200
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4
  },
  featureDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 16
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 24,
    margin: 20,
    width: "90%",
    maxWidth: 400,
    overflow: "hidden",
    elevation: 20
  },
  modalHeader: {
    padding: 24,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8
  },
  modalSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center"
  },
  durationOptions: {
    padding: 24,
    gap: 12
  },
  durationOption: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  durationContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  durationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333"
  },
  savingsBadge: {
    backgroundColor: "#2ed573",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  savingsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF"
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingVertical: 20
  },
  cancelButtonText: {
    color: "#dc3545",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  },

  bottomSpacing: {
    height: 100
  }
});
