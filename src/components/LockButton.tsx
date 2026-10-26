import { LockSimple } from 'phosphor-react-native/src/icons/LockSimple';
import { LockSimpleOpen } from 'phosphor-react-native/src/icons/LockSimpleOpen';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@/src/theme/tokens';

type Props = {
  label: string;
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
};

/** Quiet hold toggle under a reel: open lock = free, filled lock = held. */
export function LockButton({ label, active, disabled, onPress }: Props) {
  const Icon = active ? LockSimple : LockSimpleOpen;

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
      <Icon
        size={24}
        weight={active ? 'fill' : 'regular'}
        color={active ? colors.highlight : colors.textMuted}
      />
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
