import type { FoodCategory } from '@/src/data/types';

/** Staggered stop delays so reels feel like a real slot machine. */
export const REEL_STOP_DELAYS_MS: Record<FoodCategory, number> = {
  carbs: 900,
  protein: 1400,
  veg: 1900,
};

export const SPIN_TOTAL_MS = 2000;
