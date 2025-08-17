import { ScrollView, StyleSheet } from 'react-native';
import { PlaceholderItem } from '../common/PlaceholderItem';
import { ProductItem } from '../product/ProductItem';

export function HorizontalList({
  itemCount = 5,
  type = 'placeholder',
  listType = 'green',
}) {
  const renderItem = (index) => {
    if (type === 'product') {
      return (
        <ProductItem
          key={index}
          product={{
            id: index.toString(),
            name: `Product ${index + 1}`,
            brand: `Brand ${index + 1}`,
          }}
          listType={listType}
        />
      );
    }
    return <PlaceholderItem key={index} />;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    >
      {Array.from({ length: itemCount }, (_, index) => renderItem(index))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  horizontalList: {
    paddingVertical: 12,
    gap: 8,
  },
});
