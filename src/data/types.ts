export type FoodCategory = 'protein' | 'carbs' | 'fiber';

export type Food = {
  id: string;
  name: string;
  category: FoodCategory;
  imageKey: string;
  tags: string[];
  enabled: boolean;
};

export type MealCombination = Record<FoodCategory, Food>;

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  protein: 'Protein',
  carbs: 'Kohlenhydrate',
  fiber: 'Ballaststoffe',
};

/** Left-to-right reel order on screen. */
export const SLOT_ORDER: FoodCategory[] = ['carbs', 'protein', 'fiber'];
