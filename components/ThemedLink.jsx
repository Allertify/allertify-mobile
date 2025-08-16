import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export function ThemedLink({ href, label, description }) {
  return (
    <Link href={href}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          {description && (
            <ThemedText style={styles.description}>{description}</ThemedText>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    paddingVertical: 16,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  label: {
    fontSize: 16,
  },
  description: {
    color: '#666',
    fontSize: 14,
  },
});
