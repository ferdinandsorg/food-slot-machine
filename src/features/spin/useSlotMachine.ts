import { useCallback, useEffect, useRef, useState } from 'react';

import * as feedback from './feedback';
import { pickMeal, type LockState } from './selectFoods';
import { reelDuration, reelImpactAt, reelLoops } from './spinTiming';
import type { FoodCategory, MealCombination } from '@/src/data/types';
import { SLOT_ORDER } from '@/src/data/types';

/** Strip travel: 1 = foods move up (default), -1 = foods move down. */
export type SpinDirection = 1 | -1;

/** One spin instruction for a reel; a new `key` starts the animation. */
export type ReelSpin = {
  key: number;
  durationMs: number;
  loops: number;
  direction: SpinDirection;
};

export type SlotMachineState = {
  meal: MealCombination;
  locked: LockState;
  spinning: boolean;
  spinningSlots: Record<FoodCategory, boolean>;
  reelSpins: Record<FoodCategory, ReelSpin>;
  allLocked: boolean;
  /** Increments when the last reel hits the payline — drives the celebration. */
  resultKey: number;
  /** Increments when Spin is pressed while every reel is held. */
  deniedKey: number;
  spinAll: () => void;
  /** Spin a single reel, e.g. after a vertical swipe on it. */
  spinReel: (category: FoodCategory, direction: SpinDirection) => void;
  toggleLock: (category: FoodCategory) => void;
};

function allFalse(): Record<FoodCategory, boolean> {
  return { protein: false, carbs: false, fiber: false };
}

function initialSpins(): Record<FoodCategory, ReelSpin> {
  const idle: ReelSpin = { key: 0, durationMs: 0, loops: 0, direction: 1 };
  return { protein: idle, carbs: idle, fiber: idle };
}

export function useSlotMachine(): SlotMachineState {
  const [meal, setMeal] = useState<MealCombination>(() => pickMeal());
  const [locked, setLocked] = useState<LockState>(allFalse);
  const [spinningSlots, setSpinningSlots] = useState(allFalse);
  const [reelSpins, setReelSpins] = useState(initialSpins);
  const [resultKey, setResultKey] = useState(0);
  const [deniedKey, setDeniedKey] = useState(0);
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

  /** Spin the given reels; every other reel keeps its food. */
  const startSpin = useCallback(
    (toSpin: FoodCategory[], direction: SpinDirection) => {
      spinningRef.current = true;
      timersRef.current = [];
      feedback.spinStart();

      const keep = Object.fromEntries(
        SLOT_ORDER.map((category) => [category, !toSpin.includes(category)]),
      ) as LockState;
      const next = pickMeal(mealRef.current, keep);
      setMeal(next);

      const spins: Partial<Record<FoodCategory, ReelSpin>> = {};
      toSpin.forEach((category, order) => {
        spins[category] = {
          key: Date.now() + order,
          durationMs: reelDuration(order),
          loops: reelLoops(order),
          direction,
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
        // Feedback lands on the visible hit (overshoot), state flips after settling.
        const impact = setTimeout(() => {
          if (isLast) {
            feedback.result();
            setResultKey((k) => k + 1);
          } else {
            feedback.reelStop();
          }
        }, reelImpactAt(order));
        const settled = setTimeout(() => {
          setSpinningSlots((prev) => ({ ...prev, [category]: false }));
          if (isLast) {
            spinningRef.current = false;
          }
        }, reelDuration(order));
        timersRef.current.push(impact, settled);
      });
    },
    [],
  );

  const spinAll = useCallback(() => {
    if (spinningRef.current) {
      return;
    }
    const toSpin = SLOT_ORDER.filter(
      (category) => !lockedRef.current[category],
    );
    if (toSpin.length === 0) {
      feedback.denied();
      setDeniedKey((k) => k + 1);
      return;
    }
    startSpin(toSpin, 1);
  }, [startSpin]);

  const spinReel = useCallback(
    (category: FoodCategory, direction: SpinDirection) => {
      if (spinningRef.current) {
        return;
      }
      if (lockedRef.current[category]) {
        feedback.denied();
        return;
      }
      startSpin([category], direction);
    },
    [startSpin],
  );

  const toggleLock = useCallback((category: FoodCategory) => {
    if (spinningRef.current) {
      return;
    }
    feedback.holdToggled();
    setLocked((prev) => ({ ...prev, [category]: !prev[category] }));
  }, []);

  return {
    meal,
    locked,
    spinning,
    spinningSlots,
    reelSpins,
    allLocked,
    resultKey,
    deniedKey,
    spinAll,
    spinReel,
    toggleLock,
  };
}
