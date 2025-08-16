import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';

export default function ScanProductScreen() {
  return (
    <View style={styles.container}>
      <ThemedText>Scan Product</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
});
