export type FoodCategory = 'carbs' | 'protein' | 'veg';

export type Food = {
  id: string;
  name: string;
  category: FoodCategory;
  imageKey: string;
  tags: string[];
  enabled: boolean;
};

export type MealCombination = {
  carbs: Food;
  protein: Food;
  veg: Food;
};

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  carbs: 'Kohlenhydrate',
  protein: 'Protein',
  veg: 'Gemüse',
};

export const SLOT_ORDER: FoodCategory[] = ['carbs', 'protein', 'veg'];
