import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { MealCombination } from '@/src/data/types';
import { SLOT_ORDER } from '@/src/data/types';

/** A saved combination, stored by food id in reel order. */
export type SavedMeal = {
  key: string;
  ids: string[];
  savedAt: number;
};

const STORAGE_KEY = 'foodslot.savedMeals';

export function mealKey(meal: MealCombination): string {
  return SLOT_ORDER.map((category) => meal[category].id).join('|');
}

export async function loadSavedMeals(): Promise<SavedMeal[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedMeal[]) : [];
  } catch {
    return [];
  }
}

async function writeSavedMeals(list: SavedMeal[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function removeSavedMeal(key: string): Promise<SavedMeal[]> {
  const next = (await loadSavedMeals()).filter((entry) => entry.key !== key);
  await writeSavedMeals(next);
  return next;
}

/** Saved combinations plus a toggle for the one currently on the reels. */
export function useSavedMeals(meal: MealCombination) {
  const [saved, setSaved] = useState<SavedMeal[]>([]);

  /** Re-read storage, e.g. after returning from the saved-list screen. */
  const reload = useCallback(() => {
    loadSavedMeals().then(setSaved);
  }, []);

  useEffect(reload, [reload]);

  const key = mealKey(meal);
  const isSaved = saved.some((entry) => entry.key === key);

  const toggle = useCallback(async () => {
    const current = await loadSavedMeals();
    const exists = current.some((entry) => entry.key === key);
    const next = exists
      ? current.filter((entry) => entry.key !== key)
      : [{ key, ids: key.split('|'), savedAt: Date.now() }, ...current];
    setSaved(next);
    await writeSavedMeals(next);
    return !exists;
  }, [key]);

  return { saved, isSaved, toggle, reload };
}
