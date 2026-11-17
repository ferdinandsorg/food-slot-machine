import avoidPairsJson from '@/src/data/avoidPairs.json';
import type { AvoidPair, Food, MealCombination } from '@/src/data/types';

const avoid = new Set(
  (avoidPairsJson as AvoidPair[]).flatMap(([a, b]) => [`${a}|${b}`, `${b}|${a}`]),
);

/** Two foods fit unless they're on the avoid list. */
export function pairFits(a: Food, b: Food): boolean {
  return !avoid.has(`${a.id}|${b.id}`);
}

/** A meal fits when every pair of its three foods fits. */
export function mealFits(meal: MealCombination): boolean {
  const { carbs, protein, fiber } = meal;
  return pairFits(carbs, protein) && pairFits(carbs, fiber) && pairFits(protein, fiber);
}
