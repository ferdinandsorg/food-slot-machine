import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, gradients, radii, typography } from '@/src/theme/tokens';

const BEZEL = 5;

type Props = {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  /** Spoken label; defaults to `label`. */
  accessibilityLabel?: string;
};

/** Wide lit push key in a chrome bezel, like the spin key on a slot machine. */
export function SpinButton({
  onPress,
  disabled,
  label = 'Spin',
  accessibilityLabel,
}: Props) {
  return (
    <View style={[styles.bezel, disabled && styles.disabled]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.key,
          pressed && !disabled && styles.pressed,
        ]}>
        <View pointerEvents="none" style={styles.gloss} />
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bezel: {
    alignSelf: 'center',
    width: 220,
    height: 76,
    padding: BEZEL,
    borderRadius: radii.md + BEZEL,
    backgroundImage: gradients.chrome,
    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.45)',
  },
  key: {
    flex: 1,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundImage: gradients.spinFace,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 225, 0.5)',
    boxShadow: `0 5px 0 ${colors.accentPressed}, 0 0 24px ${colors.accentGlow}`,
    transform: [{ translateY: -3 }],
  },
  pressed: {
    transform: [{ translateY: 1 }],
    boxShadow: `0 1px 0 ${colors.accentPressed}, 0 0 14px ${colors.accentGlow}`,
  },
  /** Light catching the top half of the key. */
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '48%',
    backgroundImage:
      'linear-gradient(to bottom, rgba(255,255,255,0.38), rgba(255,255,255,0.06))',
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    ...typography.spinLabel,
    color: colors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
});
