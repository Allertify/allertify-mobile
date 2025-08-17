import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { ThemedButton } from "../ui/ThemedButton";
import { ThemedText } from "../ui/ThemedText";

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

  const handlePress = () => {
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
      <View style={styles.overlay}>
        <View style={styles.scanFrame}>
          <View style={styles.corner} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>

        <ThemedButton label="FLIP CAMERA" onPress={handlePress} style={styles.button} />
      </View>
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
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    padding: 40
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  scanFrame: {
    position: "absolute",
    top: "30%",
    left: "15%",
    right: "15%",
    bottom: "40%",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed"
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#fff",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    top: -2,
    left: -2
  },
  cornerTopRight: {
    right: -2,
    left: "auto",
    borderLeftWidth: 0,
    borderRightWidth: 3
  },
  cornerBottomLeft: {
    bottom: -2,
    top: "auto",
    borderTopWidth: 0,
    borderBottomWidth: 3
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    top: "auto",
    left: "auto",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3
  }
});
