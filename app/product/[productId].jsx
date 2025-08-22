import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { AllergensList } from "@/components/product/AllergensList";
import { Analysis } from "@/components/product/Analysis";
import { Ingredients } from "@/components/product/Ingredients";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductBasicInfo } from "@/components/product/ProductBasicInfo";
import { ProductImage } from "@/components/product/ProductImage";
import { RiskAssessment } from "@/components/product/RiskAssessment";
import { Colors } from "@/constants/Colors";
import { useProduct } from "@/hooks/useProduct";
import { useSavedScans } from "@/hooks/useSavedScans";
import { useScanLimit } from "@/hooks/useScanLimit";
import { useToken } from "@/hooks/useToken";

export default function ProductDetailsScreen() {
  const { productId: barcode } = useLocalSearchParams();
  const { token, isLoading: tokenLoading } = useToken();
  const { data: scanLimit, isLoading: scanLimitLoading } = useScanLimit(token);
  const { data, isLoading, error, isError } = useProduct(barcode, token, scanLimit?.canScan);
  const { data: savedScansData, isLoading: savedScansLoading } = useSavedScans(token);

  const currentListType = savedScansData?.scans?.find((scan) => scan.productId === data?.product?.id)?.listType || null;

  if (tokenLoading || scanLimitLoading || isLoading || savedScansLoading) {
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

  // Check if scan limit is exceeded
  if (scanLimit && !scanLimit.canScan) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Daily scan limit exceeded</Text>
        <Text style={styles.errorSubtext}>
          You've used {scanLimit.currentUsage} of {scanLimit.dailyLimit} daily scans.
        </Text>
        <Text style={styles.errorSubtext}>Please upgrade your subscription or try again tomorrow.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ProductImage imageUrl={data.product?.imageUrl} />
        </View>

        <ProductBasicInfo
          product={{
            name: data.product?.name,
            barcode: data.product?.barcode
          }}
        />

        {scanLimit && (
          <View style={styles.scanLimitInfo}>
            <Text style={styles.scanLimitText}>{scanLimit.remainingScans} scans remaining today</Text>
          </View>
        )}

        <RiskAssessment riskLevel={data.riskLevel} />
        {Array.isArray(data.matchedAllergens) && data.matchedAllergens.length > 0 && (
          <AllergensList allergens={data.matchedAllergens} />
        )}
        {!!data.riskExplanation && <Analysis analysis={data.riskExplanation} />}
        {!!data.product?.ingredients && <Ingredients ingredients={data.product.ingredients} />}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <ProductActions
        productId={data.product.id}
        scanId={data.id}
        token={token}
        showDelete={false}
        currentListType={currentListType}
      />
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
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20
  },
  scanLimitInfo: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center"
  },
  scanLimitText: {
    fontSize: 14,
    color: "#0066cc",
    fontWeight: "500"
  }
});
