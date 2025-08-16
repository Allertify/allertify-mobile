import { StyleSheet, View } from 'react-native';

import { ThemedLink } from '@/components/ThemedLink';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.greeting}>👋 Hey, John Doe!</ThemedText>
      <ThemedLink label="Recent Scans" href="/history" />
      <ThemedLink label="Red Food List" href="/products" />
      <ThemedLink label="Green Food List" href="/products" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 24,
  },
  greeting: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 32,
  },
});
