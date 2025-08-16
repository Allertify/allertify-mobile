import { View, Text, StyleSheet } from 'react-native';

export default function ScanProductScreen() {
  return (
    <View style={styles.container}>
      <Text>Scan Product</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
