import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SFIcon } from './SFIcon';
import { colors } from '@/src/theme/tokens';

type Props = {
  label: string;
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
};

/** Quiet hold toggle under a reel: SF Symbol lock.open = free, lock.fill = held. */
export function LockButton({ label, active, disabled, onPress }: Props) {
  const scale = useSharedValue(1);
  const mounted = useRef(false);

  // Small click-bounce whenever the hold state flips.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    scale.value = withSequence(
      withTiming(1.25, { duration: 90 }),
      withSpring(1, { damping: 10, stiffness: 300 }),
    );
  }, [active, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: active, disabled }}
      accessibilityLabel={`${label} festhalten`}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && !active && styles.disabled,
      ]}>
      <Animated.View style={iconStyle}>
        <SFIcon
          name={active ? 'lock' : 'lockOpen'}
          size={22}
          weight={active ? 'semibold' : 'regular'}
          color={active ? colors.highlight : colors.textMuted}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.9 }],
  },
  disabled: {
    opacity: 0.4,
  },
});
