import type { ImageSourcePropType } from 'react-native';

/**
 * Maps imageKey → local asset.
 * Add a require() entry when real art for a food without emoji exists in assets/foods/.
 */
const foodImageMap: Record<string, ImageSourcePropType> = {
  // Empty on purpose: the old circle placeholders are retired. Foods without
  // an emoji show a grey SF Symbol until real art (e.g. Genmoji) lands here:
  // quinoa: require('../../assets/foods/quinoa.png'),
};

export function getFoodImage(imageKey: string): ImageSourcePropType | null {
  return foodImageMap[imageKey] ?? null;
}
