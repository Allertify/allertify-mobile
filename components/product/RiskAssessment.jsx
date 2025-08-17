import { StyleSheet, View } from 'react-native';

import { ThemedText } from '../ui/ThemedText';

export function RiskAssessment({ riskLevel }) {
  const getRiskStyle = (level) => {
    switch (level) {
      case 'low':
        return styles.lowRisk;
      case 'high':
        return styles.highRisk;
      default:
        return styles.mediumRisk;
    }
  };

  const getRiskText = (level) => {
    return `${level.charAt(0).toUpperCase() + level.slice(1)} Risk`;
  };

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Risk Assessment</ThemedText>
      <View style={styles.riskContainer}>
        <View style={[styles.riskBadge, getRiskStyle(riskLevel)]}>
          <ThemedText style={styles.riskText}>
            {getRiskText(riskLevel)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  riskContainer: {
    marginBottom: 8,
  },
  riskBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  lowRisk: {
    backgroundColor: '#D4EDDA',
  },
  mediumRisk: {
    backgroundColor: '#FFF3CD',
  },
  highRisk: {
    backgroundColor: '#F8D7DA',
  },
  riskText: {
    fontSize: 14,
    color: '#856404',
  },
});
