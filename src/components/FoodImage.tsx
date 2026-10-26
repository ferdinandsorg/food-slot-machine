import { Image, StyleSheet, Text, View } from 'react-native';

import { getFoodImage } from '@/src/data/foodImages';
import { colors, radii, typography } from '@/src/theme/tokens';

type Props = {
  imageKey: string;
  name: string;
  /** System emoji; takes precedence over the image asset. */
  emoji?: string;
  size?: number;
};

export function FoodImage({ imageKey, name, emoji, size = 96 }: Props) {
  if (emoji) {
    return (
      <View
        style={[styles.emojiBox, { width: size, height: size }]}
        accessibilityLabel={name}>
        <Text
          style={[
            styles.emoji,
            { fontSize: size * EMOJI_SCALE, lineHeight: size },
          ]}>
          {emoji}
        </Text>
      </View>
    );
  }

  const source = getFoodImage(imageKey);

  if (!source) {
    return (
      <View style={[styles.fallback, { width: size, height: size }]}>
        <Text style={styles.fallbackLetter}>{name.charAt(0)}</Text>
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={{ width: size, height: size, borderRadius: radii.md }}
      resizeMode="contain"
      accessibilityLabel={name}
    />
  );
}

/** Emoji glyphs have side bearings; this fills the box like the art does. */
const EMOJI_SCALE = 0.82;

const styles = StyleSheet.create({
  emojiBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
    // Soft contact shadow so the glyph sits on the drum instead of floating.
    textShadowColor: 'rgba(29, 24, 38, 0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.md,
  },
  fallbackLetter: {
    ...typography.headline,
    color: colors.accent,
    fontSize: 28,
  },
});
