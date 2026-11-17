/**
 * Shows how the avoid list shapes the slot machine.
 * Run after `npm run data:foods`: npm run data:report
 */
import { getFoodsByCategory } from '@/src/data/loadFoods';
import type { MealCombination } from '@/src/data/types';
import { CATEGORY_LABELS, SLOT_ORDER } from '@/src/data/types';
import { mealFits } from '@/src/features/spin/compatibility';

/** Foods that land in fewer fitting meals than this share barely ever show up. */
const RARE_SHARE = 0.2;
const SAMPLES = 15;

const meals: MealCombination[] = [];
for (const carbs of getFoodsByCategory('carbs')) {
  for (const protein of getFoodsByCategory('protein')) {
    for (const fiber of getFoodsByCategory('fiber')) {
      meals.push({ carbs, protein, fiber });
    }
  }
}

const fitting = meals.filter(mealFits);
const outliers = meals.filter((m) => !mealFits(m));
const pct = (n: number, of: number) => `${Math.round((n / of) * 100)} %`;
const name = (m: MealCombination) => SLOT_ORDER.map((c) => m[c].name).join(' + ');

function sample<T>(list: T[], n: number): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

console.log(`\nKombinationen: ${fitting.length} von ${meals.length} passen (${pct(fitting.length, meals.length)})\n`);

for (const category of SLOT_ORDER) {
  console.log(`${CATEGORY_LABELS[category]}`);
  for (const food of getFoodsByCategory(category)) {
    const all = meals.filter((m) => m[category].id === food.id).length;
    const fits = fitting.filter((m) => m[category].id === food.id).length;
    const flag = fits / all < RARE_SHARE ? '  ⚠ selten' : '';
    console.log(`  ${food.name.padEnd(16)} ${pct(fits, all).padStart(5)}  ${flag}`);
  }
  console.log('');
}

console.log('Passt – Stichprobe');
for (const m of sample(fitting, SAMPLES)) console.log(`  ✓ ${name(m)}`);
console.log('\nFällt raus – Stichprobe');
for (const m of sample(outliers, SAMPLES)) console.log(`  ✗ ${name(m)}`);
console.log('');
