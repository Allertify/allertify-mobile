import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedButton } from "@/components/ui/ThemedButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ScannerFrame } from "./ScannerFrame";

export function BarcodeScanner({ containerStyle }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [scanned, setScanned] = useState(false);

  const router = useRouter();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      return () => {
        setScanned(false);
      };
    }, [])
  );

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

    setTimeout(() => {
      router.push(`/product/${scanningResult.data}`);
    }, 100);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {isFocused && (
        <CameraView
          key={String(isFocused)}
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"]
          }}
        />
      )}
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
