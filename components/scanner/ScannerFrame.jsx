import { StyleSheet, View } from "react-native";

import { ThemedButton } from "@/components/ui/ThemedButton";

export function ScannerFrame({ onFlipCamera }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.scanFrame}>
        <View style={styles.corner} />
        <View style={[styles.corner, styles.cornerTopRight]} />
        <View style={[styles.corner, styles.cornerBottomLeft]} />
        <View style={[styles.corner, styles.cornerBottomRight]} />
      </View>

      <ThemedButton label="FLIP CAMERA" onPress={onFlipCamera} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(0, 0, 0, 0.7)"
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
