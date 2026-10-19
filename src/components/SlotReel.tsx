import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { FoodImage } from './FoodImage';
import type { Food, FoodCategory } from '@/src/data/types';
import { CATEGORY_LABELS } from '@/src/data/types';
import { colors, radii, spacing, typography } from '@/src/theme/tokens';

type Props = {
  category: FoodCategory;
  food: Food | null;
  spinning: boolean;
  onRespin: () => void;
  disabled?: boolean;
};

export function SlotReel({ category, food, spinning, onRespin, disabled }: Props) {
  const offset = useSharedValue(0);

  useEffect(() => {
    if (spinning) {
      offset.value = withRepeat(
        withTiming(12, { duration: 80, easing: Easing.linear }),
        -1,
        true,
      );
    } else {
      offset.value = withTiming(0, { duration: 180 });
    }
  }, [spinning, offset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
    opacity: spinning ? 0.55 : 1,
  }));

  return (
    <View style={styles.reel}>
      <Text style={styles.label}>{CATEGORY_LABELS[category]}</Text>
      <Animated.View style={[styles.window, animatedStyle]}>
        {food ? (
          <>
            <FoodImage imageKey={food.imageKey} name={food.name} size={88} />
            <Text style={styles.name} numberOfLines={2}>
              {spinning ? '…' : food.name}
            </Text>
          </>
        ) : (
          <Text style={styles.name}>—</Text>
        )}
      </Animated.View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${CATEGORY_LABELS[category]} erneut drehen`}
        disabled={disabled || spinning}
        onPress={onRespin}
        style={({ pressed }) => [
          styles.respin,
          (disabled || spinning) && styles.respinDisabled,
          pressed && !disabled && !spinning && styles.respinPressed,
        ]}>
        <Text style={styles.respinText}>↻</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  reel: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
  },
  window: {
    width: '100%',
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.reelBg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.reelBorder,
  },
  name: {
    ...typography.foodName,
    color: colors.text,
    textAlign: 'center',
    minHeight: 36,
  },
  respin: {
    marginTop: spacing.xs,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
  },
  respinPressed: {
    backgroundColor: colors.accent,
  },
  respinDisabled: {
    opacity: 0.35,
  },
  respinText: {
    color: colors.text,
    fontSize: 20,
  },
});
