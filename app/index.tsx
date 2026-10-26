import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/src/components/AppBackground';
import { LockButton } from '@/src/components/LockButton';
import { SAVE_BUTTON_SIZE, SaveButton } from '@/src/components/SaveButton';
import { SFIcon } from '@/src/components/SFIcon';
import { MarqueeTitle } from '@/src/components/MarqueeTitle';
import { ResultAura } from '@/src/components/ResultAura';
import { REEL_POP_STAGGER_MS, SlotReel } from '@/src/components/SlotReel';
import { SpinButton } from '@/src/components/SpinButton';
import { FEATURES } from '@/src/config/features';
import * as feedback from '@/src/features/spin/feedback';
import { useSlotMachine } from '@/src/features/spin/useSlotMachine';
import { useSavedMeals } from '@/src/features/saved/savedMeals';
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
  const {
    meal,
    locked,
    spinning,
    reelSpins,
    allLocked,
    resultKey,
    deniedKey,
    spinAll,
    spinReel,
    toggleLock,
  } = useSlotMachine();
  const [motionEnabled, setMotionEnabled] = useState(true);
  const {
    saved,
    isSaved,
    toggle: toggleSaved,
    reload: reloadSaved,
  } = useSavedMeals(meal);
  const onSave = useCallback(async () => {
    const nowSaved = await toggleSaved();
    if (nowSaved) feedback.saved();
    else feedback.holdToggled();
  }, [toggleSaved]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      loadMotionEnabled().then((value) => {
        if (alive) setMotionEnabled(value);
      });
      // Deletions on the saved screen must clear the bookmark here.
      reloadSaved();
      return () => {
        alive = false;
      };
    }, [reloadSaved]),
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
          <View style={styles.topActions}>
            {FEATURES.savedMeals && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Gespeicherte Kombinationen, ${saved.length}`}
                onPress={() => router.push('/saved')}
                style={styles.iconButton}>
                <SFIcon name="savedList" size={20} color={colors.text} />
                {saved.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{saved.length}</Text>
                  </View>
                )}
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Einstellungen"
              onPress={() => router.push('/settings')}
              style={styles.iconButton}>
              <SFIcon name="settings" size={20} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.stage}>
          <View>
            <ResultAura triggerKey={resultKey} borderRadius={radii.xl} />
            <View style={styles.cabinet}>
              <View style={styles.marquee}>
                <MarqueeTitle
                  text="Food Slot Machine"
                  style={styles.marqueeTitle}
                  active={spinning}
                />
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
                      popKey={resultKey}
                      popDelay={
                        SLOT_ORDER.indexOf(category) * REEL_POP_STAGGER_MS
                      }
                      disabled={spinning}
                      onPress={() => toggleLock(category)}
                      onSwipe={(direction) => spinReel(category, direction)}
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
        </View>

        <View style={styles.footer}>
          <View style={styles.controls}>
            {/* Spacer keeps Spin centred against the save key. */}
            {FEATURES.savedMeals && <View style={styles.controlSide} />}
            <SpinButton
              onPress={spinAll}
              dimmed={spinning || allLocked}
              shakeKey={deniedKey}
              glowKey={resultKey}
              label="Spin"
              accessibilityLabel={spinA11yLabel}
            />
            {FEATURES.savedMeals && (
              <View style={styles.controlSide}>
                <SaveButton
                  saved={isSaved}
                  disabled={spinning}
                  onPress={onSave}
                />
              </View>
            )}
          </View>
          <Text style={styles.hint}>
            {motionEnabled
              ? 'Drück den Knopf – oder kipp das iPhone kurz nach vorne'
              : 'Drück den Knopf, um zu drehen'}
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
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  topActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.highlight,
  },
  badgeText: {
    ...typography.label,
    fontSize: 10,
    letterSpacing: 0,
    color: colors.text,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  stage: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  /** Rounded metal block, lit from above, sitting heavy on the backdrop. */
  cabinet: {
    padding: spacing.xs + 3,
    gap: spacing.xs + 3,
    borderRadius: radii.xl,
    backgroundImage: gradients.cabinet,
    boxShadow: [
      'inset 0 2px 0 rgba(255, 255, 255, 0.9)',
      'inset 0 -6px 10px rgba(40, 28, 60, 0.45)',
      'inset 2px 0 4px rgba(255, 255, 255, 0.35)',
      '0 2px 0 rgba(70, 58, 90, 0.9)',
      '0 26px 48px rgba(14, 8, 22, 0.6)',
    ].join(', '),
  },
  /** Dark glass sign plate set into the metal. */
  marquee: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.sm + 6,
    borderRadius: radii.lg,
    backgroundImage: gradients.plate,
    boxShadow: [
      'inset 0 3px 8px rgba(0, 0, 0, 0.6)',
      'inset 0 -1px 0 rgba(255, 255, 255, 0.12)',
      '0 1px 0 rgba(255, 255, 255, 0.7)',
    ].join(', '),
  },
  marqueeTitle: {
    ...typography.marquee,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
  inset: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs + 2,
    paddingTop: spacing.md - 2,
    paddingBottom: spacing.sm + 2,
    borderRadius: radii.lg,
    backgroundColor: colors.cabinetInset,
    boxShadow: [
      'inset 0 5px 14px rgba(0, 0, 0, 0.8)',
      'inset 0 -1px 0 rgba(255, 255, 255, 0.1)',
      '0 1px 0 rgba(255, 255, 255, 0.7)',
    ].join(', '),
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
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  controlSide: {
    width: SAVE_BUTTON_SIZE,
    alignItems: 'center',
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
