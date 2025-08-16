import { StyleSheet, Text } from 'react-native';

export function ThemedText({ style, ...rest }) {
  return <Text style={[styles.default, style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontFamily: 'Satoshi-Bold',
  },
});
