import { StyleSheet, View } from "react-native";

import { BarcodeScanner } from "@/components/BarcodeScanner";

export default function ScanProductScreen() {
  return (
    <View style={styles.container}>
      <BarcodeScanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
