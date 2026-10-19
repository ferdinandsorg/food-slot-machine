import { getFoodsByCategory } from '@/src/data/loadFoods';
import type { Food, FoodCategory, MealCombination } from '@/src/data/types';

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

export function pickMeal(previous?: Partial<MealCombination>): MealCombination {
  return {
    carbs: pickFood('carbs', previous?.carbs?.id),
    protein: pickFood('protein', previous?.protein?.id),
    veg: pickFood('veg', previous?.veg?.id),
  };
}

export function pickSingleSlot(
  category: FoodCategory,
  current: MealCombination,
): MealCombination {
  return {
    ...current,
    [category]: pickFood(category, current[category].id),
  };
}
