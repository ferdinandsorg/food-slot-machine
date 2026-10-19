import foodsJson from './foods.json';
import type { Food, FoodCategory } from './types';

const foods = foodsJson as Food[];

export function getAllFoods(): Food[] {
  return foods;
}

export function getEnabledFoods(): Food[] {
  return foods.filter((food) => food.enabled);
}

export function getFoodsByCategory(category: FoodCategory): Food[] {
  return getEnabledFoods().filter((food) => food.category === category);
}

export function getFoodById(id: string): Food | undefined {
  return foods.find((food) => food.id === id);
}
