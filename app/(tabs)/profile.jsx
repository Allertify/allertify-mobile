import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedButton } from '@/components/ThemedButton';
import { ThemedLink } from '@/components/ThemedLink';
import { ThemedText } from '@/components/ThemedText';

const account = [
  {
    href: '/profile/full-name',
    label: 'Full Name',
    description: 'Change your full name',
  },
  {
    href: '/profile/email',
    label: 'Email',
    description: 'Change your email',
  },
  {
    href: '/profile/password',
    label: 'Password',
    description: 'Change your password',
  },
];

const settings = [
  {
    href: '/profile/allergens',
    label: 'Allergens',
    description: 'Manage your allergens',
  },
  {
    href: '/profile/scan-history',
    label: 'History',
    description: 'View your scan history',
  },
  {
    href: '/profile/emergency-contacts',
    label: 'Emergency Contacts',
    description: 'Manage your emergency contacts',
  },
];

export default function ProfileScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={{ marginBottom: 16 }}>
        {account.map((item, index) => (
          <ThemedLink key={index} {...item} />
        ))}
      </View>
      <View style={{ marginBottom: 32 }}>
        <ThemedText style={{ fontSize: 20 }}>Settings</ThemedText>
        {settings.map((item, index) => (
          <ThemedLink key={index} {...item} />
        ))}
      </View>
      <ThemedButton variant="destructive" label="LOGOUT" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 32,
  },
});
