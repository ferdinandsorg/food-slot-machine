import { getFoodsByCategory } from '@/src/data/loadFoods';
import type { Food, FoodCategory, MealCombination } from '@/src/data/types';
import { SLOT_ORDER } from '@/src/data/types';

import { mealFits } from './compatibility';

export type LockState = Record<FoodCategory, boolean>;

function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

/** Pick a random enabled food in a category, optionally avoiding the previous id. */
export function pickFood(category: FoodCategory, avoidId?: string): Food {
  const pool = getFoodsByCategory(category);
  if (pool.length === 0) {
    throw new Error(`No enabled foods for category: ${category}`);
  }

  if (pool.length === 1) {
    return pool[0];
  }

  const candidates = avoidId ? pool.filter((f) => f.id !== avoidId) : pool;
  const list = candidates.length > 0 ? candidates : pool;
  return list[randomIndex(list.length)];
}

/** Redraws before giving up on a fitting meal, so a spin never stalls. */
const MAX_ATTEMPTS = 50;

/**
 * New combination; locked slots keep their current food.
 * Draws until the three foods fit together (see compatibility.ts), so every
 * fitting meal stays equally likely and only outliers are filtered out.
 */
export function pickMeal(
  previous?: Partial<MealCombination>,
  locked?: Partial<LockState>,
): MealCombination {
  let meal = drawMeal(previous, locked);
  for (let i = 1; i < MAX_ATTEMPTS && !mealFits(meal); i++) {
    meal = drawMeal(previous, locked);
  }
  return meal;
}

function drawMeal(
  previous?: Partial<MealCombination>,
  locked?: Partial<LockState>,
): MealCombination {
  const meal = {} as MealCombination;
  for (const category of SLOT_ORDER) {
    const current = previous?.[category];
    meal[category] =
      locked?.[category] && current ? current : pickFood(category, current?.id);
  }
  return meal;
}
