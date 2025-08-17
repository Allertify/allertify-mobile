import { StyleSheet, View, ScrollView } from 'react-native';

import { HorizontalList } from '@/components/lists/HorizontalList';
import { ThemedText } from '@/components/ui/ThemedText';

export default function ProductsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <ThemedText style={styles.title}>🟢 Green List</ThemedText>
        <ThemedText style={styles.description}>
          Safe products that are generally well-tolerated
        </ThemedText>
        <HorizontalList itemCount={6} type="product" listType="green" />
        <HorizontalList itemCount={6} type="product" listType="green" />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.title}>🔴 Red List</ThemedText>
        <ThemedText style={styles.description}>
          Products that may cause adverse reactions
        </ThemedText>
        <HorizontalList itemCount={6} type="product" listType="red" />
        <HorizontalList itemCount={6} type="product" listType="red" />
      </View>

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
  section: {
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'Satoshi-Bold',
  },
  bottomSpacing: {
    height: 100,
  },
});
