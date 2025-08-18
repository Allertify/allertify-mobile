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

export default function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams();

  // hardcode for now, use user data later
  const allergies = ["Nuts", "Clams"];

  const { data: product, isLoading, error, isError } = useProduct(productId, allergies);

  if (isLoading) {
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

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ProductImage imageUrl={product.image_url} />
        </View>

        <ProductBasicInfo
          product={{
            id: productId,
            name: product.product_name,
            brand: "Unknown",
            barcode: productId,
            image: product.image_url
          }}
        />

        <RiskAssessment riskLevel={product.analysis.risk_assessment} />
        <AllergensList allergens={product.analysis.allergens_detected} />
        <Analysis analysis={product.analysis.reason} />
        <Ingredients ingredients={product.ingredients} />

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <ProductActions />
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
  }
});
