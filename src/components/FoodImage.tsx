import { Image, StyleSheet, Text, View } from 'react-native';

import { SFIcon } from './SFIcon';
import { getFoodImage } from '@/src/data/foodImages';
import { colors } from '@/src/theme/tokens';

type Props = {
  imageKey: string;
  name: string;
  /** System emoji; used when the food has no image. */
  emoji?: string;
  size?: number;
};

/** Food art in priority order: Ingredient Atlas image → emoji → grey SF Symbol. */
export function FoodImage({ imageKey, name, emoji, size = 96 }: Props) {
  const source = getFoodImage(imageKey);

  if (source) {
    return (
      <Image
        source={source}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityLabel={name}
      />
    );
  }

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

/** Emoji glyphs have side bearings; this fills the box like the art does. */
const EMOJI_SCALE = 0.82;

const styles = StyleSheet.create({
  emojiBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(29, 24, 38, 0.07)',
  },
});
