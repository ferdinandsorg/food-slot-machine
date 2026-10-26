import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/src/theme/tokens';

type Props = {
  count?: number;
  /** Chase the lights while the reels spin. */
  active: boolean;
};

type BulbProps = {
  phase: SharedValue<number>;
  blink: SharedValue<number>;
  odd: boolean;
};

function Bulb({ phase, blink, odd }: BulbProps) {
  const style = useAnimatedStyle(() => {
    const on = odd ? phase.value : 1 - phase.value;
    // Idle (blink 0): all bulbs lit. Spinning (blink 1): neighbours alternate.
    return { opacity: 1 - blink.value * (1 - on) * 0.65 };
  });
  return <Animated.View style={[styles.bulb, style]} />;
}

/** Row of marquee bulbs; alternate bulbs blink while spinning. */
export function MarqueeLights({ count = 13, active }: Props) {
  const phase = useSharedValue(0);
  const blink = useSharedValue(0);

  useEffect(() => {
    if (active) {
      blink.value = 1;
      phase.value = 0;
      phase.value = withRepeat(withTiming(1, { duration: 160 }), -1, true);
    } else {
      cancelAnimation(phase);
      blink.value = withTiming(0, { duration: 200 });
    }
  }, [active, phase, blink]);

  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, index) => (
        <Bulb key={index} phase={phase} blink={blink} odd={index % 2 === 1} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  bulb: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.bulb,
    boxShadow: `0 0 6px ${colors.bulb}`,
  },
});
