import type { ImageSourcePropType } from 'react-native';

/**
 * Maps imageKey → local asset.
 * Add a new require() entry when you drop a matching file into assets/foods/.
 */
const foodImageMap: Record<string, ImageSourcePropType> = {
  potato: require('../../assets/foods/potato.png'),
  rice: require('../../assets/foods/rice.png'),
  oats: require('../../assets/foods/oats.png'),
  whole_wheat_pasta: require('../../assets/foods/whole_wheat_pasta.png'),
  couscous: require('../../assets/foods/couscous.png'),
  quinoa: require('../../assets/foods/quinoa.png'),
  sweet_potato: require('../../assets/foods/sweet_potato.png'),
  polenta: require('../../assets/foods/polenta.png'),
  lentils: require('../../assets/foods/lentils.png'),
  chickpeas: require('../../assets/foods/chickpeas.png'),
  beans: require('../../assets/foods/beans.png'),
  tofu: require('../../assets/foods/tofu.png'),
  tempeh: require('../../assets/foods/tempeh.png'),
  eggs: require('../../assets/foods/eggs.png'),
  quark: require('../../assets/foods/quark.png'),
  edamame: require('../../assets/foods/edamame.png'),
  broccoli: require('../../assets/foods/broccoli.png'),
  bell_pepper: require('../../assets/foods/bell_pepper.png'),
  carrots: require('../../assets/foods/carrots.png'),
  spinach: require('../../assets/foods/spinach.png'),
  peas: require('../../assets/foods/peas.png'),
  zucchini: require('../../assets/foods/zucchini.png'),
  cauliflower: require('../../assets/foods/cauliflower.png'),
  lambs_lettuce: require('../../assets/foods/lambs_lettuce.png'),
};

export function getFoodImage(imageKey: string): ImageSourcePropType | null {
  return foodImageMap[imageKey] ?? null;
}
