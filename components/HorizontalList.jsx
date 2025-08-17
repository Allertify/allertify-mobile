import { ScrollView, StyleSheet } from "react-native";
import { PlaceholderItem } from "./PlaceholderItem";

export function HorizontalList({ itemCount = 5 }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
      {Array.from({ length: itemCount }, (_, index) => (
        <PlaceholderItem key={index} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  horizontalList: {
    paddingVertical: 12,
    gap: 8,
  },
});
