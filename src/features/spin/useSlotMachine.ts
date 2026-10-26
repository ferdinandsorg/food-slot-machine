import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { pickMeal, type LockState } from './selectFoods';
import { reelDuration, reelLoops } from './spinTiming';
import type { FoodCategory, MealCombination } from '@/src/data/types';
import { SLOT_ORDER } from '@/src/data/types';

function hapticImpact(style: Haptics.ImpactFeedbackStyle) {
  if (Platform.OS === 'web') return;
  void Haptics.impactAsync(style).catch(() => undefined);
}

function hapticSelection() {
  if (Platform.OS === 'web') return;
  void Haptics.selectionAsync().catch(() => undefined);
}

function hapticSuccess() {
  if (Platform.OS === 'web') return;
  void Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success,
  ).catch(() => undefined);
}

/** One spin instruction for a reel; a new `key` starts the animation. */
export type ReelSpin = {
  key: number;
  durationMs: number;
  loops: number;
};

export type SlotMachineState = {
  meal: MealCombination;
  locked: LockState;
  spinning: boolean;
  spinningSlots: Record<FoodCategory, boolean>;
  reelSpins: Record<FoodCategory, ReelSpin>;
  allLocked: boolean;
  spinAll: () => void;
  toggleLock: (category: FoodCategory) => void;
};

function allFalse(): Record<FoodCategory, boolean> {
  return { protein: false, carbs: false, fiber: false };
}

function initialSpins(): Record<FoodCategory, ReelSpin> {
  const idle = { key: 0, durationMs: 0, loops: 0 };
  return { protein: idle, carbs: idle, fiber: idle };
}

export function useSlotMachine(): SlotMachineState {
  const [meal, setMeal] = useState<MealCombination>(() => pickMeal());
  const [locked, setLocked] = useState<LockState>(allFalse);
  const [spinningSlots, setSpinningSlots] = useState(allFalse);
  const [reelSpins, setReelSpins] = useState(initialSpins);
  const mealRef = useRef(meal);
  const lockedRef = useRef(locked);
  const spinningRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  mealRef.current = meal;
  lockedRef.current = locked;

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const spinning = SLOT_ORDER.some((category) => spinningSlots[category]);
  const allLocked = SLOT_ORDER.every((category) => locked[category]);

  const spinAll = useCallback(() => {
    const toSpin = SLOT_ORDER.filter((category) => !lockedRef.current[category]);
    if (spinningRef.current || toSpin.length === 0) {
      return;
    }

    spinningRef.current = true;
    timersRef.current = [];
    hapticImpact(Haptics.ImpactFeedbackStyle.Medium);

    const next = pickMeal(mealRef.current, lockedRef.current);
    setMeal(next);

    const spins: Partial<Record<FoodCategory, ReelSpin>> = {};
    toSpin.forEach((category, order) => {
      spins[category] = {
        key: Date.now() + order,
        durationMs: reelDuration(order),
        loops: reelLoops(order),
      };
    });
    setReelSpins((prev) => ({ ...prev, ...spins }));
    setSpinningSlots((prev) => {
      const nextSlots = { ...prev };
      toSpin.forEach((category) => {
        nextSlots[category] = true;
      });
      return nextSlots;
    });

    toSpin.forEach((category, order) => {
      const isLast = order === toSpin.length - 1;
      const timer = setTimeout(() => {
        setSpinningSlots((prev) => ({ ...prev, [category]: false }));
        if (isLast) {
          spinningRef.current = false;
          hapticSuccess();
        } else {
          hapticSelection();
        }
      }, reelDuration(order));
      timersRef.current.push(timer);
    });
  }, []);

  const toggleLock = useCallback((category: FoodCategory) => {
    if (spinningRef.current) {
      return;
    }
    hapticSelection();
    setLocked((prev) => ({ ...prev, [category]: !prev[category] }));
  }, []);

  return {
    meal,
    locked,
    spinning,
    spinningSlots,
    reelSpins,
    allLocked,
    spinAll,
    toggleLock,
  };
}
