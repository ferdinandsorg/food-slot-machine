import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/src/theme/tokens';

/** Thickness of the light band just outside the machine's rim. */
const RING_WIDTH = 2.5;
/** Covers the cabinet's diagonal while rotating. */
const ORBIT_SIZE = 720;
/** Comet: a soft light spot riding just over the rim. */
const COMET_SIZE = 260;
/** Spot distance from the centre — between the cabinet's half width and half height. */
const COMET_DISTANCE = 230;
/** ~10% shorter than before (light out after ~1.6 s). */
const HOLD_MS = 1080;
const ORBITS = 1.25;

type Props = {
  /** A new value runs the light once around the rim. */
  triggerKey: number;
  borderRadius: number;
};

/**
 * Result effect behind the slot machine: a crisp light band orbits the rim
 * while a soft blurred glow breathes around the whole cabinet.
 * Place it as an absolute sibling *behind* the cabinet.
 */
export function ResultAura({ triggerKey, borderRadius }: Props) {
  const reduceMotion = useReducedMotion();
  const ring = useSharedValue(0);
  const halo = useSharedValue(0);
  const orbit = useSharedValue(0);

  useEffect(() => {
    if (triggerKey === 0) return;
    ring.value = withSequence(
      withTiming(1, { duration: 160 }),
      withDelay(HOLD_MS, withTiming(0, { duration: 380 })),
    );
    halo.value = withSequence(
      withTiming(0.85, { duration: 215 }),
      withTiming(0.4, { duration: 540 }),
      withTiming(0.7, { duration: 340 }),
      withTiming(0, { duration: 540 }),
    );
    if (!reduceMotion) {
      orbit.value = 0;
      orbit.value = withTiming(ORBITS, {
        duration: HOLD_MS + 520,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [triggerKey, reduceMotion, ring, halo, orbit]);

  const ringStyle = useAnimatedStyle(() => ({ opacity: ring.value }));
  const haloStyle = useAnimatedStyle(() => ({ opacity: halo.value }));
  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbit.value * 360}deg` }],
  }));

  const outer = { borderRadius: borderRadius + RING_WIDTH };

  return (
    <View pointerEvents="none" style={styles.root}>
      <Animated.View style={[styles.halo, outer, haloStyle]} />
      <Animated.View style={[styles.ring, outer, ringStyle]}>
        <Animated.View style={[styles.orbit, orbitStyle]}>
          <View style={styles.comet} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: -RING_WIDTH,
    left: -RING_WIDTH,
    right: -RING_WIDTH,
    bottom: -RING_WIDTH,
  },
  /** Soft blur around the whole machine. */
  halo: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.accentGlow,
    boxShadow: `0 0 32px 8px ${colors.accentGlow}`,
  },
  /** Clips the rotating sweep to a thin band around the rim. */
  ring: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  /**
   * One light spot off-centre on a rotating square: as it turns, the spot
   * travels along the rim like a single comet (a centred stripe would light
   * two opposite sides at once).
   */
  orbit: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: ORBIT_SIZE,
    height: ORBIT_SIZE,
    marginTop: -ORBIT_SIZE / 2,
    marginLeft: -ORBIT_SIZE / 2,
    backgroundImage: [
      // Faint full ring so the whole rim glows while the comet passes.
      `radial-gradient(circle at 50% 50%, rgba(139,92,246,0.35) 0%, rgba(139,92,246,0.35) 100%)`,
    ].join(', '),
  },
  comet: {
    position: 'absolute',
    left: ORBIT_SIZE / 2 - COMET_SIZE / 2,
    top: ORBIT_SIZE / 2 - COMET_DISTANCE - COMET_SIZE / 2,
    width: COMET_SIZE,
    height: COMET_SIZE,
    borderRadius: COMET_SIZE / 2,
    backgroundImage: `radial-gradient(circle, #FFFFFF 0%, ${colors.accentLight} 18%, ${colors.accent} 40%, rgba(139,92,246,0) 70%)`,
  },
});
