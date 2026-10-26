import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { GearSix } from 'phosphor-react-native/src/icons/GearSix';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/src/components/AppBackground';
import { LockButton } from '@/src/components/LockButton';
import { MarqueeLights } from '@/src/components/MarqueeLights';
import { SlotReel } from '@/src/components/SlotReel';
import { SpinButton } from '@/src/components/SpinButton';
import { useSlotMachine } from '@/src/features/spin/useSlotMachine';
import { loadMotionEnabled } from '@/src/sensors/motionSettings';
import { useForwardThrust } from '@/src/sensors/useForwardThrust';
import {
  colors,
  gradients,
  radii,
  spacing,
  typography,
} from '@/src/theme/tokens';
import { CATEGORY_LABELS, SLOT_ORDER } from '@/src/data/types';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { meal, locked, spinning, reelSpins, allLocked, spinAll, toggleLock } =
    useSlotMachine();
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
    enabled: Platform.OS !== 'web' && motionEnabled && !spinning && !allLocked,
    onThrust,
  });

  const spinA11yLabel = spinning
    ? 'Dreht'
    : allLocked
      ? 'Alles gehalten'
      : 'Spin, Walzen drehen';

  return (
    <AppBackground>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + spacing.sm,
            paddingBottom: insets.bottom + spacing.md,
          },
        ]}>
        <View style={styles.topBar}>
          <Text style={styles.tagline}>Drei Zutaten. Eine Mahlzeit.</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Einstellungen"
            onPress={() => router.push('/settings')}
            style={styles.iconButton}>
            <GearSix size={22} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.stage}>
          <View style={styles.cabinet}>
            <View style={styles.marquee}>
              <MarqueeLights active={spinning} />
              <Text
                style={styles.marqueeTitle}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}>
                Food Slot Machine
              </Text>
              <MarqueeLights active={spinning} />
            </View>

            <View style={styles.inset}>
              <View style={styles.row}>
                {SLOT_ORDER.map((category) => (
                  <Text
                    key={category}
                    style={styles.categoryLabel}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}>
                    {CATEGORY_LABELS[category]}
                  </Text>
                ))}
              </View>

              <View style={styles.reels}>
                {SLOT_ORDER.map((category) => (
                  <SlotReel
                    key={category}
                    category={category}
                    food={meal[category]}
                    spin={reelSpins[category]}
                    locked={locked[category]}
                    disabled={spinning}
                    onPress={() => toggleLock(category)}
                  />
                ))}
              </View>

              <View style={styles.row}>
                {SLOT_ORDER.map((category) => (
                  <View key={category} style={styles.lockCell}>
                    <LockButton
                      label={CATEGORY_LABELS[category]}
                      active={locked[category]}
                      disabled={spinning}
                      onPress={() => toggleLock(category)}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <SpinButton
            onPress={spinAll}
            disabled={spinning || allLocked}
            label="Spin"
            accessibilityLabel={spinA11yLabel}
          />
          <Text style={styles.hint}>
            {motionEnabled
              ? 'Tippe Spin, oder schieb das iPhone kurz nach vorne'
              : 'Tippe Spin'}
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
    gap: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  tagline: {
    ...typography.headline,
    color: colors.text,
    flex: 1,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
  },
  stage: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  cabinet: {
    padding: spacing.xs + 2,
    gap: spacing.xs + 2,
    borderRadius: radii.xl,
    backgroundImage: gradients.chrome,
    boxShadow: '0 18px 40px rgba(0, 0, 0, 0.45)',
  },
  marquee: {
    gap: spacing.xs + 2,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.35)',
  },
  marqueeTitle: {
    ...typography.marquee,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 34,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
  inset: {
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.xs + 2,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxs,
    borderRadius: radii.lg,
    backgroundColor: colors.cabinetInset,
    boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.7)',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  categoryLabel: {
    ...typography.label,
    flex: 1,
    color: colors.textMuted,
    textAlign: 'center',
  },
  lockCell: {
    flex: 1,
    alignItems: 'center',
  },
  reels: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  footer: {
    gap: spacing.md,
  },
  hint: {
    ...typography.hint,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
