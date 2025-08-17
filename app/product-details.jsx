import { StyleSheet, View, ScrollView } from 'react-native';

import { ProductImage } from '@/components/product/ProductImage';
import { ProductBasicInfo } from '@/components/product/ProductBasicInfo';
import { RiskAssessment } from '@/components/product/RiskAssessment';
import { AllergensList } from '@/components/product/AllergensList';
import { Analysis } from '@/components/product/Analysis';
import { Ingredients } from '@/components/product/Ingredients';
import { NutritionFacts } from '@/components/product/NutritionFacts';

const productData = {
  id: '1',
  name: 'Organic Almond Milk',
  brand: 'Silk',
  barcode: '025293002085',
  image: null,
  riskLevel: 'medium',
  allergens: ['Tree Nuts (Almonds)', 'Soy Lecithin'],
  analysis:
    'This product contains almonds, which are tree nuts and a common allergen. While the product is labeled as "almond milk," it may contain trace amounts of other tree nuts due to shared processing facilities. The soy lecithin used as an emulsifier is generally safe for most people but should be considered if you have soy sensitivity.',
  ingredients:
    'Almondmilk (Filtered Water, Almonds), Cane Sugar, Vitamin and Mineral Blend (Calcium Carbonate, Vitamin E Acetate, Vitamin A Palmitate, Vitamin D2), Sea Salt, Gellan Gum, Sunflower Lecithin, Locust Bean Gum, Ascorbic Acid, Natural Flavor.',
  nutrition: {
    calories: '60',
    totalFat: '2.5g',
    protein: '1g',
    carbohydrates: '8g',
  },
};

export default function ProductDetailsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <ProductImage imageUrl={productData.image} />
      </View>

      <ProductBasicInfo product={productData} />
      <RiskAssessment riskLevel={productData.riskLevel} />
      <AllergensList allergens={productData.allergens} />
      <Analysis analysis={productData.analysis} />
      <Ingredients ingredients={productData.ingredients} />
      <NutritionFacts nutrition={productData.nutrition} />

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bottomSpacing: {
    height: 100,
  },
});
