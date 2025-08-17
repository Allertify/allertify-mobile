import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';

export function BarcodeScanner({ style, containerStyle }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, containerStyle]}>
        <ThemedText>We need your permission to show the camera</ThemedText>
        <ThemedButton onPress={requestPermission} label="GRANT PERMISSION" />
      </View>
    );
  }

  const handlePress = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleBarcodeScanned = (scanningResult) => {
    if (scanned) return;
    setScanned(true);

    Alert.alert(
      'Barcode Scanned',
      `Type: ${scanningResult.type}\nData: ${scanningResult.data}`,
      [
        { text: 'OK', onPress: () => setScanned(false) },
        {
          text: 'Scan Again',
          onPress: () => setScanned(false),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <CameraView
        style={[styles.camera, style]}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            'ean13',
            'ean8',
            'upc_a',
            'upc_e',
            'code39',
            'code128',
            'qr',
          ],
        }}
      />
      <View style={styles.overlay}>
        <ThemedButton label="FLIP CAMERA" onPress={handlePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  camera: {
    flex: 1,
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: 40,
  },
});
