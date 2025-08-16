import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ThemedText>Profile</ThemedText>
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
