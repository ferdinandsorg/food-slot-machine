import { useEffect } from 'react';
import { StyleSheet, Text, View, type TextStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/** Wave range on the Uncut Sans weight axis (font supports 300–700). */
const LIGHT = 400;
const BOLD = 700;
/** How many letters the bold crest spans. */
const CREST = 3;
const WAVE_MS = 1100;

type Props = {
  text: string;
  style: TextStyle;
  /** Run the light→bold wave through the letters (while the reels spin). */
  active: boolean;
};

type LetterProps = {
  char: string;
  index: number;
  count: number;
  style: TextStyle;
  wave: SharedValue<number>;
  on: SharedValue<number>;
};

function Letter({ char, index, count, style, wave, on }: LetterProps) {
  const animated = useAnimatedStyle(() => {
    // Crest travels from before the first to after the last letter.
    const head = wave.value * (count + CREST * 2) - CREST;
    const t = Math.max(0, 1 - Math.abs(index - head) / CREST);
    const waveWeight = LIGHT + (BOLD - LIGHT) * t * t * (3 - 2 * t);
    const weight = BOLD + (waveWeight - BOLD) * on.value;
    // Weights snap to hundreds on native.
    return {
      fontWeight: String(
        Math.round(weight / 100) * 100,
      ) as TextStyle['fontWeight'],
    };
  });

  return (
    <View>
      {/* Invisible bold copy reserves the widest width so letters never shift. */}
      <Text style={[style, styles.ghost]}>{char}</Text>
      <Animated.Text style={[style, styles.letter, animated]}>
        {char}
      </Animated.Text>
    </View>
  );
}

/** Marquee headline whose letters ripple from light to bold while spinning. */
export function MarqueeTitle({ text, style, active }: Props) {
  const reduceMotion = useReducedMotion();
  const wave = useSharedValue(0);
  const on = useSharedValue(0);
  const chars = Array.from(text);

  useEffect(() => {
    if (active && !reduceMotion) {
      on.value = withTiming(1, { duration: 180 });
      wave.value = 0;
      wave.value = withRepeat(
        withTiming(1, { duration: WAVE_MS, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      on.value = withTiming(0, { duration: 260 });
      cancelAnimation(wave);
    }
  }, [active, reduceMotion, on, wave]);

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="header"
      accessibilityLabel={text}>
      {chars.map((char, index) => (
        <Letter
          key={index}
          char={char}
          index={index}
          count={chars.length}
          style={style}
          wave={wave}
          on={on}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ghost: {
    fontWeight: '700',
    opacity: 0,
  },
  letter: {
    ...StyleSheet.absoluteFill,
    textAlign: 'center',
  },
});
