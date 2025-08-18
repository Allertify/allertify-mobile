import { StyleSheet, View } from "react-native";

import { ThemedText } from "../ui/ThemedText";

export function RiskAssessment({ riskLevel }) {
  const level = (riskLevel || "").toString().trim();

  const getRiskStyle = () => {
    if (level === "SAFE") return styles.lowRisk;
    if (level === "UNSAFE") return styles.highRisk;
    return styles.highRisk;
  };

  const getRiskText = () => {
    return level || "Unknown";
  };

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Risk Assessment</ThemedText>
      <View style={styles.riskContainer}>
        <View style={[styles.riskBadge, getRiskStyle()]}>
          <ThemedText style={styles.riskText}>{getRiskText()}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12
  },
  riskContainer: {
    marginBottom: 8
  },
  riskBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start"
  },
  lowRisk: {
    backgroundColor: "#D4EDDA"
  },
  highRisk: {
    backgroundColor: "#F8D7DA"
  },
  riskText: {
    fontSize: 14,
    color: "#000"
  }
});
