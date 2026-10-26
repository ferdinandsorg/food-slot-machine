import { getFoodsByCategory } from '@/src/data/loadFoods';
import type { Food, FoodCategory, MealCombination } from '@/src/data/types';
import { SLOT_ORDER } from '@/src/data/types';

export type LockState = Record<FoodCategory, boolean>;

function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

/** Pick a random enabled food in a category, optionally avoiding the previous id. */
export function pickFood(
  category: FoodCategory,
  avoidId?: string,
): Food {
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

/** New combination; locked slots keep their current food. */
export function pickMeal(
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
