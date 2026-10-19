import { Image, StyleSheet, Text, View } from 'react-native';

import { getFoodImage } from '@/src/data/foodImages';
import { colors, radii, typography } from '@/src/theme/tokens';

type Props = {
  imageKey: string;
  name: string;
  size?: number;
};

export function FoodImage({ imageKey, name, size = 96 }: Props) {
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

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.md,
  },
  fallbackLetter: {
    ...typography.brand,
    color: colors.accent,
    fontSize: 28,
  },
});
