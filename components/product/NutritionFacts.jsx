import { StyleSheet, View } from 'react-native';

import { ThemedText } from '../ui/ThemedText';

export function NutritionFacts({ nutrition }) {
  const nutritionItems = [
    { label: 'Calories', value: nutrition.calories },
    { label: 'Total Fat', value: nutrition.totalFat },
    { label: 'Protein', value: nutrition.protein },
    { label: 'Carbohydrates', value: nutrition.carbohydrates },
  ];

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Nutrition Facts</ThemedText>
      {nutritionItems.map((item, index) => (
        <View key={index} style={styles.nutritionItem}>
          <ThemedText style={styles.nutritionLabel}>{item.label}</ThemedText>
          <ThemedText style={styles.nutritionValue}>{item.value}</ThemedText>
        </View>
      ))}
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
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#333',
  },
  nutritionValue: {
    fontSize: 14,
    color: '#666',
  },
});
