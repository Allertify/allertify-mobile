import { StyleSheet, View } from 'react-native';
import { PlaceholderItem } from './PlaceholderItem';

export function VerticalList({ itemCount = 5 }) {
  return (
    <View style={styles.verticalList}>
      {Array.from({ length: itemCount }, (_, index) => (
        <View key={index} style={styles.itemContainer}>
          <PlaceholderItem />
          <View style={styles.itemContent}>
            <View style={styles.itemTitle} />
            <View style={styles.itemSubtitle} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  verticalList: {
    gap: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemContent: {
    flex: 1,
    gap: 8,
  },
  itemTitle: {
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    width: '80%',
  },
  itemSubtitle: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    width: '60%',
  },
});
