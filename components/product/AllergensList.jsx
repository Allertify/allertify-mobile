import { StyleSheet, View } from 'react-native';

import { ThemedText } from '../ui/ThemedText';

export function AllergensList({ allergens }) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>
        ⚠️ Potential Allergens Detected
      </ThemedText>
      <View style={styles.allergenList}>
        {allergens.map((allergen, index) => (
          <View key={index} style={styles.allergenItem}>
            <View style={styles.allergenDot} />
            <ThemedText style={styles.allergenText}>{allergen}</ThemedText>
          </View>
        ))}
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
  allergenList: {
    gap: 8,
  },
  allergenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  allergenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC3545',
  },
  allergenText: {
    fontSize: 14,
    color: '#DC3545',
  },
});
