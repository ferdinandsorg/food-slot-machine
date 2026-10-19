import * as Haptics from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';

import { pickMeal, pickSingleSlot } from './selectFoods';
import { REEL_STOP_DELAYS_MS, SPIN_TOTAL_MS } from './spinTiming';
import type { FoodCategory, MealCombination } from '@/src/data/types';
import { SLOT_ORDER } from '@/src/data/types';

export type ReelState = {
  spinning: boolean;
  food: MealCombination[FoodCategory] | null;
};

export type SlotMachineState = {
  meal: MealCombination | null;
  spinning: boolean;
  spinningSlots: Record<FoodCategory, boolean>;
  spinAll: () => void;
  spinSlot: (category: FoodCategory) => void;
};

function emptySpinning(): Record<FoodCategory, boolean> {
  return { carbs: false, protein: false, veg: false };
}

export function useSlotMachine(): SlotMachineState {
  const [meal, setMeal] = useState<MealCombination | null>(() => pickMeal());
  const [spinning, setSpinning] = useState(false);
  const [spinningSlots, setSpinningSlots] = useState(emptySpinning);
  const mealRef = useRef(meal);
  const spinningRef = useRef(false);

  mealRef.current = meal;

  const spinAll = useCallback(() => {
    if (spinningRef.current) {
      return;
    }

    spinningRef.current = true;
    setSpinning(true);
    setSpinningSlots({ carbs: true, protein: true, veg: true });
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const next = pickMeal(mealRef.current ?? undefined);

    for (const category of SLOT_ORDER) {
      const delay = REEL_STOP_DELAYS_MS[category];
      setTimeout(() => {
        setMeal((prev) => ({
          ...(prev ?? next),
          [category]: next[category],
        }));
        setSpinningSlots((prev) => ({ ...prev, [category]: false }));
        void Haptics.selectionAsync();
      }, delay);
    }

    setTimeout(() => {
      setMeal(next);
      setSpinning(false);
      spinningRef.current = false;
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, SPIN_TOTAL_MS);
  }, []);

  const spinSlot = useCallback((category: FoodCategory) => {
    if (spinningRef.current || !mealRef.current) {
      return;
    }

    spinningRef.current = true;
    setSpinning(true);
    setSpinningSlots((prev) => ({ ...prev, [category]: true }));
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const next = pickSingleSlot(category, mealRef.current);
    const delay = REEL_STOP_DELAYS_MS[category];

    setTimeout(() => {
      setMeal(next);
      setSpinningSlots((prev) => ({ ...prev, [category]: false }));
      setSpinning(false);
      spinningRef.current = false;
      void Haptics.selectionAsync();
    }, delay);
  }, []);

  return {
    meal,
    spinning,
    spinningSlots,
    spinAll,
    spinSlot,
  };
}
