import { StyleSheet, View } from 'react-native';

import { ThemedText } from '../ui/ThemedText';

export function Analysis({ analysis }) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Analysis</ThemedText>
      <ThemedText style={styles.explanation}>{analysis}</ThemedText>
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
  explanation: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});
