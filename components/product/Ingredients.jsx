import { StyleSheet, View } from 'react-native';

import { ThemedText } from '../ui/ThemedText';

export function Ingredients({ ingredients }) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Ingredients</ThemedText>
      <ThemedText style={styles.ingredients}>{ingredients}</ThemedText>
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
  ingredients: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
});
