import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/src/components/AppBackground';
import { SlotReel } from '@/src/components/SlotReel';
import { SpinButton } from '@/src/components/SpinButton';
import { useSlotMachine } from '@/src/features/spin/useSlotMachine';
import { loadMotionEnabled } from '@/src/sensors/motionSettings';
import { useForwardThrust } from '@/src/sensors/useForwardThrust';
import { colors, spacing, typography } from '@/src/theme/tokens';
import { SLOT_ORDER } from '@/src/data/types';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { meal, spinning, spinningSlots, spinAll, spinSlot } = useSlotMachine();
  const [motionEnabled, setMotionEnabled] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      loadMotionEnabled().then((value) => {
        if (alive) setMotionEnabled(value);
      });
      return () => {
        alive = false;
      };
    }, []),
  );

  const onThrust = useCallback(() => {
    if (!spinning) {
      spinAll();
    }
  }, [spinAll, spinning]);

  useForwardThrust({
    enabled: Platform.OS !== 'web' && motionEnabled && !spinning,
    onThrust,
  });

  const compact = width < 380;

  return (
    <AppBackground>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + spacing.lg,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}>
        <View style={styles.topBar}>
          <View style={styles.brandBlock}>
            <Text style={styles.brand}>Food Slot</Text>
            <Text style={styles.tagline}>
              Drei Zutaten. Eine Mahlzeit. Überrasch dich.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Einstellungen"
            onPress={() => router.push('/settings')}
            style={styles.iconButton}>
            <Text style={styles.iconButtonText}>⚙</Text>
          </Pressable>
        </View>

        <View style={styles.machine}>
          <View style={styles.reels}>
            {SLOT_ORDER.map((category) => (
              <SlotReel
                key={category}
                category={category}
                food={meal?.[category] ?? null}
                spinning={spinningSlots[category]}
                disabled={spinning}
                onRespin={() => spinSlot(category)}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <SpinButton
            onPress={spinAll}
            disabled={spinning}
            label={spinning ? 'Dreht …' : 'Drehen'}
          />
          <Text style={[styles.hint, compact && styles.hintCompact]}>
            {motionEnabled
              ? 'Oder iPhone kurz nach vorne schieben'
              : 'Bewegungsgeste ist aus — starte per Button'}
          </Text>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  brandBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  brand: {
    ...typography.brand,
    color: colors.text,
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
  },
  iconButtonText: {
    fontSize: 20,
    color: colors.text,
  },
  machine: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  reels: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'stretch',
  },
  footer: {
    gap: spacing.md,
  },
  hint: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  hintCompact: {
    fontSize: 13,
  },
});
