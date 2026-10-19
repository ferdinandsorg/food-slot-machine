import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/src/theme/tokens';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Nicht gefunden' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Seite nicht gefunden</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Zur Slot Machine</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.bgBottom,
  },
  title: {
    ...typography.headline,
    color: colors.text,
  },
  link: {
    marginTop: spacing.md,
  },
  linkText: {
    ...typography.body,
    color: colors.accent,
  },
});
