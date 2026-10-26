import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, gradients } from '@/src/theme/tokens';

/** Outer diameter of the chrome bezel. */
const SIZE = 124;
/** Width of the silver ring around the cap (same metal as the cabinet). */
const RING = 7;
/** Dark groove between ring and cap. */
const GROOVE = 3;
const CAP = SIZE - 2 * (RING + GROOVE);
const SHAKE_PX = 7;

type Props = {
  onPress: () => void;
  /** Dimmed and still pressable (e.g. all reels held) — onPress reports why. */
  dimmed?: boolean;
  /** No visible text on the cap; this is what VoiceOver reads. */
  label?: string;
  /** Spoken label; defaults to `label`. */
  accessibilityLabel?: string;
  /** A new value shakes the key: the press was refused. */
  shakeKey?: number;
  /** A new value makes the key glow once: invitation to spin again. */
  glowKey?: number;
};

/**
 * Round arcade key: a soft blue cap sitting in a thick chrome bezel,
 * separated by a dark groove. Pressing sinks the cap a little.
 */
export function SpinButton({
  onPress,
  dimmed,
  label = 'Spin',
  accessibilityLabel,
  shakeKey = 0,
  glowKey = 0,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [pressed, setPressed] = useState(false);
  const down = pressed && !dimmed;
  const shake = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (shakeKey === 0 || reduceMotion) return;
    shake.value = withSequence(
      withTiming(-SHAKE_PX, { duration: 50 }),
      withTiming(SHAKE_PX, { duration: 70 }),
      withTiming(-SHAKE_PX * 0.6, { duration: 60 }),
      withTiming(SHAKE_PX * 0.4, { duration: 60 }),
      withTiming(0, { duration: 50 }),
    );
  }, [shakeKey, shake, reduceMotion]);

  useEffect(() => {
    if (glowKey === 0) return;
    // Wait for the result celebration before inviting the next spin.
    glow.value = withDelay(
      900,
      withSequence(
        withTiming(0.35, { duration: 220 }),
        withTiming(0, { duration: 700 }),
      ),
    );
  }, [glowKey, glow]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <Animated.View style={[styles.bezel, dimmed && styles.dimmed, shakeStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={dimmed ? 'Gerade nicht verfügbar' : undefined}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={styles.hit}>
        <View style={styles.groove}>
          <View style={[styles.cap, down && styles.capDown]}>
            <View pointerEvents="none" style={styles.sheen} />
            <Animated.View
              pointerEvents="none"
              style={[styles.glow, glowStyle]}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  /** Slim silver ring in the cabinet's metal, lit from above. */
  bezel: {
    alignSelf: 'center',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    padding: RING,
    backgroundImage: gradients.cabinet,
    borderWidth: 1.5,
    borderColor: 'rgba(30, 24, 40, 0.7)',
    boxShadow: [
      'inset 0 2px 2px rgba(255, 255, 255, 0.85)',
      'inset 0 -3px 5px rgba(40, 32, 56, 0.35)',
      '0 10px 22px rgba(14, 8, 22, 0.45)',
    ].join(', '),
  },
  hit: {
    flex: 1,
  },
  /** Dark gap the cap sits in. */
  groove: {
    flex: 1,
    padding: GROOVE,
    borderRadius: SIZE,
    backgroundColor: 'rgba(22, 30, 44, 0.85)',
    boxShadow: 'inset 0 2px 3px rgba(0, 0, 0, 0.6)',
  },
  cap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: CAP / 2,
    backgroundColor: colors.accent,
    backgroundImage: gradients.spinCap,
    boxShadow: [
      // Rounded lip catching light at the top, soft shade towards the bottom.
      'inset 0 3px 3px rgba(255, 255, 255, 0.55)',
      'inset 0 -6px 10px rgba(50, 24, 120, 0.3)',
      '0 2px 2px rgba(0, 0, 0, 0.35)',
    ].join(', '),
  },
  capDown: {
    transform: [{ scale: 0.96 }, { translateY: 1 }],
    boxShadow: [
      'inset 0 2px 2px rgba(255, 255, 255, 0.35)',
      'inset 0 3px 8px rgba(50, 24, 120, 0.4)',
    ].join(', '),
  },
  /** Soft satin highlight in the upper left of the cap. */
  sheen: {
    position: 'absolute',
    top: CAP * 0.08,
    left: CAP * 0.14,
    width: CAP * 0.6,
    height: CAP * 0.38,
    borderRadius: CAP,
    backgroundImage:
      'radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
  },
  /** Brief light-up after a result. */
  glow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.text,
  },
  dimmed: {
    opacity: 0.55,
  },
});
