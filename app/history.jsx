import { StyleSheet, View, ScrollView } from 'react-native';

import { VerticalList } from '@/components/VerticalList';
import { ThemedText } from '@/components/ThemedText';

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedText style={styles.title}>📋 Scan History</ThemedText>
      <ThemedText style={styles.description}>
        Your recent barcode scans and product lookups
      </ThemedText>

      <VerticalList itemCount={8} />

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Satoshi-Bold',
  },
  bottomSpacing: {
    height: 100,
  },
});
