import { Image, StyleSheet, Text, View } from 'react-native';

import { SFIcon } from './SFIcon';
import { getFoodImage } from '@/src/data/foodImages';
import { colors, radii } from '@/src/theme/tokens';

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
    // No emoji and no art yet: quiet grey SF Symbol placeholder.
    return (
      <View
        style={[
          styles.placeholder,
          { width: size * 0.78, height: size * 0.78, margin: size * 0.11 },
        ]}
        accessibilityLabel={name}>
        <SFIcon
          name="foodPlaceholder"
          size={size * 0.34}
          weight="medium"
          color={colors.inkMuted}
        />
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
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(29, 24, 38, 0.07)',
  },
});
