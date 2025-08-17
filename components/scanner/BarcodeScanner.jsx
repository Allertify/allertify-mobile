import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { ThemedButton } from "@/components/ui/ThemedButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ScannerFrame } from "./ScannerFrame";

export function BarcodeScanner({ style, containerStyle }) {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, containerStyle]}>
        <ThemedText style={{ marginBottom: 16 }}>We need your permission to show the camera</ThemedText>
        <ThemedButton onPress={requestPermission} label="GRANT PERMISSION" />
      </View>
    );
  }

  const handleFlipCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleBarcodeScanned = (scanningResult) => {
    if (scanned) return;
    setScanned(true);

    Alert.alert("Barcode Scanned", `Type: ${scanningResult.type}\nData: ${scanningResult.data}`, [
      { text: "OK", onPress: () => setScanned(false) },
      {
        text: "Scan Again",
        onPress: () => setScanned(false)
      }
    ]);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"]
        }}
      />
      <ScannerFrame onFlipCamera={handleFlipCamera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  camera: {
    flex: 1
  }
});
