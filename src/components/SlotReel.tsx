import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { FoodImage } from './FoodImage';
import { getFoodsByCategory } from '@/src/data/loadFoods';
import type { Food, FoodCategory } from '@/src/data/types';
import type { ReelSpin } from '@/src/features/spin/useSlotMachine';
import {
  colors,
  gradients,
  radii,
  spacing,
  typography,
} from '@/src/theme/tokens';

export const REEL_ITEM_HEIGHT = 140;
/** Center item fully visible, neighbours peek in above and below. */
export const REEL_WINDOW_HEIGHT = Math.round(REEL_ITEM_HEIGHT * 1.65);

/** Strip copies: one buffer above + enough turns for the longest spin. */
const STRIP_COPIES = 8;
const WINDUP_MS = 140;
const SETTLE_MS = 220;
/** How far (in items) the reel overshoots before settling back. */
const OVERSHOOT = 0.18;
const MARKER_SIZE = 12;
/** Chrome rim around each reel window. */
const FRAME = 2;

type Props = {
  category: FoodCategory;
  food: Food;
  spin: ReelSpin;
  locked: boolean;
  disabled?: boolean;
  /** Tapping the reel toggles hold. */
  onPress: () => void;
};

export function SlotReel({
  category,
  food,
  spin,
  locked,
  disabled,
  onPress,
}: Props) {
  const pool = useMemo(() => getFoodsByCategory(category), [category]);
  const strip = useMemo(
    () => Array.from({ length: STRIP_COPIES }, () => pool).flat(),
    [pool],
  );
  const count = pool.length;
  const indexOf = (target: Food) =>
    Math.max(
      0,
      pool.findIndex((item) => item.id === target.id),
    );

  // Position in strip items; the base copy (count … 2*count-1) is the resting range.
  const position = useSharedValue(count + indexOf(food));

  useEffect(() => {
    if (spin.key === 0) {
      return;
    }

    const targetIndex = indexOf(food);
    const startIndex = ((Math.round(position.value) % count) + count) % count;
    const start = count + startIndex;
    const delta = (targetIndex - startIndex + count) % count;
    const end = start + spin.loops * count + delta;
    const runMs = Math.max(300, spin.durationMs - WINDUP_MS - SETTLE_MS);

    position.value = start;
    position.value = withSequence(
      // Small pull back, like a lever releasing the drum.
      withTiming(start - 0.3, {
        duration: WINDUP_MS,
        easing: Easing.inOut(Easing.quad),
      }),
      withTiming(end + OVERSHOOT, {
        duration: runMs,
        easing: Easing.bezier(0.2, 0.75, 0.25, 1),
      }),
      withTiming(
        end,
        { duration: SETTLE_MS, easing: Easing.out(Easing.quad) },
        (finished) => {
          if (finished) {
            // Jump back to the identical item in the base copy.
            position.value = count + targetIndex;
          }
        },
      ),
    );
    // Only a new spin key should start the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spin.key]);

  const stripStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          REEL_WINDOW_HEIGHT / 2 -
          REEL_ITEM_HEIGHT / 2 -
          position.value * REEL_ITEM_HEIGHT,
      },
    ],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: locked, disabled }}
      accessibilityLabel={`${food.name} festhalten`}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.frame,
        locked ? styles.frameLocked : styles.frameChrome,
        pressed && styles.pressed,
      ]}>
      <View style={styles.window}>
        <Animated.View style={stripStyle}>
          {strip.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.item}>
              <FoodImage imageKey={item.imageKey} name={item.name} size={76} />
              <Text
                style={styles.name}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.75}>
                {item.name}
              </Text>
            </View>
          ))}
        </Animated.View>
        <View pointerEvents="none" style={styles.curve} />
      </View>
      {locked && (
        <>
          <View
            pointerEvents="none"
            style={[styles.marker, styles.markerLeft]}
          />
          <View
            pointerEvents="none"
            style={[styles.marker, styles.markerRight]}
          />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    padding: FRAME,
    borderRadius: radii.md,
  },
  frameChrome: {
    backgroundImage: gradients.chrome,
  },
  frameLocked: {
    backgroundColor: colors.highlight,
    boxShadow: `0 0 16px ${colors.highlight}`,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  /** Hold markers on the payline, like the arrows on a real machine. */
  marker: {
    position: 'absolute',
    top: FRAME + REEL_WINDOW_HEIGHT / 2 - MARKER_SIZE / 2,
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    backgroundColor: colors.highlight,
    borderWidth: 2,
    borderColor: colors.text,
    transform: [{ rotate: '45deg' }],
  },
  markerLeft: {
    left: -MARKER_SIZE / 2,
  },
  markerRight: {
    right: -MARKER_SIZE / 2,
  },
  window: {
    height: REEL_WINDOW_HEIGHT,
    overflow: 'hidden',
    borderRadius: radii.md - FRAME,
    backgroundColor: colors.reelFace,
  },
  item: {
    height: REEL_ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  name: {
    ...typography.foodName,
    color: colors.ink,
    textAlign: 'center',
  },
  curve: {
    ...StyleSheet.absoluteFill,
    backgroundImage: gradients.reelCurve,
  },
});
