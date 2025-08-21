import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { AllergensList } from "@/components/product/AllergensList";
import { Analysis } from "@/components/product/Analysis";
import { Ingredients } from "@/components/product/Ingredients";
import { ProductBasicInfo } from "@/components/product/ProductBasicInfo";
import { ProductImage } from "@/components/product/ProductImage";
import { RiskAssessment } from "@/components/product/RiskAssessment";
import { Colors } from "@/constants/Colors";
import { useSavedScans } from "@/hooks/useSavedScans";
import { useToken } from "@/hooks/useToken";
import { ThemedText } from "@/components/ui/ThemedText";

export default function ProductDetailsScreen() {
  const { scanId } = useLocalSearchParams();
  const { token, isLoading: tokenLoading } = useToken();
  const { data, isLoading, error, isError } = useSavedScans(token);

  if (tokenLoading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error?.message}</Text>
      </View>
    );
  }

  if (!isLoading && !data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const scan = data.scans.find((scan) => String(scan.id) === String(scanId));

  const savedStatus = (() => {
    if (scan?.listType === "RED") {
      return { label: "Saved in RED list", bgColor: Colors.red, textColor: "#fff" };
    }
    if (scan?.listType === "GREEN") {
      return { label: "Saved in GREEN list", bgColor: Colors.green, textColor: "#fff" };
    }
    return { label: "Not saved", bgColor: "#dddddd", textColor: "#333333" };
  })();

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ProductImage imageUrl={scan.product.imageUrl} />
        </View>

        <ProductBasicInfo
          product={{
            name: scan.product.name,
            barcode: scan.product.barcode
          }}
        />

        <View style={[styles.statusBadge, { backgroundColor: savedStatus.bgColor }]}>
          <ThemedText style={[styles.statusText, { color: savedStatus.textColor }]}>{savedStatus.label}</ThemedText>
        </View>

        <RiskAssessment riskLevel={scan.riskLevel} />
        {Array.isArray(scan.matchedAllergens) && scan.matchedAllergens.length > 0 && (
          <AllergensList allergens={scan.matchedAllergens} />
        )}
        {!!scan.riskExplanation && <Analysis analysis={scan.riskExplanation} />}
        {!!scan.product.ingredients && <Ingredients ingredients={scan.product.ingredients} />}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 24
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 24
  },
  bottomSpacing: {
    height: 120
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24
  },
  errorText: {
    fontSize: 16,
    color: Colors.red,
    textAlign: "center"
  },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16
  },
  statusText: {
    fontSize: 12
  }
});
