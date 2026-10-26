import type { ImageSourcePropType } from 'react-native';

/**
 * Maps imageKey → local food image.
 * Images: Ingredient Atlas (github.com/ionmesca/ingredient-atlas), CC0-1.0,
 * cut out (rembg, no shadow) to transparent 256px WebP by scripts/atlas-cutout.py;
 * slug mapping in assets/foods/atlas/SOURCE.tsv.
 * Foods without an entry fall back to their emoji, then a grey SF Symbol.
 */
const foodImageMap: Record<string, ImageSourcePropType> = {
  amaranth: require('../../assets/foods/atlas/amaranth.webp'),
  asparagus: require('../../assets/foods/atlas/asparagus.webp'),
  avocado: require('../../assets/foods/atlas/avocado.webp'),
  beans: require('../../assets/foods/atlas/beans.webp'),
  beetroot: require('../../assets/foods/atlas/beetroot.webp'),
  bell_pepper: require('../../assets/foods/atlas/bell_pepper.webp'),
  bread: require('../../assets/foods/atlas/bread.webp'),
  broccoli: require('../../assets/foods/atlas/broccoli.webp'),
  brussels_sprouts: require('../../assets/foods/atlas/brussels_sprouts.webp'),
  buckwheat: require('../../assets/foods/atlas/buckwheat.webp'),
  bulgur: require('../../assets/foods/atlas/bulgur.webp'),
  carrots: require('../../assets/foods/atlas/carrots.webp'),
  cauliflower: require('../../assets/foods/atlas/cauliflower.webp'),
  celery: require('../../assets/foods/atlas/celery.webp'),
  chard: require('../../assets/foods/atlas/chard.webp'),
  chickpeas: require('../../assets/foods/atlas/chickpeas.webp'),
  cottage_cheese: require('../../assets/foods/atlas/cottage_cheese.webp'),
  couscous: require('../../assets/foods/atlas/couscous.webp'),
  dumplings: require('../../assets/foods/atlas/dumplings.webp'),
  edamame: require('../../assets/foods/atlas/edamame.webp'),
  eggplant: require('../../assets/foods/atlas/eggplant.webp'),
  eggs: require('../../assets/foods/atlas/eggs.webp'),
  fennel: require('../../assets/foods/atlas/fennel.webp'),
  gnocchi: require('../../assets/foods/atlas/gnocchi.webp'),
  halloumi: require('../../assets/foods/atlas/halloumi.webp'),
  kale: require('../../assets/foods/atlas/kale.webp'),
  kohlrabi: require('../../assets/foods/atlas/kohlrabi.webp'),
  lambs_lettuce: require('../../assets/foods/atlas/lambs_lettuce.webp'),
  leek: require('../../assets/foods/atlas/leek.webp'),
  lentils: require('../../assets/foods/atlas/lentils.webp'),
  millet: require('../../assets/foods/atlas/millet.webp'),
  mozzarella: require('../../assets/foods/atlas/mozzarella.webp'),
  parsnip: require('../../assets/foods/atlas/parsnip.webp'),
  pasta: require('../../assets/foods/atlas/pasta.webp'),
  peas: require('../../assets/foods/atlas/peas.webp'),
  polenta: require('../../assets/foods/atlas/polenta.webp'),
  potato: require('../../assets/foods/atlas/potato.webp'),
  quark: require('../../assets/foods/atlas/quark.webp'),
  quinoa: require('../../assets/foods/atlas/quinoa.webp'),
  red_cabbage: require('../../assets/foods/atlas/red_cabbage.webp'),
  rice: require('../../assets/foods/atlas/rice.webp'),
  savoy_cabbage: require('../../assets/foods/atlas/savoy_cabbage.webp'),
  seitan: require('../../assets/foods/atlas/seitan.webp'),
  shepherds_cheese: require('../../assets/foods/atlas/shepherds_cheese.webp'),
  skyr: require('../../assets/foods/atlas/skyr.webp'),
  soy_chunks: require('../../assets/foods/atlas/soy_chunks.webp'),
  soy_granules: require('../../assets/foods/atlas/soy_granules.webp'),
  spaetzle: require('../../assets/foods/atlas/spaetzle.webp'),
  spinach: require('../../assets/foods/atlas/spinach.webp'),
  sweet_potato: require('../../assets/foods/atlas/sweet_potato.webp'),
  tempeh: require('../../assets/foods/atlas/tempeh.webp'),
  tofu: require('../../assets/foods/atlas/tofu.webp'),
  tomato: require('../../assets/foods/atlas/tomato.webp'),
  white_cabbage: require('../../assets/foods/atlas/white_cabbage.webp'),
  zucchini: require('../../assets/foods/atlas/zucchini.webp'),
};

export function getFoodImage(imageKey: string): ImageSourcePropType | null {
  return foodImageMap[imageKey] ?? null;
}
