import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedLink } from '../../components/ThemedLink';
import { ThemedText } from '../../components/ThemedText';

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
      <View style={styles.sectionContainer}>
        {account.map((item, index) => (
          <ThemedLink key={index} {...item} />
        ))}
      </View>
      <View style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
        {settings.map((item, index) => (
          <ThemedLink key={index} {...item} />
        ))}
      </View>
      <Pressable style={styles.logoutButton}>
        <ThemedText style={styles.logoutButtonText}>LOGOUT</ThemedText>
      </Pressable>
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
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 16,
    marginTop: 16,
    padding: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
