import assert from 'node:assert/strict';
import { getFoodById } from '@/src/data/loadFoods';
import type { MealCombination } from '@/src/data/types';
import { mealFits, pairFits } from './compatibility';
import { pickFood, pickMeal } from './selectFoods';

function describe(meal: MealCombination): string {
  return `${meal.carbs.name} + ${meal.protein.name} + ${meal.fiber.name}`;
}

function run() {
  const meal = pickMeal();
  assert.equal(meal.protein.category, 'protein');
  assert.equal(meal.carbs.category, 'carbs');
  assert.equal(meal.fiber.category, 'fiber');
  assert.equal(meal.carbs.enabled, true);

  const again = pickMeal(meal);
  // Soft variety: prefer a different id when pool allows it.
  assert.notEqual(again.protein.id, meal.protein.id);
  assert.notEqual(again.carbs.id, meal.carbs.id);
  assert.notEqual(again.fiber.id, meal.fiber.id);

  // Locked slots keep their food, unlocked ones change.
  const held = pickMeal(meal, { carbs: true });
  assert.equal(held.carbs.id, meal.carbs.id);
  assert.notEqual(held.protein.id, meal.protein.id);
  assert.notEqual(held.fiber.id, meal.fiber.id);

  const allHeld = pickMeal(meal, { protein: true, carbs: true, fiber: true });
  assert.deepEqual(allHeld, meal);

  const carbs = pickFood('carbs');
  assert.equal(carbs.category, 'carbs');

  // Only fitting meals come out — free spins and spins around held reels.
  let last = meal;
  for (let i = 0; i < 1000; i++) {
    last = pickMeal(last);
    assert.ok(mealFits(last), `unpassend: ${describe(last)}`);
  }

  const knoedel = getFoodById('dumplings')!;
  const edamame = getFoodById('edamame')!;
  const narrow = { ...meal, carbs: knoedel, protein: edamame };
  for (let i = 0; i < 200; i++) {
    const oneHeld = pickMeal(narrow, { carbs: true });
    assert.equal(oneHeld.carbs.id, 'dumplings');
    assert.ok(mealFits(oneHeld), `unpassend: ${describe(oneHeld)}`);

    const twoHeld = pickMeal(narrow, { carbs: true, protein: true });
    assert.equal(twoHeld.protein.id, 'edamame');
    assert.ok(mealFits(twoHeld), `unpassend: ${describe(twoHeld)}`);
  }

  assert.equal(pairFits(edamame, getFoodById('peas')!), false, 'avoid list');
  assert.equal(pairFits(getFoodById('skyr')!, knoedel), true, 'not on the list');

  console.log('selectFoods.test.ts: ok');
}

run();
