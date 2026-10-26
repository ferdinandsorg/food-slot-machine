import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { AppBackground } from '@/src/components/AppBackground';
import {
  loadHapticsEnabled,
  saveHapticsEnabled,
} from '@/src/features/spin/feedback';
import {
  loadMotionEnabled,
  saveMotionEnabled,
} from '@/src/sensors/motionSettings';
import { colors, radii, spacing, typography } from '@/src/theme/tokens';

export default function SettingsScreen() {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  useEffect(() => {
    loadMotionEnabled().then(setMotionEnabled);
    loadHapticsEnabled().then(setHapticsEnabled);
  }, []);

  async function toggleHaptics(value: boolean) {
    setHapticsEnabled(value);
    await saveHapticsEnabled(value);
  }

  async function toggleMotion(value: boolean) {
    setMotionEnabled(value);
    await saveMotionEnabled(value);
  }

  return (
    <AppBackground>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.title}>Bewegungsgeste</Text>
              <Text style={styles.subtitle}>
                Vorwärtsschub des iPhones startet die Slots. Button bleibt immer
                verfügbar.
              </Text>
            </View>
            <Switch
              value={motionEnabled}
              onValueChange={toggleMotion}
              trackColor={{ false: colors.surfaceStrong, true: colors.accent }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.title}>Vibration</Text>
              <Text style={styles.subtitle}>
                Klackern beim Drehen, Ruck beim Stoppen und beim Ergebnis.
              </Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: colors.surfaceStrong, true: colors.accent }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Motion Debug"
          onPress={() => router.push('/motion-debug')}
          style={styles.linkCard}>
          <Text style={styles.title}>Motion Debug</Text>
          <Text style={styles.subtitle}>
            Live-Sensorwerte und Trigger — zum Kalibrieren auf dem Gerät.
          </Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          Food Slot liefert spielerische Mahlzeiteninspiration — keine
          Ernährungsberatung.
        </Text>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  linkCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.reelBorder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.headline,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  disclaimer: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
});
