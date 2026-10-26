import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SFIcon } from './SFIcon';
import { colors, gradients } from '@/src/theme/tokens';

export const SAVE_BUTTON_SIZE = 60;

type Props = {
  saved: boolean;
  disabled?: boolean;
  onPress: () => void;
};

/** Quiet key next to Spin: bookmarks the combination on the reels. */
export function SaveButton({ saved, disabled, onPress }: Props) {
  const scale = useSharedValue(1);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    scale.value = withSequence(
      withTiming(1.2, { duration: 90 }),
      withSpring(1, { damping: 10, stiffness: 300 }),
    );
  }, [saved, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: saved, disabled }}
      accessibilityLabel={
        saved ? 'Kombination gespeichert' : 'Kombination speichern'
      }
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.bezel,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <View style={styles.face}>
        <Animated.View style={iconStyle}>
          <SFIcon
            name={saved ? 'bookmarkFill' : 'bookmark'}
            size={22}
            weight="semibold"
            color={saved ? colors.highlight : colors.text}
          />
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Quiet by design (Figma v2): no ring, no outer shadow — just a recessed disc.
  bezel: {
    width: SAVE_BUTTON_SIZE,
    height: SAVE_BUTTON_SIZE,
    borderRadius: SAVE_BUTTON_SIZE / 2,
  },
  face: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SAVE_BUTTON_SIZE,
    backgroundImage: gradients.plate,
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.55)',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
