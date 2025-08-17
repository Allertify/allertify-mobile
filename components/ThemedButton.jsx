import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

export function ThemedButton({ style, variant = 'default', label, ...props }) {
  return (
    <Pressable
      style={[
        styles.default,
        variant === 'destructive' ? styles.destructive : undefined,
        style,
      ]}
      {...props}
    >
      <ThemedText style={styles.label}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: '#91bef8',
    borderRadius: 16,
    padding: 16,
  },
  destructive: {
    backgroundColor: '#ff3b30',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
