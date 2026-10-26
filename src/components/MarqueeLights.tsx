import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useReducedMotion,
  withDelay,
  withSequence,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/src/theme/tokens';

type Props = {
  count?: number;
  /** Alternate the lights while the reels spin. */
  active: boolean;
  /** A new value runs a chase around the board to celebrate the result. */
  celebrateKey?: number;
  /** Run the chase right-to-left (bottom row, so it circles the board). */
  reverse?: boolean;
};

const CHASE_ROUNDS = 2;
const CHASE_MS = 1100;
/** Bulbs lit at once in the running group. */
const CHASE_GROUP = 3;

type BulbProps = {
  index: number;
  count: number;
  phase: SharedValue<number>;
  blink: SharedValue<number>;
  chase: SharedValue<number>;
  chaseOn: SharedValue<number>;
};

function Bulb({ index, count, phase, blink, chase, chaseOn }: BulbProps) {
  const style = useAnimatedStyle(() => {
    const on = index % 2 === 1 ? phase.value : 1 - phase.value;
    // Idle (blink 0): all lit. Spinning (blink 1): neighbours alternate.
    const blinkOpacity = 1 - blink.value * (1 - on) * 0.65;
    const head = Math.floor(chase.value) % count;
    const inGroup = (head - index + count) % count < CHASE_GROUP;
    const chaseOpacity = inGroup ? 1 : 0.25;
    return {
      opacity:
        blinkOpacity * (1 - chaseOn.value) + chaseOpacity * chaseOn.value,
    };
  });
  return <Animated.View style={[styles.bulb, style]} />;
}

/** Row of marquee bulbs: blink while spinning, chase on a result. */
export function MarqueeLights({
  count = 13,
  active,
  celebrateKey = 0,
  reverse = false,
}: Props) {
  const reduceMotion = useReducedMotion();
  const phase = useSharedValue(0);
  const blink = useSharedValue(0);
  const chase = useSharedValue(0);
  const chaseOn = useSharedValue(0);

  useEffect(() => {
    if (active && !reduceMotion) {
      blink.value = 1;
      phase.value = 0;
      phase.value = withRepeat(withTiming(1, { duration: 160 }), -1, true);
    } else {
      cancelAnimation(phase);
      blink.value = withTiming(0, { duration: 200 });
    }
  }, [active, phase, blink, reduceMotion]);

  useEffect(() => {
    if (celebrateKey === 0 || reduceMotion) {
      return;
    }
    chase.value = 0;
    chase.value = withTiming(count * CHASE_ROUNDS, {
      duration: CHASE_MS,
      easing: Easing.linear,
    });
    chaseOn.value = withSequence(
      withTiming(1, { duration: 80 }),
      withDelay(CHASE_MS - 160, withTiming(0, { duration: 200 })),
    );
  }, [celebrateKey, chase, chaseOn, count, reduceMotion]);

  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, index) => (
        <Bulb
          key={index}
          index={reverse ? count - 1 - index : index}
          count={count}
          phase={phase}
          blink={blink}
          chase={chase}
          chaseOn={chaseOn}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bulb: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bulb,
    boxShadow: `0 0 6px ${colors.bulb}`,
  },
});
